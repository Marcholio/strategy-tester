import {
  GraphDataPoint,
  SimulationOutcome,
  SimulationParams,
  Strategy,
  Transaction,
} from "./types";

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

  data.forEach((datapoint, index) => {
    if (index === 0) {
      return;
    }

    cooldownCounter -= 1;
    if (!datapoint.name.startsWith(curMonth)) {
      // Add money to account once per month, ie. when month changes
      cash += params.monthlyCash;
      invested += params.monthlyCash;
      curMonth = datapoint.name.slice(0, 7);
    }

    // Buy
    if (strategy.buy(data[index - 1], datapoint)) {
      if (cash > params.txCost && cooldownCounter <= 0) {
        cooldownCounter = params.cooldown;
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
    if (strategy.sell(data[index - 1], datapoint)) {
      if (shares * datapoint.price > params.txCost && cooldownCounter <= 0) {
        cooldownCounter = params.cooldown;
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
