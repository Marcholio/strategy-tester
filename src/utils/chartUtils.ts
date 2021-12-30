import { GraphDataPoint } from "../types";

const RECHARTS_MAX_DATAPOINTS = 1000;

// Compress the data for performance reasons
// Only affects charting, does not affect simulation itself
export const compressChartData = (data: GraphDataPoint[]): GraphDataPoint[] => {
  const compressionRatio = Math.ceil(data.length / RECHARTS_MAX_DATAPOINTS);

  return data.filter((d, idx) => idx % compressionRatio === 0);
};
