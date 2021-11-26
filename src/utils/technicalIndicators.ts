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

const indicators = {
  ema200,
};

export default indicators;
