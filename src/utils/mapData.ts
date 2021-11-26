import {
  AlphavantageEmaApiResponse,
  AlphavantagePriceApiResponse,
  GraphDataPoint,
} from "../types";

const mapData = (
  priceData: AlphavantagePriceApiResponse,
  ema200Data: AlphavantageEmaApiResponse
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
    }));

export default mapData;
