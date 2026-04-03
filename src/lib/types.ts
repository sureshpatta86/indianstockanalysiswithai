export interface TechnicalIndicator {
  indicator: string;
  timeframe: string;
  value: string;
  signal: string;
  score: number;
}

export interface TechnicalsData {
  trendStatus: {
    emaAlignment: string;
    emaAlignmentDetail: string;
    priceVs200SMA: string;
    distanceFrom200SMA: string;
    goldenDeathCross: string;
    goldenDeathCrossDate: string;
    supertrendDaily: string;
    supertrendDailyValue: string;
    supertrendWeekly: string;
    supertrendWeeklyValue: string;
    distanceFrom52WH: string;
    distanceFrom52WL: string;
  };
  momentum: {
    rsiDaily: string;
    rsiDailyZone: string;
    rsiWeekly: string;
    rsiWeeklyZone: string;
    rsiDivergence: string;
    macdDaily: string;
    macdDailyHistogram: string;
    macdDailyZeroLine: string;
    macdWeekly: string;
    macdWeeklyHistogram: string;
    macdWeeklyZeroLine: string;
    adxValue: string;
    adxStrength: string;
    adxDirection: string;
    stochRsiValue: string;
    stochRsiZone: string;
  };
  volumeDelivery: {
    volumeRatio: string;
    volumeClassification: string;
    obvTrend: string;
    obvDivergence: string;
    deliveryPercent: string;
    deliveryAvg20d: string;
    deliveryClassification: string;
    deliveryPriceSignal: string;
  };
  keyLevels: {
    support1: string;
    support1Source: string;
    support2: string;
    support2Source: string;
    support3: string;
    support3Source: string;
    resistance1: string;
    resistance1Source: string;
    resistance2: string;
    resistance2Source: string;
    resistance3: string;
    resistance3Source: string;
    stopLoss: string;
    stopLossMethod: string;
  };
  indicatorScorecard: TechnicalIndicator[];
  scoreSummary: {
    bullish: number;
    neutral: number;
    bearish: number;
    netScore: number;
    verdict: string;
  };
  divergences: {
    rsi: string;
    obv: string;
    macd: string;
  };
  chartPattern: {
    pattern: string;
    implication: string;
    status: string;
  } | null;
  bollingerSqueeze: boolean;
  ichimoku: {
    pricePosition: string;
    cloudColor: string;
    tenkanVsKijun: string;
    chikouSpan: string;
    futureCloud: string;
  };
}

export interface SentimentData {
  institutional: {
    fiiTrend: string;
    fiiHoldings: { quarter: string; holding: string }[];
    fiiSignal: string;
    diiTrend: string;
    diiHoldings: { quarter: string; holding: string }[];
    diiSignal: string;
    mfSchemesCurrent: string;
    mfSchemesYearAgo: string;
    mfTopHolders: string[];
    mfSignal: string;
    bulkBlockDeals: { date: string; party: string; type: string; qty: string; price: string }[];
    bulkBlockSignal: string;
  };
  insider: {
    activities: { date: string; type: string; person: string; qty: string; price: string }[];
    netActivity: string;
    pledgePercent: string;
    pledgeTrend: string;
    insiderSignal: string;
    redFlag: boolean;
    redFlagReason: string;
  };
  analystConsensus: {
    totalAnalysts: number;
    strongBuy: number;
    buy: number;
    hold: number;
    sell: number;
    strongSell: number;
    consensus: string;
    avgTargetPrice: string;
    upsideDownside: string;
    highestTarget: string;
    lowestTarget: string;
    recentChanges: { broker: string; oldRating: string; newRating: string; targetChange: string }[];
    signal: string;
  };
  options: {
    available: boolean;
    pcr: string;
    pcrSignal: string;
    oiInterpretation: string;
    maxPain: string;
    highestCallOI: string;
    highestPutOI: string;
  } | null;
  news: {
    positive: number;
    neutral: number;
    negative: number;
    dominantNarrative: string;
    earningsCallTone: string;
    signal: string;
  };
  marketMood: {
    mmiValue: string;
    mmiZone: string;
    vixValue: string;
    vixClassification: string;
    googleTrends: string;
    signal: string;
  };
  scorecard: {
    signals: { source: string; reading: string; signal: string; weight: string }[];
    weightedScore: number;
    verdict: string;
  };
  redFlags: { type: string; description: string; severity: string }[];
  contrarianSignals: { signal: string; description: string }[];
}

