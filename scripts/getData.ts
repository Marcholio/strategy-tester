import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import {
  AlphavantageEmaApiResponse,
  AlphavantageRsiApiResponse,
  AlphavantageFunction,
  AlphavantageInterval,
  AlphavantageOutputSize,
  AlphavantagePriceApiResponse,
  AlphavantageSeries,
  AlphavantageIndicator,
  AlphavantagePriceApiWeeklyResponse,
} from "../src/types";

const __dirname = path.resolve();

dotenv.config();

const baseUrl = "https://alphavantage.co/query";

const constructUrl = (params: {
  symbol: string;
  function: AlphavantageFunction;
  interval?: AlphavantageInterval;
  time_period?: number;
  series_type?: AlphavantageSeries;
  outputsize?: AlphavantageOutputSize;
}): string => {
  const queryParams = Object.entries(params).reduce(
    (acc, [key, value]) => acc + `&${key}=${value}`,
    ""
  );

  return `${baseUrl}?&${queryParams}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;
};

const fetchPriceData = async (ticker: string) => {
  const dailyUrl = constructUrl({
    function: "TIME_SERIES_DAILY",
    symbol: ticker,
    outputsize: "full",
  });

  const adjustedUrl = constructUrl({
    function: "TIME_SERIES_WEEKLY_ADJUSTED",
    symbol: ticker,
  });

  const dailyResponse = await fetch(dailyUrl);
  const adjustedResponse = await fetch(adjustedUrl);

  const dailyData: AlphavantagePriceApiResponse =
    (await dailyResponse.json()) as AlphavantagePriceApiResponse;

  const adjustedWeeklyData: AlphavantagePriceApiWeeklyResponse =
    (await adjustedResponse.json()) as AlphavantagePriceApiWeeklyResponse;

  // Manually hack daily adjusted data since it's behind a premium API endpoint
  // Monthly adjusted data used to calculate adjustment factors that are then applied to daily data
  const adjustmentFactors = Object.entries(
    adjustedWeeklyData["Weekly Adjusted Time Series"]
  ).reduce((acc, [date, value]) => {
    acc[date] =
      parseFloat(value["4. close"]) / parseFloat(value["5. adjusted close"]);
    return acc;
  }, {} as Record<string, number>);

  let adjustmentFactor =
    adjustmentFactors[Object.keys(adjustmentFactors).sort()[0]];

  const dailyAdjustedData: AlphavantagePriceApiResponse = {
    ...dailyData,
    "Time Series (Daily)": Object.entries(
      dailyData["Time Series (Daily)"]
    ).reduce((acc, [date, value]) => {
      if (adjustmentFactors[date]) {
        adjustmentFactor = adjustmentFactors[date];
      }

      acc[date] = {
        ...value,
        "4. close": (
          parseFloat(value["4. close"]) / adjustmentFactor
        ).toString(),
      };
      return acc;
    }, {} as AlphavantagePriceApiResponse["Time Series (Daily)"]),
  };

  const dailyDataPoints = Object.keys(dailyData["Time Series (Daily)"]).length;

  console.log(`Received ${dailyDataPoints} datapoints`);

  const filepath = path.join(__dirname, `./src/data/${ticker}-price.json`);

  console.log(`Storing data to file ${filepath}`);
  fs.writeFileSync(filepath, JSON.stringify(dailyAdjustedData, null, 2));
};

const fetchIndicator = async <
  T extends AlphavantageRsiApiResponse | AlphavantageEmaApiResponse
>(
  ticker: string,
  indicator: AlphavantageIndicator,
  period: number
) => {
  const url = constructUrl({
    function: indicator,
    symbol: ticker,
    interval: "daily",
    time_period: period,
    series_type: "close",
  });

  const response = await fetch(url);

  const data: T = (await response.json()) as T;

  const datapoints = Object.keys(
    // @ts-ignore-next-line
    data[`Technical Analysis: ${indicator}`]
  ).length;

  console.log(`Received ${datapoints} ${indicator}${period} datapoints`);

  const filepath = path.join(
    __dirname,
    `./src/data/${ticker}-${indicator}-${period}.json`
  );

  console.log(`Storing data to file ${filepath}`);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};

const fetchData = async (ticker: string) => {
  console.log(`Fetching data for ${ticker}`);

  await Promise.all([
    fetchPriceData(ticker),
    fetchIndicator<AlphavantageEmaApiResponse>(ticker, "EMA", 200),
    fetchIndicator<AlphavantageEmaApiResponse>(ticker, "EMA", 50),
    fetchIndicator<AlphavantageRsiApiResponse>(ticker, "RSI", 14),
  ]);

  console.log("Done.");
};

fetchData(process.argv[2]);
