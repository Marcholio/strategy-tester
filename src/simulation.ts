import {
  GraphDataPoint,
  SimulationOutcome,
  SimulationParams,
  Strategy,
  Transaction,
} from "./types";

// First date that has all indicators available to avoid head start for simpler strategies
const simulationStartDate = "2011-08-15";

export const runSimulation = (
  data: GraphDataPoint[],
  strategy: Strategy,
  params: SimulationParams
): SimulationOutcome => {
  let cash = params.initialCash;
  let shares = 0;

  if (data.length === 0) {
    return {
      cash,
      shares,
      value: cash,
      profit: 0,
      transactions: [],
    };
  }

  let curMonth = data[0].name.slice(0, 7);
  let invested = cash;
  const transactions: Transaction[] = [];

  let cooldownCounter = 0;

  data.forEach((datapoint) => {
    if (datapoint.name >= simulationStartDate) {
      cooldownCounter -= 1;
      // Add money to account once per month, ie. when month changes
      if (!datapoint.name.startsWith(curMonth)) {
        cash += params.monthlyCash;
        invested += params.monthlyCash;
        curMonth = datapoint.name.slice(0, 7);
      }

      // Buy
      if (strategy.buy(datapoint)) {
        if (cash > params.txCost && cooldownCounter <= 0) {
          cooldownCounter = strategy.cooldown;
          cash -= params.txCost; // TODO: Implement percentage based price

          const sharesBought = cash / datapoint.price;

          const transaction: Transaction = {
            type: "buy",
            amount: sharesBought,
            totalValue: shares * datapoint.price + cash, // TODO: Buy smaller positions
            price: datapoint.price,
            date: datapoint.name,
          };
          shares += transaction.amount;
          cash -= transaction.amount * datapoint.price;

          transactions.push(transaction);
        }
      }

      // Sell
      if (strategy.sell(datapoint)) {
        if (shares * datapoint.price > params.txCost && cooldownCounter <= 0) {
          cooldownCounter = strategy.cooldown;
          cash -= params.txCost;

          const transaction: Transaction = {
            type: "sell",
            amount: shares,
            totalValue: cash + shares * datapoint.price,
            price: datapoint.price,
            date: datapoint.name,
          };

          cash += shares * datapoint.price;
          shares -= transaction.amount; // TODO: Sell smaller positions

          transactions.push(transaction);
        }
      }
    }
  });

  const totalValue = cash + shares * data[data.length - 1].price;

  return {
    cash,
    shares,
    value: totalValue,
    profit: (totalValue / invested - 1) * 100,
    transactions,
  };
};
