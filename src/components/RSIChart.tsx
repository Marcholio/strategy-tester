import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  YAxis,
  Tooltip,
  XAxis,
} from "recharts";

import { GraphDataPoint } from "../types";
import { compressChartData } from "../utils/chartUtils";
import indicators from "../utils/technicalIndicators";

const RSIChart = ({ data }: { data: GraphDataPoint[] }) => {
  const compressedData = compressChartData(data);
  return (
    <LineChart
      data={compressedData}
      width={window.innerWidth * (10 / 12) * 0.9}
      height={250}
    >
      <XAxis dataKey="name" />
      <YAxis min={0} max={100} ticks={[30, 70]} />
      <Tooltip />
      <CartesianGrid stroke="#c0c0c0" />
      <Line
        type="monotone"
        dataKey={indicators.rsi14.key}
        stroke={indicators.rsi14.color}
        yAxisId={0}
        dot={false}
      />
    </LineChart>
  );
};

export default RSIChart;
