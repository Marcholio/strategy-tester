import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { AlphavantageApiResponse } from "../src/types";

const __dirname = path.resolve();

dotenv.config();

const baseUrl = "https://alphavantage.co/query";

async function fetchData(ticker: string) {
  console.log(`Fetching data for ${ticker}`);
  const response = await fetch(
    `${baseUrl}?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&outputsize=full&apikey=${process.env.ALPHAVANTAGE_API_KEY}`
  );

  const data: AlphavantageApiResponse =
    (await response.json()) as AlphavantageApiResponse;
  const datapoints = Object.keys(data["Time Series (Daily)"]).length;

  console.log(`Received ${datapoints} datapoints`);

  const filepath = path.join(__dirname, `./src/data/${ticker}.json`);

  console.log(`Storing data to file ${filepath}`);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));

  console.log("Done.");
}

fetchData(process.argv[2]);
