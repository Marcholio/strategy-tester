import React, { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import sp500 from "./data/SXR8.FRK.json";

import "./App.css";
import { AlphavantageApiResponse, GraphDataPoint } from "./types";

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

const mapData = (data: AlphavantageApiResponse): GraphDataPoint[] =>
  Object.keys(data["Time Series (Daily)"])
    .reverse()
    .map((date) => ({
      name: date,
      price: parseFloat(data["Time Series (Daily)"][date]["5. adjusted close"]),
    }));

const App = () => {
  const [outcome, setOutcome] = useState<SimulationOutcome>();
  return (
    <div className="main">
      <LineChart
        data={mapData(sp500)}
        width={window.innerWidth * 0.9}
        height={window.innerHeight * 0.9}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line type="monotone" dataKey="price" stroke="#0000ff" yAxisId={0} />
      </LineChart>
      <button
        onClick={() => {
          setOutcome(runSimulation(mapData(sp500), dollarCostAveraging));
        }}
      >
        RUN SIMULATION
      </button>
      {outcome && (
        <span>
          Cash: {outcome.cash}, shares: {outcome.shares}, total value:{" "}
          {outcome.value}. Profit: {outcome.profit} %
        </span>
      )}
    </div>
  );
};

export default App;
