export type GraphDataPoint = {
  name: string;
  price: number;
  ema200: number;
  ema50: number;
  rsi14: number;
  macd: {
    hist: number;
    ma: number;
    signal: number;
  };
};

export type Strategy = {
  buy: (prev: GraphDataPoint, cur: GraphDataPoint) => boolean;
  sell: (prev: GraphDataPoint, cur: GraphDataPoint) => boolean;
  title: string;
  description: string;
};

export type Transaction = {
  type: "buy" | "sell";
  amount: number;
  totalValue: number;
  price: number;
  date: string;
};

export type SimulationOutcome = {
  cash: number;
  shares: number;
  value: number;
  profit: number;
  transactions: Transaction[];
  chartData: { name: string; value: number }[];
};

export type SimulationParams = {
  initialCash: number;
  monthlyCash: number;
  txCost: number;
  cooldown: number;
  posSize: number;
  minPos: number;
};
