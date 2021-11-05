import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import {
  AlphavantageEmaApiResponse,
  AlphavantagePriceApiResponse,
} from "../src/types";

const __dirname = path.resolve();

dotenv.config();

const baseUrl = "https://alphavantage.co/query";

const fetchPriceData = async (ticker: string) => {
  const response = await fetch(
    `${baseUrl}?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&outputsize=full&apikey=${process.env.ALPHAVANTAGE_API_KEY}`
  );

  const data: AlphavantagePriceApiResponse =
    (await response.json()) as AlphavantagePriceApiResponse;

  const datapoints = Object.keys(data["Time Series (Daily)"]).length;

  console.log(`Received ${datapoints} datapoints`);

  const filepath = path.join(__dirname, `./src/data/${ticker}-price.json`);

  console.log(`Storing data to file ${filepath}`);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};

const fetchEma = async (ticker: string) => {
  const response = await fetch(
    `${baseUrl}?function=EMA&symbol=${ticker}&interval=daily&time_period=200&series_type=close&apikey=${process.env.ALPHAVANTAGE_API_KEY}`
  );

  const data: AlphavantageEmaApiResponse =
    (await response.json()) as AlphavantageEmaApiResponse;

  const datapoints = Object.keys(data["Technical Analysis: EMA"]).length;

  console.log(`Received ${datapoints} EMA datapoints`);

  const filepath = path.join(__dirname, `./src/data/${ticker}-EMA.json`);

  console.log(`Storing data to file ${filepath}`);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};

const fetchData = async (ticker: string) => {
  console.log(`Fetching data for ${ticker}`);

  await Promise.all([fetchPriceData(ticker), fetchEma(ticker)]);

  console.log("Done.");
};

fetchData(process.argv[2]);
