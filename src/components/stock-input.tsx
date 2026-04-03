"use client";

import { useState } from "react";

const HORIZONS = [
  "6 months to 1 year",
  "1 to 2 years",
  "2 to 3 years",
  "3 to 5 years",
  "5 years and more",
];

const POPULAR_STOCKS = [
  "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK",
  "BHARTIARTL", "ITC", "SBIN", "LT", "ZOMATO",
];

const PILLARS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Fundamentals",
    desc: "Valuation, growth, health, returns & peers",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200/60 dark:border-blue-500/20",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v-5.5m1.5 5.5V8.75m1.5 2.5v-4m1.5 4V7.25m1.5 4V5.5" />
      </svg>
    ),
    title: "Technicals",
    desc: "15 indicators, support/resistance & trends",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200/60 dark:border-purple-500/20",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
      </svg>
    ),
    title: "Sentiment",
    desc: "News, FII/DII flows, analyst ratings & more",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200/60 dark:border-emerald-500/20",
  },
];

interface StockInputProps {
  onSubmit: (stockName: string, horizon: string, mode: "fast" | "deep") => void;
  isLoading: boolean;
}

export function StockInput({ onSubmit, isLoading }: StockInputProps) {
  const [stockName, setStockName] = useState("");
  const [horizon, setHorizon] = useState("");
  const [mode, setMode] = useState<"fast" | "deep">("fast");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockName.trim() && horizon) {
      onSubmit(stockName.trim(), horizon, mode);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-cyan-900/40 text-blue-700 dark:text-cyan-400 text-xs font-medium mb-6 backdrop-blur-sm border border-blue-200/50 dark:border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-400 animate-pulse" />
            Fundamental &middot; Technical &middot; Sentiment
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Indian Stock
            <span className="block text-blue-600 dark:text-cyan-400 mt-1">Complete Analyser</span>
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            AI-powered three-pillar analysis across 10 dimensions.
            Data from NSE, BSE, Screener, TradingView, Trendlyne &amp; more.
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-xl ${p.bg} border ${p.border} backdrop-blur-sm`}
            >
              <div className={p.color}>{p.icon}</div>
              <span className={`text-xs sm:text-sm font-semibold mt-2 ${p.color}`}>{p.title}</span>
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 leading-tight">{p.desc}</span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-slate-900/70 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-white/10 p-6 sm:p-8 space-y-6 backdrop-blur-xl">
          {/* Stock Name Input */}
          <div>
            <label htmlFor="stock" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Which stock do you want to analyse?
            </label>
            <input
              id="stock"
              type="text"
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
              placeholder="Enter company name or NSE/BSE ticker..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/30 focus:border-blue-400 dark:focus:border-cyan-500 transition-all text-sm"
              disabled={isLoading}
            />
            <div className="flex flex-wrap gap-1.5 mt-3">
              {POPULAR_STOCKS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStockName(s)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-cyan-900/40 hover:text-blue-600 dark:hover:text-cyan-400 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors cursor-pointer"
                  disabled={isLoading}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Horizon Select */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Investment horizon
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {HORIZONS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorizon(h)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    horizon === h
                      ? "bg-blue-600 dark:bg-cyan-600 text-white border-blue-600 dark:border-cyan-600 shadow-md shadow-blue-200 dark:shadow-cyan-900/40"
                      : "bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-cyan-500/40 hover:text-blue-600 dark:hover:text-cyan-400"
                  }`}
                  disabled={isLoading}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Mode */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Analysis mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode("fast")}
                className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  mode === "fast"
                    ? "bg-blue-50 dark:bg-cyan-900/30 border-blue-500 dark:border-cyan-500 shadow-md shadow-blue-100 dark:shadow-cyan-900/30"
                    : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-cyan-500/40"
                }`}
                disabled={isLoading}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <svg className={`w-4 h-4 ${mode === "fast" ? "text-blue-600 dark:text-cyan-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  <span className={`text-sm font-bold ${mode === "fast" ? "text-blue-700 dark:text-cyan-300" : "text-slate-700 dark:text-slate-300"}`}>Fast</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">Quick analysis in ~60s using GPT-5.4</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("deep")}
                className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  mode === "deep"
                    ? "bg-purple-50 dark:bg-purple-900/30 border-purple-500 dark:border-purple-400 shadow-md shadow-purple-100 dark:shadow-purple-900/30"
                    : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/40"
                }`}
                disabled={isLoading}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <svg className={`w-4 h-4 ${mode === "deep" ? "text-purple-600 dark:text-purple-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                  <span className={`text-sm font-bold ${mode === "deep" ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-300"}`}>Deep Research</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">Reasoning model ~3-5 min using GPT-5.4 Pro</span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!stockName.trim() || !horizon || isLoading}
            className={`w-full py-3.5 rounded-xl ${
              mode === "deep"
                ? "bg-purple-600 dark:bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-700 shadow-md shadow-purple-200/50 dark:shadow-purple-900/30"
                : "bg-blue-600 dark:bg-cyan-600 hover:bg-blue-700 dark:hover:bg-cyan-700 shadow-md shadow-blue-200/50 dark:shadow-cyan-900/30"
            } disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:shadow-none text-white font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {mode === "deep" ? "Running deep research..." : "Running fast analysis..."}
              </>
            ) : (
              <>
                {mode === "deep" ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                )}
                {mode === "deep" ? "Deep Research Analysis" : "Fast Analyse"}
              </>
            )}
          </button>
        </form>

        {/* Features row */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 text-[11px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            10 Analysis Tabs
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Live Market Data
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Combined Verdict
          </span>
        </div>

        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-4 max-w-sm mx-auto leading-relaxed">
          For educational and screening purposes only. Not SEBI-registered research.
          Verify all data independently before investing.
        </p>
      </div>
    </div>
  );
}
