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
      {selectedIndicators[indicators.ema200.key] && (
        <Line
          type="monotone"
          dataKey="ema200"
          stroke="#00ff00"
          yAxisId={0}
          dot={false}
        />
      )}
    </LineChart>
  );
};

export default Chart;
