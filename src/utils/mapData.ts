import { GraphDataPoint } from "../types/internal";
import { Alphavantage } from "../types/alphavantage";

const parseIndicatorValue = (
  data: Alphavantage.RsiApiResponse | Alphavantage.EmaApiResponse,
  date: string,
  indicator: Alphavantage.Indicator
): number | null =>
  // @ts-ignore
  data[`Technical Analysis: ${indicator}`][date]
    ? // @ts-ignore
      parseFloat(data[`Technical Analysis: ${indicator}`][date][indicator])
    : null;

const parseMacdValue = (
  data: Alphavantage.MacdApiResponse,
  date: string,
  key: "MACD" | "MACD_Hist" | "MACD_Signal"
): number | null =>
  data["Technical Analysis: MACDEXT"][date]
    ? parseFloat(data["Technical Analysis: MACDEXT"][date][key])
    : null;

const mapData = (
  priceData: Alphavantage.PriceApiResponse,
  ema200Data: Alphavantage.EmaApiResponse,
  ema50Data: Alphavantage.EmaApiResponse,
  rsi14Data: Alphavantage.RsiApiResponse,
  macdData: Alphavantage.MacdApiResponse
): GraphDataPoint[] =>
  Object.keys(priceData["Time Series (Daily)"])
    .reverse()
    .map((date) => ({
      name: date,
      price: parseFloat(priceData["Time Series (Daily)"][date]["4. close"]),
      ema200: parseIndicatorValue(ema200Data, date, "EMA"),
      ema50: parseIndicatorValue(ema50Data, date, "EMA"),
      rsi14: parseIndicatorValue(rsi14Data, date, "RSI"),
      macd: {
        hist: parseMacdValue(macdData, date, "MACD_Hist"),
        ma: parseMacdValue(macdData, date, "MACD"),
        signal: parseMacdValue(macdData, date, "MACD_Signal"),
      },
    }))
    .filter(
      (d) => !Object.values(d).some((val) => val === null)
    ) as GraphDataPoint[]; // Ensure that all datapoints have all indicators defined

export default mapData;
