type TechnicalIndicator = {
  key: string;
  type: string;
  period: number;
  description: string;
};

const ema200: TechnicalIndicator = {
  key: "ema200",
  type: "EMA",
  period: 200,
  description: "200 Exponential Moving Average (EMA)",
};

// TODO: Implement RSI 14
const rsi14: TechnicalIndicator = {
  key: "rsi14",
  type: "RSI",
  period: 14,
  description: "Relative strength index (RSI)",
};

const indicators = {
  ema200,
  rsi14,
};

export default indicators;
