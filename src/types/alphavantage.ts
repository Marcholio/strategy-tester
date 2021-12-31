export namespace Alphavantage {
  export type PriceApiResponse = {
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
    Note?: string;
  };

  export type PriceApiWeeklyResponse = {
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
    Note?: string;
  };

  export type TAMetaData = {
    "Meta Data": {
      "1: Symbol": string;
      "2: Indicator": string;
      "3: Last Refreshed": string;
      "4: Interval": string;
      "5: Time Period": number;
      "6: Series Type": string;
      "7: Time Zone": string;
    };
    Note?: string;
  };

  export type EmaApiResponse = TAMetaData & {
    "Technical Analysis: EMA": {
      [key: string]: {
        EMA: string;
      };
    };
  };

  export type RsiApiResponse = TAMetaData & {
    "Technical Analysis: RSI": {
      [key: string]: {
        RSI: string;
      };
    };
  };

  export type MacdApiResponse = {
    "Meta Data": {
      "1: Symbol": string;
      "2: Indicator": string;
      "3: Last Refreshed": string;
      "4: Interval": string;
      "5.1: Fast Period": number;
      "5.2: Slow Period": number;
      "5.3: Signal Period": number;
      "5.4: Fast MA Type": number;
      "5.5: Slow MA Type": number;
      "5.6: Signal MA Type": number;
      "6: Series Type": string;
      "7: Time Zone": string;
    };
    "Technical Analysis: MACDEXT": {
      [key: string]: {
        MACD: string;
        MACD_Hist: string;
        MACD_Signal: string;
      };
    };
    Note?: string;
  };

  export type Indicator = "EMA" | "RSI" | "MACDEXT";
  export type Function =
    | Indicator
    | "TIME_SERIES_DAILY"
    | "TIME_SERIES_WEEKLY_ADJUSTED";
  export type Interval = "daily";
  export type Series = "close" | "low" | "high" | "open";
  export type OutputSize = "full" | "compact";
}