export interface StockData {
  company: {
    name: string;
    nseSymbol: string;
    bseCode: string;
    isin: string;
    sector: string;
    subSector: string;
    cmp: string;
    marketCap: string;
    weekHigh52: string;
    weekLow52: string;
    faceValue: string;
    description: string;
    dataConfidence: "HIGH" | "MODERATE" | "LOW" | "VERY LOW";
    liveMetrics: number;
    totalMetrics: number;
    lastUpdated: string;
    sources: string[];
  };
  overview: {
    pe: string;
    pb: string;
    evEbitda: string;
    revenueCagr3y: string;
    revenueCagr5y: string;
    profitCagr3y: string;
    profitCagr5y: string;
    roe: string;
    roce: string;
    debtToEquity: string;
    divYield: string;
    signals: {
      revenueCagr3y: string;
      profitCagr3y: string;
      roe: string;
      debtToEquity: string;
      divYield: string;
    };
  };
  valuation: {
    sectorName: string;
    primaryMetric: string;
    metrics: {
      name: string;
      current: string;
      sectorAvg: string;
      fiveYrAvg: string;
      signal: "CHEAP" | "FAIR" | "EXPENSIVE";
      reason: string;
    }[];
    overall: "UNDERVALUED" | "FAIRLY VALUED" | "OVERVALUED" | "MIXED";
  };
  growth: {
    revenue: {
      cagr3y: string;
      cagr5y: string;
      lastFourQtrYoY: string[];
      trend: string;
    };
    netProfit: {
      cagr3y: string;
      cagr5y: string;
      lastFourQtrYoY: string[];
      trend: string;
    };
    eps: { quarter: string; value: string; yoyChange: string }[];
    margins: { year: string; ebitda: string; netProfit: string }[];
    overallTrend: "ACCELERATING" | "STEADY" | "SLOWING" | "DECLINING";
  };
  health: {
    type: "banking" | "non-banking";
    debtToEquity?: { value: string; signal: string };
    interestCoverage?: { value: string; signal: string };
    currentRatio?: { value: string; signal: string };
    netDebt?: string;
    cashEquivalents?: string;
    fcf?: { value: string; signal: string };
    fcfTrend?: { year: string; value: string; signal: string }[];
    bankingMetrics?: {
      car: { value: string; signal: string };
      gnpa: { value: string; signal: string };
      nnpa: { value: string; signal: string };
      pcr: { value: string; signal: string };
      nim: { value: string; signal: string };
      casa: { value: string; signal: string };
      creditDeposit: { value: string; signal: string };
      loanBookCagr: { value: string; signal: string };
      roa: { value: string; signal: string };
      slippage: { value: string; signal: string };
    } | null;
    scenarios: {
      horizon: string;
      bear: string;
      base: string;
      bull: string;
    };
  };
  returns: {
    roe: { current: string; avg3y: string; avg5y: string; signal: string };
    roce: { current: string; avg3y: string; avg5y: string; signal: string };
    roa: { current: string; avg3y: string; avg5y: string; signal: string } | null;
    dividends: { year: string; dps: string; payoutRatio: string }[];
    classification: string;
  };
  peers: {
    companies: {
      name: string;
      primaryMetric: string;
      roe: string;
      revenueCagr: string;
      de: string;
      sectorKpi: string;
      sectorKpiLabel: string;
      isSubject: boolean;
    }[];
    standing: "LEADING" | "MID-PACK" | "LAGGING";
    news: { headline: string; summary: string; source: string }[];
  };
  ownership: {
    promoter: {
      quarters: { quarter: string; holding: string; change: string }[];
      trend: string;
      pledging: string;
      pledgingAlert: boolean;
    };
    fii: {
      quarters: { quarter: string; holding: string; change: string }[];
      trend: string;
    };
    dii: {
      quarters: { quarter: string; holding: string; change: string }[];
      trend: string;
    };
    managementTone: string;
  };
  annualFinancials: {
    year: string;
    revenue: string;
    pat: string;
    ebitdaMargin: string;
    netProfitMargin: string;
    roe: string;
    roce: string;
    debtToEquity: string;
    fcf: string;
    dps: string;
  }[];
  technicals?: TechnicalsData;
  sentiment?: SentimentData;
  view: {
    verdict: string;
    combinedScore: number;
    fundamentalScore: number;
    technicalScore: number;
    sentimentScore: number;
    fundamentalWeight: string;
    technicalWeight: string;
    sentimentWeight: string;
    fundamentalVerdict: string;
    technicalVerdict: string;
    sentimentVerdict: string;
    fundamentalReason: string;
    technicalReason: string;
    sentimentReason: string;
    signalAlignment: string;
    signalConflictExplanation: string;
    horizon: string;
    verdictReason: string;
    quality: string;
    technicalPosture: string;
    marketSentiment: string;
    summary: string;
    strengths: string[];
    watchPoints: string[];
    track: string;
    entryZone: string;
    stopLoss: string;
    targetZone: string;
    opportunities: string[];
    risks: string[];
    timelineMatch: string;
    dataConfidence: {
      fundamental: string;
      technical: string;
      sentiment: string;
      overall: string;
    };
    redFlagOverride: boolean;
    redFlagReason: string;
  };
}
