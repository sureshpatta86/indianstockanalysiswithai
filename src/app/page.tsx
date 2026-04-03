"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { StockInput } from "@/components/stock-input";
import { Dashboard } from "@/components/dashboard";
import { LoadingState } from "@/components/loading-state";
import { AnimatedBackground } from "@/components/animated-background";
import type { StockData } from "@/lib/types";

type AppState = "input" | "loading" | "dashboard" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("input");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [stockName, setStockName] = useState("");
  const [analysisMode, setAnalysisMode] = useState<"fast" | "deep">("fast");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  const handleSubmit = useCallback(async (name: string, horizon: string, mode: "fast" | "deep") => {
    setStockName(name);
    setAnalysisMode(mode);
    setState("loading");
    setProgress(0);
    setError("");

    // Simulate progress while waiting — slower for deep mode
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return mode === "deep"
          ? p + Math.random() * 2 + 0.5
          : p + Math.random() * 4 + 1;
      });
    }, mode === "deep" ? 3000 : 2000);

    // Client-side timeout: 15 min for deep, 5 min for fast
    const controller = new AbortController();
    const timeoutMs = mode === "deep" ? 900_000 : 300_000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockName: name, horizon, mode }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      // Read the stream
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        // Update progress based on text length (~25K chars for full 3-pillar JSON)
        const estimatedProgress = Math.min(90, (fullText.length / 25000) * 90);
        setProgress(estimatedProgress);
      }
      clearTimeout(timeout);

      if (progressRef.current) clearInterval(progressRef.current);
      setProgress(100);

      // Parse JSON from the response - handle markdown code fences
      let jsonText = fullText.trim();

      if (!jsonText) {
        throw new Error("Empty response from AI. Check your API key and model configuration.");
      }

      // Remove markdown code fences if present
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
      }

      // Try to extract JSON object
      const jsonStart = jsonText.indexOf("{");
      const jsonEnd = jsonText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        jsonText = jsonText.slice(jsonStart, jsonEnd + 1);
      }

      const parsed: StockData = JSON.parse(jsonText);
      setStockData(parsed);
      setState("dashboard");
    } catch (err) {
      clearTimeout(timeout);
      if (progressRef.current) clearInterval(progressRef.current);
      console.error("Analysis error:", err);
      const msg = err instanceof Error
        ? err.name === "AbortError"
          ? `Analysis timed out after ${mode === "deep" ? "15" : "5"} minutes. The AI model may be overloaded — please try again.`
          : err.message
        : "Something went wrong. Please try again.";
      setError(msg);
      setState("error");
    }
  }, []);

  const handleReset = useCallback(() => {
    setState("input");
    setStockData(null);
    setStockName("");
    setAnalysisMode("fast");
    setProgress(0);
    setError("");
  }, []);

  if (state === "loading") {
    return (
      <>
        <AnimatedBackground />
        <LoadingState stockName={stockName} progress={progress} mode={analysisMode} />
      </>
    );
  }

  if (state === "dashboard" && stockData) {
    return (
      <>
        <AnimatedBackground />
        <Dashboard data={stockData} onReset={handleReset} />
      </>
    );
  }

  if (state === "error") {
    return (
      <>
        <AnimatedBackground />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Analysis Failed</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-blue-600 dark:bg-cyan-600 hover:bg-blue-700 dark:hover:bg-cyan-700 text-white font-semibold text-sm transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <StockInput onSubmit={handleSubmit} isLoading={false} />
    </>
  );
}
