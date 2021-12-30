import React, { useState } from "react";
import { Grid, TextField, Typography, Select, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";

import { runSimulation } from "../../simulation";
import strategies from "../../strategies";
import TotalResult from "./TotalResult";
import TransactionTable from "./TransactionTable";

import {
  GraphDataPoint,
  SimulationOutcome,
  SimulationParams,
} from "../../types";

type StrategyId = keyof typeof strategies;

const defaultParams: SimulationParams = {
  initialCash: 1000,
  monthlyCash: 100,
  txCost: 15,
  cooldown: 20,
};

const paramFieldStyle = {
  margin: "12px 0",
};

const Simulation = ({ data }: { data: GraphDataPoint[] }) => {
  const [outcome1, setOutcome1] = useState<SimulationOutcome>();
  const [outcome2, setOutcome2] = useState<SimulationOutcome>();

  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);

  const [params, setParams] = useState<SimulationParams>(defaultParams);

  const [strategyId, setStrategyId] = useState<StrategyId>("ema200");

  const startSimulation = () => {
    setSimulationRunning(true);

    const dcaOutcome = runSimulation(data, strategies.dca, params);
    const outcome2 = runSimulation(data, strategies[strategyId], params);

    setOutcome1(dcaOutcome);
    setOutcome2(outcome2);

    setSimulationRunning(false);
  };

  return (
    <>
      <Grid container sx={{ margin: "2rem 0" }}>
        <Grid item xs={5}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6">{strategies.dca.title}</Typography>
            <Typography variant="body1">
              {strategies.dca.description}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant={"h6"}>Parameters</Typography>
            <TextField
              id="initialCash"
              label="Initial cash (€/$)"
              variant="outlined"
              type="number"
              size="small"
              value={params.initialCash}
              onChange={(event) =>
                setParams({
                  ...params,
                  initialCash: parseInt(event.target.value, 10) || 0,
                })
              }
              sx={paramFieldStyle}
            />
            <TextField
              id="monthlyCash"
              label="Monthly investment (€/$)"
              variant="outlined"
              type="number"
              size="small"
              value={params.monthlyCash}
              onChange={(event) =>
                setParams({
                  ...params,
                  monthlyCash: parseInt(event.target.value, 10) || 0,
                })
              }
              sx={paramFieldStyle}
            />
            <TextField
              id="txCost"
              label="Transaction fee (€/$)"
              variant="outlined"
              type="number"
              size="small"
              value={params.txCost}
              onChange={(event) =>
                setParams({
                  ...params,
                  txCost: parseInt(event.target.value, 10) || 0,
                })
              }
              sx={paramFieldStyle}
            />
            <TextField
              id="cooldown"
              label="Cooldown (days)"
              variant="outlined"
              type="number"
              size="small"
              value={params.cooldown}
              onChange={(event) =>
                setParams({
                  ...params,
                  cooldown: parseInt(event.target.value, 10) || 0,
                })
              }
              sx={paramFieldStyle}
            />
            <LoadingButton
              variant={"outlined"}
              loading={simulationRunning}
              onClick={startSimulation}
              disabled={simulationRunning}
            >
              RUN SIMULATION
            </LoadingButton>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Box sx={{ textAlign: "center" }}>
            <Select
              value={strategyId}
              onChange={(e) => {
                setStrategyId(e.target.value as StrategyId);
              }}
            >
              {Object.entries(strategies).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value.title}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="body1">
              {strategies[strategyId].description}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      {!simulationRunning && (
        <>
          <Grid container>
            {outcome1 && (
              <Grid item xs={6}>
                <TotalResult outcome={outcome1} />
              </Grid>
            )}
            {outcome2 && (
              <Grid item xs={6}>
                <TotalResult outcome={outcome2} />
              </Grid>
            )}
          </Grid>
          <Grid container>
            {outcome1 && (
              <Grid item xs={6}>
                <TransactionTable data={outcome1.transactions} />
              </Grid>
            )}
            {outcome2 && (
              <Grid item xs={6}>
                <TransactionTable data={outcome2.transactions} />
              </Grid>
            )}
          </Grid>
        </>
      )}
    </>
  );
};

export default Simulation;
