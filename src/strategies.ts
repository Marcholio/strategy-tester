import { Strategy } from "./types";

// TODO: Add more strategies,eg.
// MACD

// TODO: Add support for custom strategies

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
  buy: (prev, cur) => cur.price > cur.ema200,
  sell: (prev, cur) => cur.price < cur.ema200,
};

/**
 * Exponential moving average strategy.
 * Buy if price is rising.
 * Sell if price is falling.
 */
export const ema50Strategy: Strategy = {
  title: "EMA 50 Strategy",
  description: "Buy when price is above 50EMA, sell when price is below 50EMA",
  buy: (prev, cur) => cur.price > cur.ema50,
  sell: (prev, cur) => cur.price < cur.ema50,
};

/**
 * Relative strength index strategy.
 * Buy, if price is oversold
 * Sell, if price is overbought
 */
export const rsi14Strategy: Strategy = {
  title: "RSI 14 Strategy",
  description: "Buy when RSI breaks above 30, sell when RSI is breaks below 70",
  buy: (prev, cur) => prev.rsi14 < 30 && cur.rsi14 >= 30,
  sell: (prev, cur) => false, // prev.rsi14 > 70 && cur.rsi14 <= 70,
};

/**
 * Random strategy, ie. "blind monkey"
 */
export const randomStrategy: Strategy = {
  title: "Random strategy",
  description: "Buy or sell with 5% probability",
  buy: (prev, cur) => Math.random() < 0.05,
  sell: (prev, cur) => Math.random() < 0.05,
};

const strategies = {
  dca: dollarCostAveraging,
  ema200: ema200Strategy,
  ema50: ema50Strategy,
  rsi14: rsi14Strategy,
  random: randomStrategy,
};

export default strategies;
