import fetch, { Response } from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Alphavantage } from "../src/types/alphavantage";

const __dirname = path.resolve();

dotenv.config();

const baseUrl = "https://alphavantage.co/query";

const constructUrl = (params: {
  symbol: string;
  function: Alphavantage.Function;
  interval?: Alphavantage.Interval;
  time_period?: number;
  series_type?: Alphavantage.Series;
  outputsize?: Alphavantage.OutputSize;
}): string => {
  const queryParams = Object.entries(params)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `${baseUrl}?${queryParams}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;
};

const SECS_BETWEEN_REQS = 12;
let previousRequestTime = new Date(0).valueOf();

const sleep = (ms: number) =>
  new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("OK");
    }, ms);
  });

const throttledFetch = async (url: string): Promise<Response> => {
  let sent = false;
  while (!sent) {
    if (previousRequestTime + SECS_BETWEEN_REQS * 1000 < new Date().valueOf()) {
      sent = true;
      previousRequestTime = new Date().valueOf();
    }
    await sleep(1000);
  }

  console.log(`Sending request ${url.slice(0, 60)}...`);
  return fetch(url);
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

  const dailyResponse = await throttledFetch(dailyUrl);
  const adjustedResponse = await throttledFetch(adjustedUrl);

  const dailyData: Alphavantage.PriceApiResponse =
    (await dailyResponse.json()) as Alphavantage.PriceApiResponse;

  const adjustedWeeklyData: Alphavantage.PriceApiWeeklyResponse =
    (await adjustedResponse.json()) as Alphavantage.PriceApiWeeklyResponse;

  if (dailyData["Note"] || adjustedWeeklyData["Note"]) {
    console.log(
      `API rate (probably) exceeded: ${
        dailyData.Note ?? adjustedWeeklyData.Note
      }`
    );
    return;
  }
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

  const dailyAdjustedData: Alphavantage.PriceApiResponse = {
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
    }, {} as Alphavantage.PriceApiResponse["Time Series (Daily)"]),
  };

  const dailyDataPoints = Object.keys(dailyData["Time Series (Daily)"]).length;

  console.log(`Received ${dailyDataPoints} datapoints`);

  const filepath = path.join(__dirname, `./src/data/${ticker}-price.json`);

  console.log(`Storing data to file ${filepath}`);
  fs.writeFileSync(filepath, JSON.stringify(dailyAdjustedData, null, 2));
};

const fetchIndicator = async <
  T extends
    | Alphavantage.RsiApiResponse
    | Alphavantage.EmaApiResponse
    | Alphavantage.MacdApiResponse
>(
  ticker: string,
  indicator: Alphavantage.Indicator,
  period?: number
) => {
  const url = constructUrl({
    function: indicator,
    symbol: ticker,
    interval: "daily",
    time_period: period,
    series_type: "close",
  });

  const response = await throttledFetch(url);

  const data: T = (await response.json()) as T;

  if (data.Note) {
    console.log(`API rate (probably) exceeded: ${data.Note}`);
    return;
  }

  const datapoints = Object.keys(
    // @ts-ignore-next-line
    data[`Technical Analysis: ${indicator}`]
  ).length;

  console.log(`Received ${datapoints} ${indicator}${period ?? ""} datapoints`);

  const filepath = path.join(
    __dirname,
    `./src/data/${ticker}-${indicator}${period ? `-${period}` : ""}.json`
  );

  console.log(`Storing data to file ${filepath}`);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};

const fetchData = async (ticker: string) => {
  console.log(`Fetching data for ${ticker}`);

  await Promise.all([
    fetchPriceData(ticker),
    fetchIndicator<Alphavantage.EmaApiResponse>(ticker, "EMA", 200),
    fetchIndicator<Alphavantage.EmaApiResponse>(ticker, "EMA", 50),
    fetchIndicator<Alphavantage.RsiApiResponse>(ticker, "RSI", 14),
    fetchIndicator<Alphavantage.MacdApiResponse>(ticker, "MACDEXT"),
  ]);

  console.log("Done.");
};

fetchData(process.argv[2]);
