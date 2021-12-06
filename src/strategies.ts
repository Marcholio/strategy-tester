import { GraphDataPoint, Strategy } from "./types";

// TODO: Add more strategies,eg.
// RSI
// MACD

/**
 * The base strategy to compare to.
 * Buy with fixed amount of money every month.
 * Never sell.
 */
export const dollarCostAveraging: Strategy = {
  title: "Dollar cost averaging",
  description: "Buy with same amount every month. Never sell.",
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
  title: "EMA 200 Strategy",
  description:
    "Buy when price is above 200EMA, sell when price is below 200EMA",
  buy: (datapoint: GraphDataPoint) =>
    datapoint.ema200 !== null && datapoint.price > datapoint.ema200,
  sell: (datapoint: GraphDataPoint) =>
    datapoint.ema200 !== null && datapoint.price < datapoint.ema200,
  cooldown: 20,
};

/**
 * Exponential moving average strategy.
 * Buy if price is rising.
 * Sell if price is falling.
 */
export const ema50Strategy: Strategy = {
  title: "EMA 50 Strategy",
  description: "Buy when price is above 50EMA, sell when price is below 50EMA",
  buy: (datapoint: GraphDataPoint) =>
    datapoint.ema50 !== null && datapoint.price > datapoint.ema50,
  sell: (datapoint: GraphDataPoint) =>
    datapoint.ema50 !== null && datapoint.price < datapoint.ema50,
  cooldown: 20,
};
