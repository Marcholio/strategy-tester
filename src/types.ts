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
      "5. adjusted close": string;
      "6. volume": string;
      "7. dividend amount": string;
      "8. split coefficient": string;
    };
  };
};

export type AlphavantageEmaApiResponse = {
  "Meta Data": {
    "1: Symbol": string;
    "2: Indicator": string;
    "3: Last Refreshed": string;
    "4: Interval": string;
    "5: Time Period": number;
    "6: Series Type": string;
    "7: Time Zone": string;
  };
  "Technical Analysis: EMA": {
    [key: string]: {
      EMA: string;
    };
  };
};

export type GraphDataPoint = {
  name: string;
  price: number;
  ema200: number | null;
};
