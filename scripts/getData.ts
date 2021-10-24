import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

dotenv.config();

type AlphavantageApiResponse = {
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

  const filepath = path.join(__dirname, `./data/${ticker}.json`);

  console.log(`Storing data to file ${filepath}`);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));

  console.log("Done.");
}

fetchData(process.argv[2]);
