import {
  AlphavantageEmaApiResponse,
  AlphavantagePriceApiResponse,
  GraphDataPoint,
} from "../types";

const mapData = (
  priceData: AlphavantagePriceApiResponse,
  ema200Data: AlphavantageEmaApiResponse,
  ema50Data: AlphavantageEmaApiResponse
): GraphDataPoint[] =>
  Object.keys(priceData["Time Series (Daily)"])
    .reverse()
    .map((date) => ({
      name: date,
      price: parseFloat(
        priceData["Time Series (Daily)"][date]["5. adjusted close"]
      ),
      ema200: ema200Data["Technical Analysis: EMA"][date]
        ? parseFloat(ema200Data["Technical Analysis: EMA"][date]["EMA"])
        : null,
      ema50: ema50Data["Technical Analysis: EMA"][date]
        ? parseFloat(ema50Data["Technical Analysis: EMA"][date]["EMA"])
        : null,
    }))
    .filter((d) => d.ema200 !== null); // Ensure that all datapoints have all indicators defined

export default mapData;
