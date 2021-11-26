import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import mapData from "../utils/mapData";

import {
  AlphavantageEmaApiResponse,
  AlphavantagePriceApiResponse,
} from "../types";

const Chart = ({
  priceData,
  ema200Data,
}: {
  priceData: AlphavantagePriceApiResponse;
  ema200Data: AlphavantageEmaApiResponse;
}) => (
  <LineChart
    data={mapData(priceData, ema200Data)}
    width={window.innerWidth * (10 / 12) * 0.9}
    height={window.innerHeight * 0.9}
  >
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <CartesianGrid stroke="#f5f5f5" />
    <Line type="monotone" dataKey="price" stroke="#0000ff" yAxisId={0} />
    <Line type="monotone" dataKey="ema200" stroke="#00ff00" yAxisId={0} />
  </LineChart>
);

export default Chart;
