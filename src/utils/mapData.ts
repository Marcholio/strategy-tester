import {
  AlphavantageEmaApiResponse,
  AlphavantageIndicator,
  AlphavantagePriceApiResponse,
  AlphavantageRsiApiResponse,
  GraphDataPoint,
} from "../types";

const parseIndicatorValue = (
  data: AlphavantageRsiApiResponse | AlphavantageEmaApiResponse,
  date: string,
  indicator: AlphavantageIndicator
): number | null =>
  // @ts-ignore
  data[`Technical Analysis: ${indicator}`][date]
    ? // @ts-ignore
      parseFloat(data[`Technical Analysis: ${indicator}`][date][indicator])
    : null;

const mapData = (
  priceData: AlphavantagePriceApiResponse,
  ema200Data: AlphavantageEmaApiResponse,
  ema50Data: AlphavantageEmaApiResponse,
  rsi14Data: AlphavantageRsiApiResponse
): GraphDataPoint[] =>
  Object.keys(priceData["Time Series (Daily)"])
    .reverse()
    .map((date) => ({
      name: date,
      price: parseFloat(priceData["Time Series (Daily)"][date]["4. close"]),
      ema200: parseIndicatorValue(ema200Data, date, "EMA"),
      ema50: parseIndicatorValue(ema50Data, date, "EMA"),
      rsi14: parseIndicatorValue(rsi14Data, date, "RSI"),
    }))
    .filter(
      (d) => !Object.values(d).some((val) => val === null)
    ) as GraphDataPoint[]; // Ensure that all datapoints have all indicators defined

export default mapData;
