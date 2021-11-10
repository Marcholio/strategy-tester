import React, { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Grid } from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";

import sp500Price from "./data/SXR8.FRK-price.json";
import sp500Ema200 from "./data/SXR8.FRK-EMA.json";

import {
  AlphavantageEmaApiResponse,
  AlphavantagePriceApiResponse,
  GraphDataPoint,
} from "./types";

import "./App.css";

type SimulationOutcome = {
  cash: number;
  shares: number;
  value: number;
  profit: number;
};

type Strategy = {
  buy: (datapoint: GraphDataPoint) => boolean;
  sell: (datapoint: GraphDataPoint) => boolean;
  cooldown: number;
};

const dollarCostAveraging: Strategy = {
  buy: () => true,
  sell: () => false,
  cooldown: 0,
};

const ema200Strategy: Strategy = {
  buy: (datapoint: GraphDataPoint) =>
    datapoint.ema200 !== null && datapoint.price > datapoint.ema200,
  sell: (datapoint: GraphDataPoint) =>
    datapoint.ema200 !== null && datapoint.price < datapoint.ema200,
  cooldown: 30,
};

const runSimulation = (
  data: GraphDataPoint[],
  strategy: Strategy
): SimulationOutcome => {
  console.log(strategy);
  const monthlySaving = 100;
  // TODO: Transaction costs

  let cash = 1000;
  let shares = 0;

  if (data.length === 0) {
    return {
      cash,
      shares,
      value: cash,
      profit: 0,
    };
  }

  let curMonth = data[0].name.slice(0, 7);
  let invested = cash;

  data.forEach((datapoint) => {
    // Add money to account once per month
    if (!datapoint.name.startsWith(curMonth)) {
      cash += monthlySaving;
      invested += monthlySaving;
      curMonth = datapoint.name.slice(0, 7);
    }

    if (strategy.buy(datapoint)) {
      if (cash > 0) {
        const sharesBought = cash / datapoint.price;
        shares += sharesBought;
        cash -= datapoint.price * sharesBought;
      }
    }

    if (strategy.sell(datapoint)) {
      if (shares > 0) {
        cash += shares * datapoint.price;
        shares = 0; // TODO: Sell smaller positions
      }
    }
  });

  const totalValue = cash + shares * data[data.length - 1].price;

  return {
    cash,
    shares,
    value: totalValue,
    profit: (totalValue / invested - 1) * 100,
  };
};

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

const App = () => {
  const [outcome, setOutcome] = useState<SimulationOutcome>();
  const [outcomeB, setOutcomeB] = useState<SimulationOutcome>();
  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={10}>
          <LineChart
            data={mapData(sp500Price, sp500Ema200)}
            width={window.innerWidth * (10 / 12) * 0.9}
            height={window.innerHeight * 0.9}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#0000ff"
              yAxisId={0}
            />
            <Line
              type="monotone"
              dataKey="ema200"
              stroke="#00ff00"
              yAxisId={0}
            />
          </LineChart>
        </Grid>
        <Grid item xs={2}>
          <span>To be added</span>
        </Grid>
      </Grid>

      <button
        onClick={() => {
          setOutcome(
            runSimulation(mapData(sp500Price, sp500Ema200), dollarCostAveraging)
          );
          setOutcomeB(
            runSimulation(mapData(sp500Price, sp500Ema200), ema200Strategy)
          );
        }}
      >
        RUN SIMULATION
      </button>
      {"OUTCOME"}
      {outcome && (
        <span>
          Cash: {outcome.cash}, shares: {outcome.shares}, total value:{" "}
          {outcome.value}. Profit: {outcome.profit} %
        </span>
      )}
      {"OUTCOME B"}
      {outcomeB && (
        <span>
          Cash: {outcomeB.cash}, shares: {outcomeB.shares}, total value:{" "}
          {outcomeB.value}. Profit: {outcomeB.profit} %
        </span>
      )}
      <Footer />
    </>
  );
};

export default App;
