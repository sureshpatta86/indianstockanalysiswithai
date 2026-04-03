"use client";

const STEPS = [
  "Verifying listing on NSE/BSE...",
  "Detecting sector and sub-sector...",
  "Fetching financial data from multiple sources...",
  "Analyzing valuation metrics...",
  "Evaluating growth trajectory...",
  "Assessing financial health...",
  "Calculating return ratios...",
  "Comparing with sector peers...",
  "Analyzing ownership patterns...",
  "Computing technical indicators (15 signals)...",
  "Identifying support & resistance levels...",
  "Evaluating market sentiment (8 signals)...",
  "Assessing institutional & insider activity...",
  "Calculating combined three-pillar verdict...",
];

export function LoadingState({ stockName, progress, mode = "fast" }: { stockName: string; progress: number; mode?: "fast" | "deep" }) {
  const activeStep = Math.min(Math.floor(progress / (100 / STEPS.length)), STEPS.length - 1);
  const isDeep = mode === "deep";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${isDeep ? "bg-purple-600 dark:bg-purple-600 shadow-lg shadow-purple-200 dark:shadow-purple-900/40" : "bg-blue-600 dark:bg-cyan-600 shadow-lg shadow-blue-200 dark:shadow-cyan-900/40"} flex items-center justify-center`}>
            <svg className="animate-spin h-7 w-7 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-3 ${
            isDeep
              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-700/30"
              : "bg-blue-100 dark:bg-cyan-900/30 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-cyan-700/30"
          }`}>
            {isDeep ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            )}
            {isDeep ? "Deep Research Mode" : "Fast Analysis Mode"}
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Analyzing <span className={isDeep ? "text-purple-600 dark:text-purple-400" : "text-blue-600 dark:text-cyan-400"}>{stockName}</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isDeep
              ? "Deep reasoning analysis may take 3-5 minutes for comprehensive results"
              : "This may take 60\u201390 seconds as AI analyses fundamentals, technicals & sentiment"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-6 overflow-hidden">
          <div
            className={`h-full ${isDeep ? "bg-purple-600 dark:bg-purple-500" : "bg-blue-600 dark:bg-cyan-500"} rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${Math.max(progress, 5)}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs transition-all ${
                i < activeStep
                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20"
                  : i === activeStep
                  ? "text-blue-700 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-900/20 font-medium"
                  : "text-slate-300 dark:text-slate-600"
              }`}
            >
              {i < activeStep ? (
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : i === activeStep ? (
                <div className="w-3.5 h-3.5 flex-shrink-0 rounded-full border-2 border-blue-500 dark:border-cyan-400 border-t-transparent animate-spin" />
              ) : (
                <div className="w-3.5 h-3.5 flex-shrink-0 rounded-full border border-slate-200 dark:border-slate-700" />
              )}
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
