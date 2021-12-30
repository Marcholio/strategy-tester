const RECHARTS_MAX_DATAPOINTS = 1000;

// Compress the data for performance reasons
// Only affects charting, does not affect simulation itself
export const compressData = <T>(
  data: T[],
  compressionRatio: number = Math.ceil(data.length / RECHARTS_MAX_DATAPOINTS)
): T[] => {
  return data.filter((d, idx) => idx % compressionRatio === 0);
};
