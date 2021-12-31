import { Box, Select, Typography, MenuItem, Button, Grid } from "@mui/material";
import { useState } from "react";
import { GraphDataPoint, Strategy } from "../../types/internal";

type Props = {
  strategy: Strategy;
  onSave: (newStrategy: Strategy) => void;
};

type BuyOrSellFunc = Strategy["buy"] | Strategy["sell"];

type DatapointKey = keyof GraphDataPoint;

type FunctionUpdate = {
  main: "never" | "always" | "when";
  keyLeft?: DatapointKey;
  operator?: string;
  keyRight?: DatapointKey;
};

const never = "() => false";
const always = "() => true";

const keys: { key: DatapointKey; label: string }[] = [
  { key: "price", label: "Price" },
  { key: "rsi14", label: "RSI14" },
  { key: "ema200", label: "EMA200" },
  { key: "ema50", label: "EMA50" },
];

const logicalOperators: { key: string; label: string }[] = [
  { key: ">", label: "is above" },
  { key: "<", label: "is below" },
  { key: "===", label: "equals" },
];

const updateToFunction = (update: FunctionUpdate): BuyOrSellFunc => {
  if (update.main === "never") {
    return () => false;
  }

  if (update.main === "always") {
    return () => true;
  }

  return new Function(
    "prev",
    "cur",
    `return cur['${update.keyLeft}'] ${update.operator} cur['${update.keyRight}']`
  ) as BuyOrSellFunc;
};

const functionToUpdate = (func: BuyOrSellFunc): FunctionUpdate => {
  const funcAsString = func.toString();

  if (funcAsString === never || funcAsString.includes("return!1")) {
    return { main: "never" };
  }

  if (funcAsString === always || funcAsString.includes("return!0")) {
    return { main: "always" };
  }

  // Third line is the actual function code
  // Split that and remove "return" to get to the operations
  const parsedFunc = funcAsString.split("\n")[2].split(" ").slice(1);

  if (parsedFunc.length !== 3) {
    throw new Error(`Invalid function definition ${parsedFunc}`);
  }

  const matchedLeftGroups = parsedFunc[0].match(/\[(.*)\]/);
  if (!matchedLeftGroups || matchedLeftGroups.length !== 2) {
    throw new Error(`Invalid function definition ${parsedFunc[0]}`);
  }
  const keyLeft = matchedLeftGroups[1].replaceAll("'", "") as DatapointKey;

  const matchedRightGroups = parsedFunc[2].match(/\[(.*)\]/);
  if (!matchedRightGroups || matchedRightGroups.length !== 2) {
    throw new Error(`Invalid function definition ${parsedFunc[2]}`);
  }
  const keyRight = matchedRightGroups[1].replaceAll("'", "") as DatapointKey;

  const operator = parsedFunc[1];

  return { main: "when", keyLeft, operator, keyRight };
};

const functionToFields = ({
  func,
  update,
}: {
  func: BuyOrSellFunc;
  update: (newFunc: BuyOrSellFunc) => void;
}) => {
  const funcAsUpdate = functionToUpdate(func);

  return (
    <>
      <Select
        size="small"
        value={funcAsUpdate.main}
        onChange={(e) =>
          update(
            updateToFunction({
              ...funcAsUpdate,
              main: e.target.value as FunctionUpdate["main"],
              keyLeft: e.target.value === "when" ? keys[0].key : undefined,
              operator:
                e.target.value === "when" ? logicalOperators[0].key : undefined,
              keyRight: e.target.value === "when" ? keys[0].key : undefined,
            })
          )
        }
      >
        <MenuItem value="never">Never</MenuItem>
        <MenuItem value="always">Always</MenuItem>
        <MenuItem value="when">When</MenuItem>
      </Select>
      {funcAsUpdate.main === "when" && (
        <>
          <Select
            size="small"
            value={funcAsUpdate.keyLeft ?? keys[0].key}
            onChange={(e) =>
              update(
                updateToFunction({
                  ...funcAsUpdate,
                  keyLeft: e.target.value as DatapointKey,
                })
              )
            }
          >
            {keys.map((k) => (
              <MenuItem key={k.key} value={k.key}>
                {k.label}
              </MenuItem>
            ))}
          </Select>
          <Select
            size="small"
            value={funcAsUpdate.operator ?? logicalOperators[0].key}
            onChange={(e) =>
              update(
                updateToFunction({
                  ...funcAsUpdate,
                  operator: e.target.value,
                })
              )
            }
          >
            {logicalOperators.map((o) => (
              <MenuItem key={o.key} value={o.key}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
          <Select
            size="small"
            value={funcAsUpdate.keyRight ?? keys[0].key}
            onChange={(e) =>
              update(
                updateToFunction({
                  ...funcAsUpdate,
                  keyRight: e.target.value as DatapointKey,
                })
              )
            }
          >
            {keys.map((k) => (
              <MenuItem key={k.key} value={k.key}>
                {k.label}
              </MenuItem>
            ))}
          </Select>
        </>
      )}
    </>
  );
};

const renderLogic = ({
  title,
  func,
  update,
}: {
  title: string;
  func: BuyOrSellFunc;
  update: (newFunc: BuyOrSellFunc) => void;
}) => (
  <Box>
    <Typography
      variant="body1"
      sx={{
        marginTop: "1rem",
        fontWeight: "bold",
        textTransform: "capitalize",
      }}
    >
      {title}
    </Typography>
    {functionToFields({ func, update })}
  </Box>
);

const CustomStrategyCreator = (props: Props) => {
  const [strategy, setStrategy] = useState<Strategy>(props.strategy);

  return (
    <Grid container columns={1} justifyContent="center">
      <Grid item>
        {renderLogic({
          title: "Buy",
          func: strategy.buy,
          update: (newFunc) => setStrategy({ ...strategy, buy: newFunc }),
        })}
        {renderLogic({
          title: "Sell",
          func: strategy.sell,
          update: (newFunc) => setStrategy({ ...strategy, sell: newFunc }),
        })}
        <Button
          variant="outlined"
          onClick={() => {
            props.onSave(strategy);
          }}
          sx={{ marginTop: "1rem" }}
        >
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default CustomStrategyCreator;
