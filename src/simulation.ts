import { GraphDataPoint, SimulationOutcome, Strategy } from "./types";

export const runSimulation = (
  data: GraphDataPoint[],
  strategy: Strategy
): SimulationOutcome => {
  console.log(strategy);
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
    };
  }

  let curMonth = data[0].name.slice(0, 7);
  let invested = cash;

  // TODO: Implement cooldown

  data.forEach((datapoint) => {
    // Add money to account once per month
    if (!datapoint.name.startsWith(curMonth)) {
      cash += monthlySaving;
      invested += monthlySaving;
      curMonth = datapoint.name.slice(0, 7);
    }

    if (strategy.buy(datapoint)) {
      if (cash > 0) {
        const sharesBought = cash / datapoint.price;
        shares += sharesBought;
        cash -= datapoint.price * sharesBought;
      }
    }

    if (strategy.sell(datapoint)) {
      if (shares > 0) {
        cash += shares * datapoint.price;
        shares = 0; // TODO: Sell smaller positions
      }
    }
  });

  const totalValue = cash + shares * data[data.length - 1].price;

  return {
    cash,
    shares,
    value: totalValue,
    profit: (totalValue / invested - 1) * 100,
  };
};
