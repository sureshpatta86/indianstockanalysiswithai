export interface LiveStockData {
  symbol: string;
  name: string;
  exchange: string;
  cmp: number;
  currency: string;
  dayChange: number;
  dayChangePercent: number;
  dayHigh: number;
  dayLow: number;
  weekHigh52: number;
  weekLow52: number;
  marketCap: number;
  volume: number;
  avgVolume: number;
  previousClose: number;
  fetchedAt: string;
}

/**
 * Search Yahoo Finance for an Indian stock symbol.
 * Returns the best-matching NSE/BSE symbol.
 */
async function searchSymbol(query: string): Promise<string | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=6&newsCount=0&listsCount=0&enableFuzzyQuery=true`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const quotes = data.quotes || [];

    // Prefer NSE (.NS), then BSE (.BO)
    const nse = quotes.find(
      (q: { exchange?: string; symbol?: string }) =>
        q.exchange === "NSI" || q.symbol?.endsWith(".NS")
    );
    if (nse) return nse.symbol;
    const bse = quotes.find(
      (q: { exchange?: string; symbol?: string }) =>
        q.exchange === "BSE" || q.symbol?.endsWith(".BO")
    );
    if (bse) return bse.symbol;

    // If user passed something like "RELIANCE.NS" directly
    const direct = quotes.find((q: { symbol?: string }) =>
      q.symbol?.endsWith(".NS") || q.symbol?.endsWith(".BO")
    );
    return direct?.symbol || null;
  } catch {
    return null;
  }
}

/**
 * Fetch live quote from Yahoo Finance chart endpoint.
 */
async function fetchQuote(symbol: string): Promise<LiveStockData | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const meta = data.chart?.result?.[0]?.meta;
    if (!meta) return null;

    return {
      symbol: meta.symbol,
      name: meta.shortName || meta.longName || symbol,
      exchange: meta.exchangeName || "",
      cmp: meta.regularMarketPrice ?? 0,
      currency: meta.currency || "INR",
      dayChange: (meta.regularMarketPrice ?? 0) - (meta.chartPreviousClose ?? meta.previousClose ?? 0),
      dayChangePercent:
        meta.chartPreviousClose || meta.previousClose
          ? (((meta.regularMarketPrice ?? 0) - (meta.chartPreviousClose ?? meta.previousClose)) /
              (meta.chartPreviousClose ?? meta.previousClose)) *
            100
          : 0,
      dayHigh: meta.regularMarketDayHigh ?? 0,
      dayLow: meta.regularMarketDayLow ?? 0,
      weekHigh52: meta.fiftyTwoWeekHigh ?? 0,
      weekLow52: meta.fiftyTwoWeekLow ?? 0,
      marketCap: 0, // chart endpoint doesn't provide this reliably
      volume: meta.regularMarketVolume ?? 0,
      avgVolume: 0,
      previousClose: meta.chartPreviousClose ?? meta.previousClose ?? 0,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Try fetching live market data for an Indian stock.
 * Falls back gracefully — returns null if the fetch fails.
 */
export async function fetchLiveStockData(
  stockName: string
): Promise<LiveStockData | null> {
  // 1. Try direct symbol if user typed e.g. "RELIANCE" or "RELIANCE.NS"
  const directSymbol = stockName.toUpperCase().includes(".NS") || stockName.toUpperCase().includes(".BO")
    ? stockName
    : `${stockName.toUpperCase().replace(/\s+/g, "")}.NS`;

  const directQuote = await fetchQuote(directSymbol);
  if (directQuote && directQuote.cmp > 0) return directQuote;

  // 2. Search Yahoo Finance for the symbol
  const symbol = await searchSymbol(stockName);
  if (!symbol) return null;

  return fetchQuote(symbol);
}

/**
 * Format live data into a context string for the AI prompt.
 */
export function formatLiveDataContext(data: LiveStockData): string {
  const change = data.dayChange >= 0 ? `+${data.dayChange.toFixed(2)}` : data.dayChange.toFixed(2);
  const changePct = data.dayChangePercent >= 0
    ? `+${data.dayChangePercent.toFixed(2)}%`
    : `${data.dayChangePercent.toFixed(2)}%`;

  return `
══════════════════════════════════════
LIVE MARKET DATA (fetched ${data.fetchedAt})
══════════════════════════════════════
Symbol: ${data.symbol}
Exchange: ${data.exchange}
CMP: ₹${data.cmp.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Day Change: ${change} (${changePct})
Day Range: ₹${data.dayLow.toFixed(2)} — ₹${data.dayHigh.toFixed(2)}
Previous Close: ₹${data.previousClose.toFixed(2)}
52-Week Range: ₹${data.weekLow52.toFixed(2)} — ₹${data.weekHigh52.toFixed(2)}
Volume: ${data.volume.toLocaleString("en-IN")}

IMPORTANT: Use the CMP above as the CURRENT MARKET PRICE. This is LIVE data.
Do NOT use stale prices from your training data. The 52-week range above is also live.
══════════════════════════════════════`;
}
