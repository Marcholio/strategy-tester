import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { GraphDataPoint, SimulationOutcome } from "../types/internal";
import { compressData } from "../utils/chartUtils";

const ResultChart = ({
  priceData,
  outcomeLeft,
  outcomeRight,
}: {
  priceData: GraphDataPoint[];
  outcomeLeft: SimulationOutcome;
  outcomeRight: SimulationOutcome;
}) => {
  const combinedData = outcomeLeft.chartData.map((datapoint, i) => ({
    name: datapoint.name,
    left: Math.round(datapoint.value * 100) / 100,
    right: Math.round(outcomeRight.chartData[i].value * 100) / 100,
  }));

  const compressedData = compressData(combinedData);

  return (
    <LineChart
      data={compressedData}
      width={window.innerWidth * 0.9}
      height={500}
    >
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <CartesianGrid stroke="#f5f5f5" />
      <Line
        type="monotone"
        dataKey="left"
        stroke="#ff5722"
        yAxisId={0}
        dot={false}
      />
      <Line
        type="monotone"
        dataKey="right"
        stroke="#4caf50"
        yAxisId={0}
        dot={false}
      />
    </LineChart>
  );
};

export default ResultChart;
