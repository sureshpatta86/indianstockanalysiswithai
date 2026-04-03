"use client";

import { useState } from "react";
import type { StockData } from "@/lib/types";

const TABS = [
  "Overview",
  "Valuation",
  "Growth",
  "Health",
  "Returns",
  "Peers",
  "Ownership",
  "Technicals",
  "Sentiment",
  "Verdict",
] as const;

type TabName = (typeof TABS)[number];

// --- Badge helpers ---

function SignalBadge({ signal }: { signal: string | undefined | null }) {
  if (!signal) return null;
  const s = signal.toUpperCase();
  const green = [
    "CHEAP", "GOOD", "CLEAN", "SAFE", "STRONG", "HEALTHY",
    "WELL-CAPITALISED", "HIGH-QUALITY COMPOUNDER", "ACCELERATING",
    "UNDERVALUED", "CONSIDER", "LEADING", "BUYING", "INCREASING",
    "CONFIDENT", "HIGH", "STRONG FUNDAMENTALS",
    "STRONG BUY ZONE", "BUY ZONE", "ACCUMULATE ON DIPS",
    "STRONG BULLISH", "BULLISH", "VERY BULLISH",
    "ACCUMULATION", "POSITIVE", "ALIGNED",
    "GOLDEN CROSS", "ABOVE CLOUD",
  ];
  const yellow = [
    "FAIR", "AVERAGE", "WATCH", "MODERATE", "STEADY", "FAIRLY VALUED",
    "MIXED", "MID-PACK", "STABLE", "CAUTIOUS", "ADEQUATE",
    "AVERAGE RETURNS", "MODERATE FUNDAMENTALS",
    "HOLD / WAIT", "NEUTRAL", "SIDEWAYS", "PARTIAL",
    "CONTRARIAN WARNING", "RANGE-BOUND", "INSIDE CLOUD",
  ];
  const red = [
    "EXPENSIVE", "WEAK", "STRESSED", "LEVERAGED", "RISK", "CONCERN",
    "OVERVALUED", "AVOID", "LAGGING", "SELLING", "DECREASING",
    "DECLINING", "SLOWING", "THIN", "LOW", "VERY LOW",
    "WEAK FUNDAMENTALS", "TURNAROUND CANDIDATE", "DIVIDEND PLAY",
    "REDUCE / EXIT", "STRONG BEARISH", "BEARISH", "VERY BEARISH",
    "DISTRIBUTION", "NEGATIVE", "CONFLICTING",
    "DEATH CROSS", "BELOW CLOUD", "OVERBOUGHT", "OVERSOLD",
  ];

  let bg = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  if (green.some((g) => s.includes(g))) bg = "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  else if (red.some((r) => s.includes(r))) bg = "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  else if (yellow.some((y) => s.includes(y))) bg = "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";

  if (s === "DATA UNAVAILABLE") bg = "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide ${bg}`}>
      {s === "DATA UNAVAILABLE" && <span className="mr-1">🚩</span>}
      {signal}
    </span>
  );
}

