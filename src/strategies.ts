import { GraphDataPoint, Strategy } from "./types";

// TODO: Add more strategies,eg.
// RSI
// EMA 50

/**
 * The base strategy to compare to.
 * Buy with fixed amount of money every month.
 * Never sell.
 */
export const dollarCostAveraging: Strategy = {
  buy: () => true,
  sell: () => false,
  cooldown: 0,
};

/**
 * Exponential moving average strategy.
 * Buy if price is rising.
 * Sell if price is falling.
 */
export const ema200Strategy: Strategy = {
  buy: (datapoint: GraphDataPoint) =>
    datapoint.ema200 !== null && datapoint.price > datapoint.ema200,
  sell: (datapoint: GraphDataPoint) =>
    datapoint.ema200 !== null && datapoint.price < datapoint.ema200,
  cooldown: 20,
};
