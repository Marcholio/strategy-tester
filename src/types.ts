export type AlphavantagePriceApiResponse = {
  "Meta Data": {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Output Size": string;
    "5. Time Zone": string;
  };
  "Time Series (Daily)": {
    [key: string]: {
      "1. open": string;
      "2. high": string;
      "3. low": string;
      "4. close": string;
      "5. volume": string;
    };
  };
};

export type AlphavantagePriceApiWeeklyResponse = {
  "Meta Data": {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Time Zone": string;
  };
  "Weekly Adjusted Time Series": {
    [key: string]: {
      "1. open": string;
      "2. high": string;
      "3. low": string;
      "4. close": string;
      "5. adjusted close": string;
      "6. volume": string;
      "7. dividend amount": string;
    };
  };
};

type AlphavantageTAMetaData = {
  "Meta Data": {
    "1: Symbol": string;
    "2: Indicator": string;
    "3: Last Refreshed": string;
    "4: Interval": string;
    "5: Time Period": number;
    "6: Series Type": string;
    "7: Time Zone": string;
  };
};

export type AlphavantageEmaApiResponse = AlphavantageTAMetaData & {
  "Technical Analysis: EMA": {
    [key: string]: {
      EMA: string;
    };
  };
};

export type AlphavantageRsiApiResponse = AlphavantageTAMetaData & {
  "Technical Analysis: RSI": {
    [key: string]: {
      RSI: string;
    };
  };
};

export type AlphavantageIndicator = "EMA" | "RSI";
export type AlphavantageFunction =
  | AlphavantageIndicator
  | "TIME_SERIES_DAILY"
  | "TIME_SERIES_WEEKLY_ADJUSTED";
export type AlphavantageInterval = "daily";
export type AlphavantageSeries = "close" | "low" | "high" | "open";
export type AlphavantageOutputSize = "full" | "compact";

export type GraphDataPoint = {
  name: string;
  price: number;
  ema200: number;
  ema50: number;
  rsi14: number;
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
};

export type SimulationParams = {
  initialCash: number;
  monthlyCash: number;
  txCost: number;
  cooldown: number;
};
