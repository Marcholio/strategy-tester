type TechnicalIndicator = {
  key: string;
  type: string;
  period: number;
  description: string;
  color: string;
};

const ema200: TechnicalIndicator = {
  key: "ema200",
  type: "EMA",
  period: 200,
  description: "200 Exponential Moving Average (EMA)",
  color: "#00FF00",
};

const ema50: TechnicalIndicator = {
  key: "ema50",
  type: "EMA",
  period: 50,
  description: "50 Exponential Moving Average (EMA)",
  color: "#FFA500",
};

const indicators = {
  ema200,
  ema50,
};

export default indicators;
