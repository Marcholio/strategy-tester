import React from "react";
import {
  CartesianGrid,
  Line,
  YAxis,
  Tooltip,
  XAxis,
  ComposedChart,
  Bar,
} from "recharts";

import { GraphDataPoint } from "../types/internal";
import { compressData } from "../utils/chartUtils";
import indicators from "../utils/technicalIndicators";

const MACDChart = ({ data }: { data: GraphDataPoint[] }) => {
  const macdData = data.map((dp) => ({ name: dp.name, ...dp.macd }));
  const compressedData = compressData(macdData);

  return (
    <ComposedChart
      data={compressedData}
      height={400}
      width={window.innerWidth * (10 / 12) * 0.9}
    >
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <CartesianGrid stroke="#c0c0c0" />
      <Line
        type="monotone"
        dataKey="ma"
        stroke={indicators.macd.color[0]}
        yAxisId={0}
        dot={false}
      />
      <Line
        type="monotone"
        dataKey="signal"
        stroke={indicators.macd.color[1]}
        yAxisId={0}
        dot={false}
      />
      <Bar dataKey="hist" fill={indicators.macd.color[2]} />
    </ComposedChart>
  );
};

export default MACDChart;
