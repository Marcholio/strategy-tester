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
import { compressData } from "../utils/chartUtils";

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
  omitIndicators,
}: {
  data: GraphDataPoint[];
  selectedIndicators: { [key: string]: boolean };
  omitIndicators: string[];
}) => {
  if (
    omitIndicators.filter(
      (indicator) => selectedIndicators[indicator] === undefined
    ).length > 0
  ) {
    console.warn(
      "WARNING: omitted indicators not present in selected indicators!"
    );
  }

  const compressedData = compressData<GraphDataPoint>(data);
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
        .filter(
          (key) => !omitIndicators.includes(key) && selectedIndicators[key]
        )
        .map((key) => lineIndicator(key))}
    </LineChart>
  );
};

export default Chart;
