import { streamText, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { STOCK_ANALYSIS_SYSTEM_PROMPT } from "@/lib/system-prompt";
import { fetchLiveStockData, formatLiveDataContext } from "@/lib/stock-data";

export const maxDuration = 300;

type AnalysisMode = "fast" | "deep";

/** Always gpt-5.4 — fast model for data collection */
function getDataModel() {
  const provider = process.env.AI_PROVIDER || "openai";
  if (provider === "anthropic") {
    return anthropic(process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514");
  }
  return openai(process.env.OPENAI_MODEL || "gpt-5.4");
}

/** Fast → gpt-5.4, Deep → gpt-5.4-pro (reasoning) */
function getAnalysisModel(mode: AnalysisMode) {
  const provider = process.env.AI_PROVIDER || "openai";
  if (provider === "anthropic") {
    const modelId = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
    return { model: anthropic(modelId), isReasoning: false };
  }
  if (mode === "deep") {
    const modelId = process.env.OPENAI_DEEP_MODEL || "gpt-5.4-pro";
    return { model: openai.responses(modelId), isReasoning: true };
  }
  const modelId = process.env.OPENAI_MODEL || "gpt-5.4";
  return { model: openai(modelId), isReasoning: false };
}

export async function POST(req: Request) {
  const { stockName, horizon, mode = "fast" } = await req.json();

  if (!stockName || !horizon) {
    return new Response(
      JSON.stringify({ error: "Stock name and investment horizon are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Fetch live market data (best-effort, non-blocking on failure)
  const liveData = await fetchLiveStockData(stockName);
  const liveDataContext = liveData ? formatLiveDataContext(liveData) : "";

  // ═══════════════════════════════════════════
  // FAST MODE: Single-call pipeline (gpt-5.4 does everything)
  // DEEP MODE: Two-step pipeline (gpt-5.4 fetches data → gpt-5.4-pro analyzes)
  // ═══════════════════════════════════════════

  if (mode === "fast") {
    return handleFastMode(stockName, horizon, liveDataContext);
  } else {
    return handleDeepMode(stockName, horizon, liveDataContext);
  }
}

// ═══════════════════════════════════════════
// FAST MODE — single streamText call with gpt-5.4
// ═══════════════════════════════════════════
function handleFastMode(stockName: string, horizon: string, liveDataContext: string) {
  const userMessage = buildFullAnalysisPrompt(stockName, horizon, liveDataContext);
  const { model } = getAnalysisModel("fast");

  const result = streamText({
    model,
    system: STOCK_ANALYSIS_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
    temperature: 0.1,
    abortSignal: AbortSignal.timeout(180_000),
  });

  return result.toTextStreamResponse();
}

// ═══════════════════════════════════════════
// DEEP MODE — Step 1: gpt-5.4 data fetch → Step 2: gpt-5.4-pro analysis
// ═══════════════════════════════════════════
async function handleDeepMode(stockName: string, horizon: string, liveDataContext: string) {
  // STEP 1: DATA COLLECTION — always gpt-5.4
  const dataFetchPrompt = buildDataFetchPrompt(stockName, liveDataContext);
  const dataModel = getDataModel();

  const { text: rawData } = await generateText({
    model: dataModel,
    messages: [{ role: "user", content: dataFetchPrompt }],
    temperature: 0.1,
    abortSignal: AbortSignal.timeout(180_000), // 3 min for data fetch
  });

  // STEP 2: DEEP ANALYSIS — gpt-5.4-pro (reasoning model)
  const analysisPrompt = `Here is the comprehensive raw data collected for "${stockName}" with investment horizon "${horizon}":

--- RAW DATA START ---
${rawData}
--- RAW DATA END ---

${liveDataContext ? `\nIMPORTANT — LIVE MARKET DATA (use these values as definitive):\n${liveDataContext}\n` : ""}

Using the raw data above, perform the COMPLETE THREE-PILLAR ANALYSIS and produce the final JSON output:

1. FUNDAMENTAL ANALYSIS: Valuation assessment (sector-specific primary metric), growth classification, health signals, returns quality, peer standing, ownership trends. Apply all sector-specific rules.

2. TECHNICAL ANALYSIS: Score all 15 indicators (+1/0/-1), calculate net technical score (0-100), classify trend/momentum/volume, identify divergences, chart patterns, support/resistance levels, stop-loss.

3. SENTIMENT ANALYSIS: Score all 8 sentiment signals with weights, calculate weighted sentiment score (0-100), identify red flags and contrarian signals.

4. COMBINED VERDICT: Apply horizon-based weights (${horizon}), adjust for market cap and F&O status, compute combined score, determine verdict (STRONG BUY ZONE / BUY ZONE / ACCUMULATE ON DIPS / HOLD-WAIT / REDUCE-EXIT / AVOID), check signal alignment, set entry zone, stop-loss, target zone. Apply red flag override if needed.

Respond with ONLY the JSON object as specified in the system prompt. No markdown, no code fences, no extra text. Every section must have real data — minimize DATA UNAVAILABLE.`;

  const { model } = getAnalysisModel("deep");

  const result = streamText({
    model,
    system: STOCK_ANALYSIS_SYSTEM_PROMPT,
    messages: [{ role: "user", content: analysisPrompt }],
    // No temperature for reasoning models
    abortSignal: AbortSignal.timeout(840_000), // 14 min for deep analysis
  });

  return result.toTextStreamResponse();
}

// ═══════════════════════════════════════════
// PROMPT BUILDERS
// ═══════════════════════════════════════════

function buildFullAnalysisPrompt(stockName: string, horizon: string, liveDataContext: string): string {
  return `Analyze the Indian stock: "${stockName}" for an investment horizon of "${horizon}".
${liveDataContext ? `\n${liveDataContext}\n` : ""}

Perform COMPLETE THREE-PILLAR ANALYSIS:

PILLAR 1 — FUNDAMENTAL ANALYSIS:
- Listing verification on NSE/BSE (provide ISIN)
- Sector detection and sector-specific metrics
- Key valuation ratios: P/E, P/B, EV/EBITDA at overview level
- Universal data fetch: CMP, market cap, 52W high/low, revenue/profit CAGR (3yr and 5yr), EPS, margins, FCF, debt ratios, ROE, ROCE, dividends, ownership, peers, news
- 5 years of annual financial data (FY21–FY25): revenue, PAT, EBITDA margin, NPM, ROE, ROCE, D/E, FCF, DPS
- 8 quarters of EPS data with YoY changes
- 8 quarters of shareholding data (promoter, FII, DII)
- Sector-specific valuation using the correct primary metric
- FCF trend for 5 years with signals
- Net debt and cash equivalents
- Growth, health, returns, peer comparison (3-5 peers), ownership analysis
- 3-5 recent news items with headlines, summaries, and sources
- Signal classifications for overview metrics
- Scenarios (bear/base/bull) for the stated horizon

PILLAR 2 — TECHNICAL ANALYSIS:
- Price position vs 50 EMA, 100 EMA, 200 SMA (daily) — EMA alignment classification
- Golden Cross / Death Cross status in last 6 months
- Distance from 52-week high and low
- Key support levels (3) and resistance levels (3) with sources (Fibonacci, SMA, swing)
- RSI (14) — daily and weekly values with zone classification and divergence check
- MACD (12,26,9) — daily and weekly crossover status, histogram, zero-line position
- ADX (14) — value, trend strength, +DI vs -DI direction
- Stochastic RSI — value and zone
- Supertrend (10,3) — daily and weekly BUY/SELL signals with values
- Bollinger Bands — position and squeeze detection
- Volume analysis — current vs 20-day average, OBV trend and divergence
- Delivery volume % — current, 20-day avg, classification, delivery+price signal
- Ichimoku Cloud (weekly) — price position, cloud color, Tenkan vs Kijun, Chikou span, future cloud
- Fibonacci retracement and extension levels
- 15-indicator scorecard with scores (+1/0/-1) and net technical score (0-100)
- Chart pattern detection if visible
- Stop-loss and trailing stop suggestions

PILLAR 3 — SENTIMENT ANALYSIS:
- FII/FPI holding trend (last 4 quarters) with signal
- DII/MF holding trend with MF scheme count and top holders
- Bulk/block deals in last 3 months
- Insider/promoter open-market buys and sells (last 6 months) with pledge status
- Analyst consensus — rating breakdown (Strong Buy/Buy/Hold/Sell/Strong Sell), average target, recent upgrades/downgrades
- Options chain (if F&O stock) — PCR, OI interpretation, max pain, highest Call/Put OI strikes
- News sentiment — classify last 10 articles as positive/neutral/negative with dominant narrative
- Earnings call tone from most recent quarter
- Market mood — MMI value and zone, India VIX, Google Trends
- 8-signal sentiment scorecard with weighted score (0-100)
- Red flags and contrarian signals

COMBINED VERDICT:
- Calculate weighted combined score based on horizon "${horizon}" and market cap category
- Apply horizon-based weights (6mo: F35/T40/S25, 1yr: F45/T30/S25, 2-3yr: F55/T25/S20, 5yr+: F60/T20/S20)
- Adjust for market cap category (large/mid/small) and F&O status
- Combined verdict: STRONG BUY ZONE / BUY ZONE / ACCUMULATE ON DIPS / HOLD-WAIT / REDUCE-EXIT / AVOID
- Signal alignment check (3/3, 2/3, or conflicting)
- Entry zone, stop-loss, target zone reference levels
- Data confidence for each pillar
- Red flag override if applicable

Use your training knowledge from Screener.in, Moneycontrol, NSE, BSE, Tickertape, Tijori Finance, TradingView, Chartink, Investing.com, Trendlyne, and company annual reports. For market data, use the most recent known values with approximate dates.

Respond with ONLY the JSON object as specified in the system prompt. No markdown, no code fences, no extra text. Every section must have real data — minimize DATA UNAVAILABLE.`;
}

function buildDataFetchPrompt(stockName: string, liveDataContext: string): string {
  return `You are a financial data researcher. Collect ALL available data for the Indian stock: "${stockName}".
${liveDataContext ? `\n${liveDataContext}\n` : ""}

Gather and output EVERY data point below in a structured format. Use your training knowledge from Screener.in, Moneycontrol, NSE, BSE, Tickertape, Tijori Finance, TradingView, Chartink, Investing.com, Trendlyne, and company annual reports. Use the most recent known values with approximate dates.

COMPANY INFO:
- Legal name, NSE symbol, BSE code, ISIN, sector, sub-sector, face value
- CMP, market cap, 52W high/low, day change
- Brief company description

FUNDAMENTAL DATA:
- Valuation: P/E, P/B, EV/EBITDA, sector-specific primary metric
- Revenue and Profit CAGR (3yr, 5yr)
- EPS (latest), margins (EBITDA, NPM), FCF, debt ratios (D/E, interest coverage, current ratio)
- ROE, ROCE, ROA (if banking)
- Dividend yield & history
- Net debt, cash equivalents
- 5 years annual financials (FY21–FY25): revenue, PAT, EBITDA margin, NPM, ROE, ROCE, D/E, FCF, DPS
- 8 quarters of EPS with YoY changes
- Sector-specific metrics (banking: NIM, GNPA, NNPA, CAR, CASA; IT: deal TCV, attrition; pharma: ANDA pipeline, FDA status; etc.)
- 3-5 comparable peers with key metrics (CMP, market cap, P/E, P/B, ROE, revenue growth)
- 3-5 recent news items with headline, summary, source, date

TECHNICAL DATA:
- Price vs 50 EMA, 100 EMA, 200 SMA (daily) — values and EMA alignment
- Golden Cross / Death Cross status (last 6 months)
- Support levels (3) and Resistance levels (3) with sources
- RSI (14) daily and weekly values
- MACD (12,26,9) daily and weekly — crossover status, histogram direction, zero-line position
- ADX (14) — value, +DI vs -DI
- Stochastic RSI — value
- Supertrend (10,3) — daily and weekly signals with values
- Bollinger Bands — position, squeeze status
- Volume: current vs 20-day average, OBV trend
- Delivery volume %: current, 20-day avg
- Ichimoku Cloud (weekly): price position, cloud color, Tenkan vs Kijun, Chikou span, future cloud
- Fibonacci levels
- Any visible chart patterns

SENTIMENT DATA:
- 8 quarters of shareholding data (promoter %, FII %, DII %)
- MF scheme count (current and year-ago), top MF holders
- Bulk/block deals in last 3 months
- Insider/promoter transactions (last 6 months), pledge status
- Analyst consensus: total analysts, rating breakdown (Strong Buy/Buy/Hold/Sell/Strong Sell), average target, highest/lowest target, recent upgrades/downgrades
- Options chain (if F&O): PCR, max pain, highest Call/Put OI strikes, OI interpretation
- News sentiment: classify last 10 articles (positive/neutral/negative), dominant narrative
- Earnings call tone (most recent quarter)
- Market mood: MMI value, India VIX, Google Trends for this stock

Output ALL data in a clear structured text format. Use approximate values prefixed with "~" where exact data isn't available. This is a data dump — no analysis or verdict needed. Be comprehensive.`;
}
