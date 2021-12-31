import {
  GraphDataPoint,
  SimulationOutcome,
  SimulationParams,
  Strategy,
  Transaction,
} from "./types/internal";

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
      chartData: [],
    };
  }

  let curMonth = data[0].name.slice(0, 7);
  let invested = cash;
  const transactions: Transaction[] = [];
  const chartData: SimulationOutcome["chartData"] = [];

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

    const canBuy = (params.posSize / 100) * cash >= params.minPos;

    // Buy
    if (strategy.buy(data[index - 1], datapoint) && canBuy) {
      if (cash > params.txCost && cooldownCounter <= 0) {
        cooldownCounter = params.cooldown;
        cash -= params.txCost;

        const sharesBought = ((params.posSize / 100) * cash) / datapoint.price;

        const transaction: Transaction = {
          type: "buy",
          amount: sharesBought,
          totalValue: shares * datapoint.price + cash,
          price: datapoint.price,
          date: datapoint.name,
        };
        shares += transaction.amount;
        cash -= transaction.amount * datapoint.price;

        transactions.push(transaction);
      }
    }

    const canSell =
      shares * datapoint.price * (params.posSize / 100) >= params.minPos;

    // Sell
    if (strategy.sell(data[index - 1], datapoint) && canSell) {
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
        shares -= transaction.amount;

        transactions.push(transaction);
      }
    }

    chartData.push({
      name: datapoint.name,
      value:
        invested > 0
          ? ((cash + shares * datapoint.price) / invested - 1) * 100
          : 0,
    });
  });

  const totalValue = cash + shares * data[data.length - 1].price;

  return {
    cash,
    shares,
    value: totalValue,
    profit: (totalValue / invested - 1) * 100,
    transactions,
    chartData,
  };
};
