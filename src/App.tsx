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
import { AlphavantageApiResponse, GraphData } from "./types";

type SimulationOutcome = {
  cash: number;
  shares: number;
  value: number;
};

const runSimulation = (data: GraphData): SimulationOutcome => {
  let cash = 1000;
  let shares = 0;

  data.forEach((datapoint) => {
    if (cash > 0) {
      shares += cash / datapoint.price;
      cash -= datapoint.price * shares;
    }
  });

  return {
    cash,
    shares,
    value: cash + shares * data[data.length - 1].price,
  };
};

const mapData = (data: AlphavantageApiResponse): GraphData =>
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
          setOutcome(runSimulation(mapData(sp500)));
        }}
      >
        RUN SIMULATION
      </button>
      {outcome && (
        <span>
          Cash: {outcome.cash}, shares: {outcome.shares}, total value:{" "}
          {outcome.value}. Profit: {outcome.value / 10 - 100} %
        </span>
      )}
    </div>
  );
};

export default App;
