import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import indicators from "../utils/technicalIndicators";

import { GraphDataPoint } from "../types";

const RECHARTS_MAX_DATAPOINTS = 1000;

// Compress the data for performance reasons
// Only affects charting, does not affect simulation itself
const compress = (data: GraphDataPoint[]): GraphDataPoint[] => {
  const compressionRatio = Math.ceil(data.length / RECHARTS_MAX_DATAPOINTS);

  return data.filter((d, idx) => idx % compressionRatio === 0);
};

const lineIndicator = (key: string) => {
  if (key in indicators) {
    const indicator = indicators[key as keyof typeof indicators];
    return (
      <Line
        key={key}
        type="monotone"
        dataKey={indicator.key}
        stroke={indicator.color}
        yAxisId={0}
        dot={false}
      />
    );
  }

  return null;
};

const Chart = ({
  data,
  selectedIndicators,
}: {
  data: GraphDataPoint[];
  selectedIndicators: { [key: string]: boolean };
}) => {
  const compressedData = compress(data);
  return (
    <LineChart
      data={compressedData}
      width={window.innerWidth * (10 / 12) * 0.9}
      height={window.innerHeight * 0.6}
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
        dot={false}
      />
      {Object.keys(selectedIndicators)
        .filter((key) => selectedIndicators[key])
        .map((key) => lineIndicator(key))}
    </LineChart>
  );
};

export default Chart;
