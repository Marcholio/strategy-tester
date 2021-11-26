import {
  GraphDataPoint,
  SimulationOutcome,
  Strategy,
  Transaction,
} from "./types";

export const runSimulation = (
  data: GraphDataPoint[],
  strategy: Strategy
): SimulationOutcome => {
  const monthlySaving = 100;
  // TODO: Transaction costs

  let cash = 1000;
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

  // TODO: Implement cooldown

  data.forEach((datapoint) => {
    // Add money to account once per month, ie. when month changes
    if (!datapoint.name.startsWith(curMonth)) {
      cash += monthlySaving;
      invested += monthlySaving;
      curMonth = datapoint.name.slice(0, 7);
    }

    // Buy
    if (strategy.buy(datapoint)) {
      if (cash > 0) {
        const sharesBought = cash / datapoint.price;

        const transaction: Transaction = {
          type: "buy",
          amount: cash / datapoint.price,
          cash: datapoint.price * sharesBought,
          date: datapoint.name,
        };
        shares += transaction.amount;
        cash -= transaction.cash;

        transactions.push(transaction);
      }
    }

    // Sell
    if (strategy.sell(datapoint)) {
      if (shares > 0) {
        const transaction: Transaction = {
          type: "sell",
          amount: shares,
          cash: shares * datapoint.price,
          date: datapoint.name,
        };

        cash += transaction.cash;
        shares = 0; // TODO: Sell smaller positions

        transactions.push(transaction);
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