function MetricCard({ label, value, sub, signal }: { label: string; value: string; sub?: string; signal?: string }) {
  return (
    <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-4">
      <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{value}</p>
      {sub && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p>}
      {signal && <div className="mt-1.5"><SignalBadge signal={signal} /></div>}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">{children}</h3>;
}

// --- Tab Content Components ---

function OverviewTab({ data }: { data: StockData }) {
  const { company: c, overview: o } = data;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <ConfidencePill level={c.dataConfidence} live={c.liveMetrics} total={c.totalMetrics} />
        <span className="text-slate-400 dark:text-slate-500">Last updated: {c.lastUpdated}</span>
        <span className="text-slate-400 dark:text-slate-500">Sources: {c.sources.join(", ")}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="CMP" value={c.cmp} />
        <MetricCard label="Market Cap" value={c.marketCap} />
        <MetricCard label="52W Range" value={`${c.weekLow52} — ${c.weekHigh52}`} />
        <MetricCard label="Sector" value={c.sector} sub={c.subSector} />
      </div>

      <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-4">
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{c.description}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span>NSE: <strong className="text-slate-700 dark:text-slate-200">{c.nseSymbol}</strong></span>
          <span>BSE: <strong className="text-slate-700 dark:text-slate-200">{c.bseCode}</strong></span>
          {c.isin && <span>ISIN: <strong className="text-slate-700 dark:text-slate-200">{c.isin}</strong></span>}
          <span>Face Value: <strong className="text-slate-700 dark:text-slate-200">{c.faceValue}</strong></span>
        </div>
      </div>

      {(o.pe || o.pb || o.evEbitda) && (
        <div className="grid grid-cols-3 gap-3">
          {o.pe && <MetricCard label="P/E (TTM)" value={o.pe} />}
          {o.pb && <MetricCard label="P/B" value={o.pb} />}
          {o.evEbitda && <MetricCard label="EV/EBITDA" value={o.evEbitda} />}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <MetricCard label="Rev CAGR (3Y)" value={o.revenueCagr3y} signal={o.signals?.revenueCagr3y} />
        <MetricCard label="Profit CAGR (3Y)" value={o.profitCagr3y} signal={o.signals?.profitCagr3y} />
        <MetricCard label="ROE" value={o.roe} signal={o.signals?.roe} />
        <MetricCard label="Debt/Equity" value={o.debtToEquity} signal={o.signals?.debtToEquity} />
        <MetricCard label="Div Yield" value={o.divYield} signal={o.signals?.divYield} />
      </div>
    </div>
  );
}

function ConfidencePill({ level, live, total }: { level: string; live: number; total: number }) {
  const colors: Record<string, string> = {
    HIGH: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    MODERATE: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    LOW: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "VERY LOW": "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${colors[level] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
      Data confidence: {level} · {live}/{total} live
    </span>
  );
}

function VerdictPill({ verdict, score }: { verdict: string; score: number }) {
  const v = verdict.toUpperCase();
  let bg = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  if (v.includes("STRONG BUY")) bg = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400";
  else if (v.includes("BUY ZONE")) bg = "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  else if (v.includes("ACCUMULATE")) bg = "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400";
  else if (v.includes("HOLD") || v.includes("WAIT")) bg = "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  else if (v.includes("REDUCE") || v.includes("EXIT")) bg = "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
  else if (v.includes("AVOID")) bg = "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${bg}`}>
      {verdict} · {score}/100
    </span>
  );
}

function ValuationTab({ data }: { data: StockData }) {
  const v = data.valuation;
  return (
    <div className="space-y-5">
      <SectionHeading>
        Sector: {v.sectorName} — Primary metric: {v.primaryMetric}
      </SectionHeading>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">Metric</th>
              <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">Current</th>
              <th className="text-left py-2.5 px-3 font-semibold text-slate-500">Sector Avg</th>
              <th className="text-left py-2.5 px-3 font-semibold text-slate-500">5-Yr Avg</th>
              <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">Signal</th>
              <th className="text-left py-2.5 px-3 font-semibold text-slate-500">Why?</th>
            </tr>
          </thead>
          <tbody>
            {(v.metrics ?? []).map((m, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}>
                <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">{m.name}</td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{m.current}</td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{m.sectorAvg}</td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{m.fiveYrAvg}</td>
                <td className="py-2.5 px-3"><SignalBadge signal={m.signal} /></td>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{m.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Overall:</span>
        <SignalBadge signal={v.overall} />
      </div>
    </div>
  );
}

function GrowthTab({ data }: { data: StockData }) {
  const g = data.growth;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Revenue */}
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <SectionHeading>Revenue</SectionHeading>
            <SignalBadge signal={g.revenue.trend} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><span className="text-slate-400 dark:text-slate-500">3Y CAGR</span><p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{g.revenue.cagr3y}</p></div>
            <div><span className="text-slate-400 dark:text-slate-500">5Y CAGR</span><p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{g.revenue.cagr5y}</p></div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(g.revenue?.lastFourQtrYoY ?? []).map((q, i) => (
              <span key={i} className="px-2 py-1 bg-slate-50 dark:bg-slate-800/50 rounded text-[11px] text-slate-600 dark:text-slate-400">Q{i + 1}: {q}</span>
            ))}
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <SectionHeading>Net Profit</SectionHeading>
            <SignalBadge signal={g.netProfit.trend} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><span className="text-slate-400 dark:text-slate-500">3Y CAGR</span><p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{g.netProfit.cagr3y}</p></div>
            <div><span className="text-slate-400 dark:text-slate-500">5Y CAGR</span><p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{g.netProfit.cagr5y}</p></div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(g.netProfit?.lastFourQtrYoY ?? []).map((q, i) => (
              <span key={i} className="px-2 py-1 bg-slate-50 dark:bg-slate-800/50 rounded text-[11px] text-slate-600 dark:text-slate-400">Q{i + 1}: {q}</span>
            ))}
          </div>
        </div>
      </div>

      {/* EPS */}
      <div>
        <SectionHeading>Quarterly EPS</SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Quarter</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">EPS</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">YoY Change</th>
              </tr>
            </thead>
            <tbody>
              {(g.eps ?? []).map((e, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}>
                  <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{e.quarter}</td>
                  <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{e.value}</td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{e.yoyChange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Margins */}
      <div>
        <SectionHeading>Margin Trend</SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Year</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">EBITDA Margin</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Net Profit Margin</th>
              </tr>
            </thead>
            <tbody>
              {(g.margins ?? []).map((m, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}>
                  <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{m.year}</td>
                  <td className="py-2 px-3 text-slate-800 dark:text-slate-200">{m.ebitda}</td>
                  <td className="py-2 px-3 text-slate-800 dark:text-slate-200">{m.netProfit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500">Overall Growth:</span>
        <SignalBadge signal={g.overallTrend} />
      </div>

      {/* Annual Financials */}
      {(data.annualFinancials ?? []).length > 0 && (
        <div>
          <SectionHeading>Annual Financials (5-Year View)</SectionHeading>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Year</th>
                  <th className="text-right py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Revenue</th>
                  <th className="text-right py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">PAT</th>
                  <th className="text-right py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">EBITDA %</th>
                  <th className="text-right py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">NPM %</th>
                  <th className="text-right py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">ROE</th>
                  <th className="text-right py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">ROCE</th>
                  <th className="text-right py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">D/E</th>
                  <th className="text-right py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">FCF</th>
                  <th className="text-right py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">DPS</th>
                </tr>
              </thead>
              <tbody>
                {(data.annualFinancials ?? []).map((a, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}>
                    <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">{a.year}</td>
                    <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{a.revenue}</td>
                    <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{a.pat}</td>
                    <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{a.ebitdaMargin}</td>
                    <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{a.netProfitMargin}</td>
                    <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{a.roe}</td>
                    <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{a.roce}</td>
                    <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{a.debtToEquity}</td>
                    <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{a.fcf}</td>
                    <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{a.dps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function HealthTab({ data }: { data: StockData }) {
  const h = data.health;
  const isBanking = h.type === "banking" && h.bankingMetrics;

  return (
    <div className="space-y-6">
      {isBanking && h.bankingMetrics ? (
        <div>
          <SectionHeading>Banking Health Metrics</SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(h.bankingMetrics ?? {}).map(([key, val]) => (
              <div key={key} className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-3">
                <p className="text-[11px] font-medium text-slate-400 uppercase">{key}</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{val.value}</p>
                <div className="mt-1"><SignalBadge signal={val.signal} /></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <SectionHeading>Financial Health</SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {h.debtToEquity && (
              <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-3">
                <p className="text-[11px] font-medium text-slate-400 uppercase">Debt/Equity</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{h.debtToEquity.value}</p>
                <div className="mt-1"><SignalBadge signal={h.debtToEquity.signal} /></div>
              </div>
            )}
            {h.interestCoverage && (
              <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-3">
                <p className="text-[11px] font-medium text-slate-400 uppercase">Interest Coverage</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{h.interestCoverage.value}</p>
                <div className="mt-1"><SignalBadge signal={h.interestCoverage.signal} /></div>
              </div>
            )}
            {h.currentRatio && (
              <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-3">
                <p className="text-[11px] font-medium text-slate-400 uppercase">Current Ratio</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{h.currentRatio.value}</p>
                <div className="mt-1"><SignalBadge signal={h.currentRatio.signal} /></div>
              </div>
            )}
            {h.fcf && (
              <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-3">
                <p className="text-[11px] font-medium text-slate-400 uppercase">Free Cash Flow</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{h.fcf.value}</p>
                <div className="mt-1"><SignalBadge signal={h.fcf.signal} /></div>
              </div>
            )}
            {h.netDebt && (
              <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-3">
                <p className="text-[11px] font-medium text-slate-400 uppercase">Net Debt</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{h.netDebt}</p>
              </div>
            )}
            {h.cashEquivalents && (
              <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-3">
                <p className="text-[11px] font-medium text-slate-400 uppercase">Cash &amp; Equivalents</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{h.cashEquivalents}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FCF Trend */}
      {h.fcfTrend && h.fcfTrend.length > 0 && (
        <div>
          <SectionHeading>Free Cash Flow Trend</SectionHeading>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Year</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">FCF</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Signal</th>
                </tr>
              </thead>
              <tbody>
                {(h.fcfTrend ?? []).map((f, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{f.year}</td>
                    <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{f.value}</td>
                    <td className="py-2 px-3"><SignalBadge signal={f.signal} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Scenarios */}
      <div>
        <SectionHeading>Scenarios ({h.scenarios.horizon} horizon)</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-red-50/50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30 p-4">
            <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-2">Bear Case</p>
            <p className="text-xs text-red-600/90 dark:text-red-400/90 leading-relaxed">{h.scenarios.bear}</p>
          </div>
          <div className="bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30 p-4">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">Base Case</p>
            <p className="text-xs text-amber-600/90 dark:text-amber-400/90 leading-relaxed">{h.scenarios.base}</p>
          </div>
          <div className="bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30 p-4">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">Bull Case</p>
            <p className="text-xs text-emerald-600/90 dark:text-emerald-400/90 leading-relaxed">{h.scenarios.bull}</p>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 italic">
          Scenarios based on historical trends only — not forecasts or guarantees.
        </p>
      </div>
    </div>
  );
}

function ReturnsTab({ data }: { data: StockData }) {
  const r = data.returns;
  return (
    <div className="space-y-6">
      <div>
        <SectionHeading>Return Ratios</SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">Metric</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">Current</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">3Y Avg</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">5Y Avg</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">Signal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">ROE</td>
                <td className="py-2.5 px-3">{r.roe.current}</td>
                <td className="py-2.5 px-3">{r.roe.avg3y}</td>
                <td className="py-2.5 px-3">{r.roe.avg5y}</td>
                <td className="py-2.5 px-3"><SignalBadge signal={r.roe.signal} /></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">ROCE</td>
                <td className="py-2.5 px-3">{r.roce.current}</td>
                <td className="py-2.5 px-3">{r.roce.avg3y}</td>
                <td className="py-2.5 px-3">{r.roce.avg5y}</td>
                <td className="py-2.5 px-3"><SignalBadge signal={r.roce.signal} /></td>
              </tr>
              {r.roa && (
                <tr className="bg-slate-50/50">
                  <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">RoA</td>
                  <td className="py-2.5 px-3">{r.roa.current}</td>
                  <td className="py-2.5 px-3">{r.roa.avg3y}</td>
                  <td className="py-2.5 px-3">{r.roa.avg5y}</td>
                  <td className="py-2.5 px-3"><SignalBadge signal={r.roa.signal} /></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <SectionHeading>Dividend History</SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Year</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">DPS</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Payout Ratio</th>
              </tr>
            </thead>
            <tbody>
              {(r.dividends ?? []).map((d, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}>
                  <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{d.year}</td>
                  <td className="py-2 px-3 text-slate-800 dark:text-slate-200">{d.dps}</td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{d.payoutRatio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Classification:</span>
        <SignalBadge signal={r.classification} />
      </div>
    </div>
  );
}

function PeersTab({ data }: { data: StockData }) {
  const p = data.peers;
  const kpiLabel = p.companies[0]?.sectorKpiLabel || "Sector KPI";
  return (
    <div className="space-y-6">
      <div>
        <SectionHeading>Peer Comparison</SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">Company</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500">{data.valuation.primaryMetric}</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">ROE</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">Rev CAGR</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">D/E</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500">{kpiLabel}</th>
              </tr>
            </thead>
            <tbody>
              {(p.companies ?? []).map((c, i) => (
                <tr key={i} className={c.isSubject ? "bg-blue-50/60 dark:bg-blue-900/20" : i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}>
                  <td className={`py-2.5 px-3 ${c.isSubject ? "font-bold text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>
                    {c.name} {c.isSubject && <span className="text-[10px]">(Subject)</span>}
                  </td>
                  <td className="py-2.5 px-3">{c.primaryMetric}</td>
                  <td className="py-2.5 px-3">{c.roe}</td>
                  <td className="py-2.5 px-3">{c.revenueCagr}</td>
                  <td className="py-2.5 px-3">{c.de}</td>
                  <td className="py-2.5 px-3">{c.sectorKpi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Standing vs peers:</span>
          <SignalBadge signal={p.standing} />
        </div>
      </div>

      <div>
        <SectionHeading>Recent News</SectionHeading>
        <div className="space-y-3">
          {(p.news ?? []).map((n, i) => (
            <div key={i} className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-3">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{n.headline}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{n.summary}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">— {n.source}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OwnershipTab({ data }: { data: StockData }) {
  const o = data.ownership;
  return (
    <div className="space-y-6">
      {/* Promoter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionHeading>Promoter Holding</SectionHeading>
          <div className="flex items-center gap-2">
            <SignalBadge signal={o.promoter.trend} />
            {o.promoter.pledgingAlert && (
              <span className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[11px] font-semibold">
                Pledging: {o.promoter.pledging}
              </span>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Quarter</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Holding %</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Change</th>
              </tr>
            </thead>
            <tbody>
              {(o.promoter?.quarters ?? []).map((q, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}>
                  <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{q.quarter}</td>
                  <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{q.holding}</td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{q.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FII */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionHeading>FII Holding</SectionHeading>
          <SignalBadge signal={o.fii.trend} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Quarter</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Holding %</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Change</th>
              </tr>
            </thead>
            <tbody>
              {(o.fii?.quarters ?? []).map((q, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}>
                  <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{q.quarter}</td>
                  <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{q.holding}</td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{q.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DII */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionHeading>DII Holding</SectionHeading>
          <SignalBadge signal={o.dii.trend} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Quarter</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Holding %</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Change</th>
              </tr>
            </thead>
            <tbody>
              {(o.dii?.quarters ?? []).map((q, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}>
                  <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{q.quarter}</td>
                  <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{q.holding}</td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{q.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">Management Tone:</span>
        <SignalBadge signal={o.managementTone} />
      </div>
    </div>
  );
}

function TechnicalsTab({ data }: { data: StockData }) {
  const t = data.technicals;
  if (!t) {
    return (
      <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
        Technical analysis data is not available for this stock.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trend Status */}
      <div>
        <SectionHeading>Trend Status</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <MetricCard label="EMA Alignment" value={t.trendStatus.emaAlignment} sub={t.trendStatus.emaAlignmentDetail} />
          <MetricCard label="Price vs 200 SMA" value={t.trendStatus.priceVs200SMA} sub={t.trendStatus.distanceFrom200SMA} />
          <MetricCard label="Golden/Death Cross" value={t.trendStatus.goldenDeathCross} sub={t.trendStatus.goldenDeathCrossDate} />
          <MetricCard label="Supertrend (Daily)" value={t.trendStatus.supertrendDaily} sub={t.trendStatus.supertrendDailyValue} />
          <MetricCard label="Supertrend (Weekly)" value={t.trendStatus.supertrendWeekly} sub={t.trendStatus.supertrendWeeklyValue} />
          <MetricCard label="52W High/Low Distance" value={t.trendStatus.distanceFrom52WH} sub={`From 52W Low: ${t.trendStatus.distanceFrom52WL}`} />
        </div>
      </div>

      {/* Momentum */}
      <div>
        <SectionHeading>Momentum Dashboard</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard label="RSI (Daily)" value={t.momentum.rsiDaily} signal={t.momentum.rsiDailyZone} />
          <MetricCard label="RSI (Weekly)" value={t.momentum.rsiWeekly} signal={t.momentum.rsiWeeklyZone} />
          <MetricCard label="MACD (Daily)" value={t.momentum.macdDaily} sub={`Histogram: ${t.momentum.macdDailyHistogram}`} />
          <MetricCard label="MACD (Weekly)" value={t.momentum.macdWeekly} sub={`Histogram: ${t.momentum.macdWeeklyHistogram}`} />
          <MetricCard label="ADX" value={t.momentum.adxValue} signal={t.momentum.adxStrength} sub={t.momentum.adxDirection} />
          <MetricCard label="StochRSI" value={t.momentum.stochRsiValue} signal={t.momentum.stochRsiZone} />
          <MetricCard label="RSI Divergence" value={t.momentum.rsiDivergence} />
        </div>
      </div>

      {/* Volume & Delivery */}
      <div>
        <SectionHeading>Volume &amp; Delivery</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard label="Volume Ratio" value={t.volumeDelivery.volumeRatio} signal={t.volumeDelivery.volumeClassification} />
          <MetricCard label="OBV Trend" value={t.volumeDelivery.obvTrend} sub={t.volumeDelivery.obvDivergence} />
          <MetricCard label="Delivery %" value={t.volumeDelivery.deliveryPercent} signal={t.volumeDelivery.deliveryClassification} sub={`20D Avg: ${t.volumeDelivery.deliveryAvg20d}`} />
          <MetricCard label="Delivery Signal" value={t.volumeDelivery.deliveryPriceSignal} />
        </div>
      </div>

      {/* Key Levels */}
      <div>
        <SectionHeading>Key Levels</SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">Level</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">Support</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">Source</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">Resistance</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 dark:text-slate-400">Source</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-3 font-medium text-slate-700">S1 / R1</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">{t.keyLevels.support1}</td>
                <td className="py-2.5 px-3 text-slate-500">{t.keyLevels.support1Source}</td>
                <td className="py-2.5 px-3 text-red-700 font-semibold">{t.keyLevels.resistance1}</td>
                <td className="py-2.5 px-3 text-slate-500">{t.keyLevels.resistance1Source}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-700">S2 / R2</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">{t.keyLevels.support2}</td>
                <td className="py-2.5 px-3 text-slate-500">{t.keyLevels.support2Source}</td>
                <td className="py-2.5 px-3 text-red-700 font-semibold">{t.keyLevels.resistance2}</td>
                <td className="py-2.5 px-3 text-slate-500">{t.keyLevels.resistance2Source}</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-3 font-medium text-slate-700">S3 / R3</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">{t.keyLevels.support3}</td>
                <td className="py-2.5 px-3 text-slate-500">{t.keyLevels.support3Source}</td>
                <td className="py-2.5 px-3 text-red-700 font-semibold">{t.keyLevels.resistance3}</td>
                <td className="py-2.5 px-3 text-slate-500">{t.keyLevels.resistance3Source}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
          <span>Stop Loss: <strong className="text-red-700">{t.keyLevels.stopLoss}</strong> ({t.keyLevels.stopLossMethod})</span>
        </div>
      </div>

      {/* Indicator Scorecard */}
      <div>
        <SectionHeading>Indicator Scorecard (15 Signals)</SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Indicator</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Timeframe</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Value</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Signal</th>
                <th className="text-right py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Score</th>
              </tr>
            </thead>
            <tbody>
              {(t.indicatorScorecard ?? []).map((ind, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}>
                  <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">{ind.indicator}</td>
                  <td className="py-2 px-3 text-slate-500 dark:text-slate-400">{ind.timeframe}</td>
                  <td className="py-2 px-3 text-slate-800 dark:text-slate-200">{ind.value}</td>
                  <td className="py-2 px-3"><SignalBadge signal={ind.signal} /></td>
                  <td className="py-2 px-3 text-right font-bold">{ind.score > 0 ? `+${ind.score}` : ind.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <span className="text-xs text-slate-500">
            Bullish: <strong className="text-emerald-700 dark:text-emerald-400">{t.scoreSummary.bullish}</strong> ·
            Neutral: <strong className="text-slate-700 dark:text-slate-300">{t.scoreSummary.neutral}</strong> ·
            Bearish: <strong className="text-red-700 dark:text-red-400">{t.scoreSummary.bearish}</strong>
          </span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Net Score: {t.scoreSummary.netScore}/100</span>
          <SignalBadge signal={t.scoreSummary.verdict} />
        </div>
      </div>

      {/* Divergences & Patterns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-4">
          <SectionHeading>Divergences</SectionHeading>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">RSI</span><span className="font-medium text-slate-800 dark:text-slate-200">{t.divergences.rsi}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">OBV</span><span className="font-medium text-slate-800 dark:text-slate-200">{t.divergences.obv}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">MACD</span><span className="font-medium text-slate-800 dark:text-slate-200">{t.divergences.macd}</span></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-4">
          <SectionHeading>Chart Pattern &amp; Extras</SectionHeading>
          {t.chartPattern ? (
            <div className="text-xs space-y-1">
              <p><span className="text-slate-500 dark:text-slate-400">Pattern:</span> <strong className="text-slate-800 dark:text-slate-200">{t.chartPattern.pattern}</strong></p>
              <p><span className="text-slate-500 dark:text-slate-400">Implication:</span> <span className="text-slate-700 dark:text-slate-300">{t.chartPattern.implication}</span></p>
              <p><span className="text-slate-500 dark:text-slate-400">Status:</span> <span className="text-slate-700 dark:text-slate-300">{t.chartPattern.status}</span></p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500">No clear chart pattern detected.</p>
          )}
          <div className="mt-3 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Bollinger Squeeze: </span>
            <span className={`font-semibold ${t.bollingerSqueeze ? "text-amber-700" : "text-slate-600"}`}>
              {t.bollingerSqueeze ? "Active — Volatility expansion expected" : "Not active"}
            </span>
          </div>
        </div>
      </div>

      {/* Ichimoku */}
      <div>
        <SectionHeading>Ichimoku Cloud</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <MetricCard label="Price Position" value={t.ichimoku.pricePosition} />
          <MetricCard label="Cloud Color" value={t.ichimoku.cloudColor} />
          <MetricCard label="Tenkan vs Kijun" value={t.ichimoku.tenkanVsKijun} />
          <MetricCard label="Chikou Span" value={t.ichimoku.chikouSpan} />
          <MetricCard label="Future Cloud" value={t.ichimoku.futureCloud} />
        </div>
      </div>
    </div>
  );
}

function SentimentTab({ data }: { data: StockData }) {
  const s = data.sentiment;
  if (!s) {
    return (
      <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
        Sentiment analysis data is not available for this stock.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Institutional Activity */}
      <div>
        <SectionHeading>Institutional Activity</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-4">
            <p className="text-[11px] font-medium text-slate-400 uppercase">FII Trend</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{s.institutional.fiiTrend}</p>
            <div className="mt-1"><SignalBadge signal={s.institutional.fiiSignal} /></div>
            <div className="mt-2 space-y-0.5">
              {(s.institutional?.fiiHoldings ?? []).map((h, i) => (
                <p key={i} className="text-[11px] text-slate-500 dark:text-slate-400">{h.quarter}: {h.holding}</p>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-4">
            <p className="text-[11px] font-medium text-slate-400 uppercase">DII Trend</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{s.institutional.diiTrend}</p>
            <div className="mt-1"><SignalBadge signal={s.institutional.diiSignal} /></div>
            <div className="mt-2 space-y-0.5">
              {(s.institutional?.diiHoldings ?? []).map((h, i) => (
                <p key={i} className="text-[11px] text-slate-500 dark:text-slate-400">{h.quarter}: {h.holding}</p>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-4">
            <p className="text-[11px] font-medium text-slate-400 uppercase">Mutual Fund</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{s.institutional.mfSchemesCurrent} schemes</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Year ago: {s.institutional.mfSchemesYearAgo}</p>
            <div className="mt-1"><SignalBadge signal={s.institutional.mfSignal} /></div>
            {(s.institutional?.mfTopHolders ?? []).length > 0 && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Top: {s.institutional.mfTopHolders.join(", ")}</p>
            )}
          </div>
        </div>
        {(s.institutional?.bulkBlockDeals ?? []).length > 0 && (
          <div className="mt-3">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">Bulk/Block Deals</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-1.5 px-2 font-semibold text-slate-500 dark:text-slate-400">Date</th>
                    <th className="text-left py-1.5 px-2 font-semibold text-slate-500 dark:text-slate-400">Party</th>
                    <th className="text-left py-1.5 px-2 font-semibold text-slate-500 dark:text-slate-400">Type</th>
                    <th className="text-right py-1.5 px-2 font-semibold text-slate-500 dark:text-slate-400">Qty</th>
                    <th className="text-right py-1.5 px-2 font-semibold text-slate-500 dark:text-slate-400">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {(s.institutional?.bulkBlockDeals ?? []).map((d, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}>
                      <td className="py-1.5 px-2 text-slate-600 dark:text-slate-400">{d.date}</td>
                      <td className="py-1.5 px-2 text-slate-700 dark:text-slate-300">{d.party}</td>
                      <td className="py-1.5 px-2"><SignalBadge signal={d.type} /></td>
                      <td className="py-1.5 px-2 text-right text-slate-700 dark:text-slate-300">{d.qty}</td>
                      <td className="py-1.5 px-2 text-right text-slate-700 dark:text-slate-300">{d.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-1"><SignalBadge signal={s.institutional.bulkBlockSignal} /></div>
          </div>
        )}
      </div>

      {/* Insider Activity */}
      <div>
        <SectionHeading>Insider Activity</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <MetricCard label="Net Activity" value={s.insider.netActivity} signal={s.insider.insiderSignal} />
          <MetricCard label="Pledge %" value={s.insider.pledgePercent} sub={`Trend: ${s.insider.pledgeTrend}`} />
        </div>
        {s.insider.redFlag && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-3 mb-3">
            <p className="text-xs font-bold text-red-700 dark:text-red-400">🚩 Red Flag: {s.insider.redFlagReason}</p>
          </div>
        )}
        {(s.insider?.activities ?? []).length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-1.5 px-2 font-semibold text-slate-500 dark:text-slate-400">Date</th>
                  <th className="text-left py-1.5 px-2 font-semibold text-slate-500 dark:text-slate-400">Type</th>
                  <th className="text-left py-1.5 px-2 font-semibold text-slate-500 dark:text-slate-400">Person</th>
                  <th className="text-right py-1.5 px-2 font-semibold text-slate-500 dark:text-slate-400">Qty</th>
                  <th className="text-right py-1.5 px-2 font-semibold text-slate-500 dark:text-slate-400">Price</th>
                </tr>
              </thead>
              <tbody>
                {(s.insider?.activities ?? []).map((a, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}>
                    <td className="py-1.5 px-2 text-slate-600 dark:text-slate-400">{a.date}</td>
                    <td className="py-1.5 px-2"><SignalBadge signal={a.type} /></td>
                    <td className="py-1.5 px-2 text-slate-700 dark:text-slate-300">{a.person}</td>
                    <td className="py-1.5 px-2 text-right text-slate-700 dark:text-slate-300">{a.qty}</td>
                    <td className="py-1.5 px-2 text-right text-slate-700 dark:text-slate-300">{a.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Analyst Consensus */}
      <div>
        <SectionHeading>Analyst Consensus</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <MetricCard label="Consensus" value={s.analystConsensus.consensus} signal={s.analystConsensus.signal} />
          <MetricCard label="Avg Target" value={s.analystConsensus.avgTargetPrice} sub={s.analystConsensus.upsideDownside} />
          <MetricCard label="Target Range" value={`${s.analystConsensus.lowestTarget} — ${s.analystConsensus.highestTarget}`} />
          <MetricCard label="Total Analysts" value={String(s.analystConsensus.totalAnalysts)} />
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold">Strong Buy: {s.analystConsensus.strongBuy}</span>
          <span className="px-2 py-1 rounded bg-emerald-50/60 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">Buy: {s.analystConsensus.buy}</span>
          <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 dark:text-amber-400 text-[11px] font-semibold">Hold: {s.analystConsensus.hold}</span>
          <span className="px-2 py-1 rounded bg-red-50/60 text-red-600 dark:text-red-400 text-[11px] font-semibold">Sell: {s.analystConsensus.sell}</span>
          <span className="px-2 py-1 rounded bg-red-50 text-red-700 dark:text-red-400 text-[11px] font-semibold">Strong Sell: {s.analystConsensus.strongSell}</span>
        </div>
        {(s.analystConsensus?.recentChanges ?? []).length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-1.5 px-2 font-semibold text-slate-500 dark:text-slate-400">Broker</th>
                  <th className="text-left py-1.5 px-2 font-semibold text-slate-500 dark:text-slate-400">Old Rating</th>
                  <th className="text-left py-1.5 px-2 font-semibold text-slate-500 dark:text-slate-400">New Rating</th>
                  <th className="text-left py-1.5 px-2 font-semibold text-slate-500 dark:text-slate-400">Target Change</th>
                </tr>
              </thead>
              <tbody>
                {(s.analystConsensus?.recentChanges ?? []).map((c, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}>
                    <td className="py-1.5 px-2 text-slate-700 dark:text-slate-300">{c.broker}</td>
                    <td className="py-1.5 px-2 text-slate-500 dark:text-slate-400">{c.oldRating}</td>
                    <td className="py-1.5 px-2 text-slate-800 dark:text-slate-200 font-medium">{c.newRating}</td>
                    <td className="py-1.5 px-2 text-slate-600 dark:text-slate-400">{c.targetChange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Options */}
      {s.options && s.options.available && (
        <div>
          <SectionHeading>Options Data</SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label="PCR" value={s.options.pcr} signal={s.options.pcrSignal} />
            <MetricCard label="Max Pain" value={s.options.maxPain} />
            <MetricCard label="Highest Call OI" value={s.options.highestCallOI} />
            <MetricCard label="Highest Put OI" value={s.options.highestPutOI} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">{s.options.oiInterpretation}</p>
        </div>
      )}

      {/* News Sentiment */}
      <div>
        <SectionHeading>News Sentiment</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
          <MetricCard label="Dominant Narrative" value={s.news.dominantNarrative} signal={s.news.signal} />
          <MetricCard label="Earnings Call Tone" value={s.news.earningsCallTone} />
          <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-4">
            <p className="text-[11px] font-medium text-slate-400 uppercase">News Split</p>
            <div className="flex gap-3 mt-2 text-xs">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">+{s.news.positive}</span>
              <span className="text-slate-500 dark:text-slate-400">{s.news.neutral} neutral</span>
              <span className="text-red-700 dark:text-red-400 font-semibold">−{s.news.negative}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Market Mood */}
      <div>
        <SectionHeading>Market Mood</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard label="MMI" value={s.marketMood.mmiValue} signal={s.marketMood.mmiZone} />
          <MetricCard label="India VIX" value={s.marketMood.vixValue} signal={s.marketMood.vixClassification} />
          <MetricCard label="Google Trends" value={s.marketMood.googleTrends} signal={s.marketMood.signal} />
        </div>
      </div>

      {/* Sentiment Scorecard */}
      <div>
        <SectionHeading>Sentiment Scorecard</SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Source</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Reading</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Signal</th>
                <th className="text-right py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">Weight</th>
              </tr>
            </thead>
            <tbody>
              {(s.scorecard?.signals ?? []).map((sig, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}>
                  <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">{sig.source}</td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{sig.reading}</td>
                  <td className="py-2 px-3"><SignalBadge signal={sig.signal} /></td>
                  <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-400">{sig.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Weighted Score: {s.scorecard.weightedScore}/100</span>
          <SignalBadge signal={s.scorecard.verdict} />
        </div>
      </div>

      {/* Red Flags */}
      {(s.redFlags ?? []).length > 0 && (
        <div>
          <SectionHeading>Red Flags</SectionHeading>
          <div className="space-y-2">
            {(s.redFlags ?? []).map((rf, i) => (
              <div key={i} className="bg-red-50/60 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-red-700 dark:text-red-400">🚩 {rf.type}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${rf.severity === "HIGH" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"}`}>
                    {rf.severity}
                  </span>
                </div>
                <p className="text-xs text-red-600/90 dark:text-red-400/90">{rf.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contrarian Signals */}
      {(s.contrarianSignals ?? []).length > 0 && (
        <div>
          <SectionHeading>Contrarian Signals</SectionHeading>
          <div className="space-y-2">
            {(s.contrarianSignals ?? []).map((cs, i) => (
              <div key={i} className="bg-purple-50/60 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 rounded-xl p-3">
                <p className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-1">↕ {cs.signal}</p>
                <p className="text-xs text-purple-600/90 dark:text-purple-400/90">{cs.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function VerdictTab({ data }: { data: StockData }) {
  const v = data.view;

  const getVerdictStyle = (verdict: string) => {
    const u = verdict.toUpperCase();
    if (u.includes("STRONG BUY")) return { bg: "bg-emerald-50 border-emerald-400 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-600 dark:text-emerald-300", emoji: "🟢" };
    if (u.includes("BUY ZONE")) return { bg: "bg-emerald-50/70 border-emerald-300 text-emerald-700 dark:bg-emerald-900/15 dark:border-emerald-700 dark:text-emerald-400", emoji: "🟢" };
    if (u.includes("ACCUMULATE")) return { bg: "bg-teal-50 border-teal-300 text-teal-700 dark:bg-teal-900/20 dark:border-teal-700 dark:text-teal-400", emoji: "🟡" };
    if (u.includes("HOLD") || u.includes("WAIT")) return { bg: "bg-amber-50 border-amber-400 text-amber-800 dark:bg-amber-900/20 dark:border-amber-600 dark:text-amber-300", emoji: "🟡" };
    if (u.includes("REDUCE") || u.includes("EXIT")) return { bg: "bg-orange-50 border-orange-400 text-orange-800 dark:bg-orange-900/20 dark:border-orange-600 dark:text-orange-300", emoji: "🟠" };
    if (u.includes("AVOID")) return { bg: "bg-red-50 border-red-400 text-red-800 dark:bg-red-900/20 dark:border-red-600 dark:text-red-300", emoji: "🔴" };
    return { bg: "bg-slate-50 border-slate-300 text-slate-700 dark:bg-slate-800/40 dark:border-slate-600 dark:text-slate-300", emoji: "⚪" };
  };

  const style = getVerdictStyle(v.verdict);

  return (
    <div className="space-y-5">
      {/* Combined Verdict Box */}
      <div className={`rounded-2xl border-2 p-5 ${style.bg}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{style.emoji}</span>
          <div>
            <p className="text-lg font-extrabold">{v.verdict}</p>
            <p className="text-xs opacity-80">Combined Score: {v.combinedScore}/100 · Horizon: {v.horizon}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed">{v.verdictReason}</p>
        {v.redFlagOverride && (
          <div className="mt-3 bg-red-100/60 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-3">
            <p className="text-xs font-bold text-red-700 dark:text-red-400">🚩 Red Flag Override Active</p>
            <p className="text-xs text-red-600/90 dark:text-red-400/90 mt-0.5">{v.redFlagReason}</p>
          </div>
        )}
      </div>

      {/* Three-Pillar Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <PillarCard
          title="Fundamental"
          score={v.fundamentalScore}
          weight={v.fundamentalWeight}
          verdict={v.fundamentalVerdict}
          reason={v.fundamentalReason}
          color="blue"
        />
        <PillarCard
          title="Technical"
          score={v.technicalScore}
          weight={v.technicalWeight}
          verdict={v.technicalVerdict}
          reason={v.technicalReason}
          color="indigo"
        />
        <PillarCard
          title="Sentiment"
          score={v.sentimentScore}
          weight={v.sentimentWeight}
          verdict={v.sentimentVerdict}
          reason={v.sentimentReason}
          color="violet"
        />
      </div>

      {/* Signal Alignment */}
      <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-4">
        <div className="flex items-center gap-3 mb-2">
          <SectionHeading>Signal Alignment</SectionHeading>
          <SignalBadge signal={v.signalAlignment} />
        </div>
        {v.signalConflictExplanation && (
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{v.signalConflictExplanation}</p>
        )}
      </div>

      {/* Quality + Posture + Sentiment + Summary */}
      <div className="flex flex-wrap items-center gap-3">
        <SignalBadge signal={v.quality} />
        {v.technicalPosture && <SignalBadge signal={v.technicalPosture} />}
        {v.marketSentiment && <SignalBadge signal={v.marketSentiment} />}
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{v.summary}</p>

      {/* Strengths / Watch / Track */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-emerald-50/40 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30 p-4">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">Strengths</p>
          {(v.strengths ?? []).map((s, i) => (
            <p key={i} className="text-xs text-emerald-600/90 dark:text-emerald-400/90 mb-1.5">✓ {s}</p>
          ))}
        </div>
        <div className="bg-amber-50/40 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30 p-4">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">Watch Points</p>
          {(v.watchPoints ?? []).map((w, i) => (
            <p key={i} className="text-xs text-amber-600/90 dark:text-amber-400/90 mb-1.5">⚠ {w}</p>
          ))}
        </div>
        <div className="bg-blue-50/40 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 p-4">
          <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2">Track</p>
          <p className="text-xs text-blue-600/90 dark:text-blue-400/90">→ {v.track}</p>
        </div>
      </div>

      {/* Key Levels */}
      {(v.entryZone || v.stopLoss || v.targetZone) && (
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-4">
          <SectionHeading>Key Action Levels</SectionHeading>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {v.entryZone && (
              <div>
                <p className="text-slate-400 dark:text-slate-500 font-medium uppercase">Entry Zone</p>
                <p className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{v.entryZone}</p>
              </div>
            )}
            {v.stopLoss && (
              <div>
                <p className="text-slate-400 dark:text-slate-500 font-medium uppercase">Stop Loss</p>
                <p className="font-bold text-red-700 dark:text-red-400 mt-0.5">{v.stopLoss}</p>
              </div>
            )}
            {v.targetZone && (
              <div>
                <p className="text-slate-400 dark:text-slate-500 font-medium uppercase">Target Zone</p>
                <p className="font-bold text-blue-700 dark:text-blue-400 mt-0.5">{v.targetZone}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Opportunities & Risks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-4">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Opportunities</p>
          {(v.opportunities ?? []).map((o, i) => (
            <p key={i} className="text-xs text-slate-600 dark:text-slate-400 mb-1.5">+ {o}</p>
          ))}
        </div>
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-4">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Risks</p>
          {(v.risks ?? []).map((r, i) => (
            <p key={i} className="text-xs text-slate-600 dark:text-slate-400 mb-1.5">− {r}</p>
          ))}
        </div>
      </div>

      {/* Timeline Match */}
      <div className="bg-blue-50/40 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 p-4">
        <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2">Timeline Match</p>
        <p className="text-xs text-blue-600/90 dark:text-blue-400/90 leading-relaxed">{v.timelineMatch}</p>
      </div>

      {/* Data Confidence */}
      {v.dataConfidence && (
        <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-white/10 p-4">
          <SectionHeading>Data Confidence</SectionHeading>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label="Fundamental" value={v.dataConfidence.fundamental} />
            <MetricCard label="Technical" value={v.dataConfidence.technical} />
            <MetricCard label="Sentiment" value={v.dataConfidence.sentiment} />
            <MetricCard label="Overall" value={v.dataConfidence.overall} />
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed italic">
        This is a VERDICT based on publicly available fundamentals, technical indicators, and sentiment data.
        Not a buy/sell recommendation. Not SEBI-registered research. Technical signals are derived from
        historical price/volume data — they are not real-time. The decision is always yours.
      </p>
    </div>
  );
}

function PillarCard({ title, score, weight, verdict, reason, color }: {
  title: string; score: number; weight: string; verdict: string; reason: string; color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50/60 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/30",
    indigo: "bg-indigo-50/60 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/30",
    violet: "bg-violet-50/60 border-violet-100 dark:bg-violet-900/20 dark:border-violet-800/30",
  };
  const textMap: Record<string, string> = {
    blue: "text-blue-700 dark:text-blue-400",
    indigo: "text-indigo-700 dark:text-indigo-400",
    violet: "text-violet-700 dark:text-violet-400",
  };
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color] || "bg-slate-50 border-slate-100 dark:bg-slate-800/30 dark:border-slate-700"}`}>
      <div className="flex items-center justify-between mb-2">
        <p className={`text-xs font-bold ${textMap[color] || "text-slate-700 dark:text-slate-300"}`}>{title}</p>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">{weight}</span>
      </div>
      <p className="text-lg font-extrabold text-slate-800 dark:text-white">{score}/100</p>
      <div className="mt-1"><SignalBadge signal={verdict} /></div>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{reason}</p>
    </div>
  );
}

// --- Main Dashboard ---

interface DashboardProps {
  data: StockData;
  onReset: () => void;
}

export function Dashboard({ data, onReset }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabName>("Verdict");

  const renderTab = () => {
    switch (activeTab) {
      case "Overview": return <OverviewTab data={data} />;
      case "Valuation": return <ValuationTab data={data} />;
      case "Growth": return <GrowthTab data={data} />;
      case "Health": return <HealthTab data={data} />;
      case "Returns": return <ReturnsTab data={data} />;
      case "Peers": return <PeersTab data={data} />;
      case "Ownership": return <OwnershipTab data={data} />;
      case "Technicals": return <TechnicalsTab data={data} />;
      case "Sentiment": return <SentimentTab data={data} />;
      case "Verdict": return <VerdictTab data={data} />;
    }
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-215 mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{data.company.name}</h1>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-cyan-900/40 text-blue-700 dark:text-cyan-400 text-[11px] font-semibold">
                  {data.company.sector}
                </span>
                <VerdictPill verdict={data.view.verdict} score={data.view.combinedScore} />
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-white text-base">{data.company.cmp}</span>
                <ConfidencePill level={data.company.dataConfidence} live={data.company.liveMetrics} total={data.company.totalMetrics} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
            >
              Analyze Another
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-4 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-blue-800 dark:bg-cyan-600 text-white shadow-md shadow-blue-200 dark:shadow-cyan-900/40"
                  : "bg-slate-100/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-sm p-5 sm:p-6 min-h-100">
          {renderTab()}
        </div>

        {/* Footer */}
        <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-6 max-w-2xl mx-auto leading-relaxed">
          This tool is for fundamental, technical, and sentiment screening and financial education only. Data sourced
          from NSE, BSE, Screener.in, Moneycontrol, Tickertape, TradingView concepts, and public filings. Technical
          indicators are computed from publicly available price/volume data — they are NOT real-time signals. This is
          NOT investment advice, a buy/sell recommendation, or SEBI-registered research. AI can make errors — verify
          all numbers independently at NSE/BSE/Screener before acting. Past performance does not guarantee future
          results. Investing involves risk. Consult a SEBI-registered investment advisor before making any decision.
        </p>
      </div>
    </div>
  );
}
