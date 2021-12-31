type TechnicalIndicator = {
  key: string;
  type: string;
  period?: number;
  description: string;
  color: string[];
};

const ema200: TechnicalIndicator = {
  key: "ema200",
  type: "EMA",
  period: 200,
  description: "200 Exponential Moving Average (EMA)",
  color: ["#00FF00"],
};

const ema50: TechnicalIndicator = {
  key: "ema50",
  type: "EMA",
  period: 50,
  description: "50 Exponential Moving Average (EMA)",
  color: ["#FFA500"],
};

const rsi14: TechnicalIndicator = {
  key: "rsi14",
  type: "RSI",
  period: 14,
  description: "Relative strength index (RSI)",
  color: ["#673AB7"],
};

const macd: TechnicalIndicator = {
  key: "macd",
  type: "MACDEXT",
  description: "Moving average convergence divergence (MACD)",
  color: ["#0000FF", "#FFB300", "#29B6F6"],
};

const indicators = {
  ema200,
  ema50,
  rsi14,
  macd,
};

export default indicators;
