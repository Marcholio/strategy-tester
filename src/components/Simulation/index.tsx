import React, { useState } from "react";
import { Grid, TextField, Typography, Select, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";

import { runSimulation } from "../../simulation";
import strategies from "../../strategies";
import TotalResult from "./TotalResult";
import TransactionTable from "./TransactionTable";
import ResultChart from "../ResultChart";

import {
  GraphDataPoint,
  SimulationOutcome,
  SimulationParams,
} from "../../types/internal";

type StrategyId = keyof typeof strategies;

const defaultParams: SimulationParams = {
  initialCash: 100,
  monthlyCash: 100,
  txCost: 5,
  cooldown: 20,
  posSize: 100,
  minPos: 100,
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
            <Typography variant="body1" sx={{ marginTop: "1rem" }}>
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
            <TextField
              id="posSize"
              label="Position size (%)"
              variant="outlined"
              type="number"
              size="small"
              value={params.posSize}
              onChange={(event) =>
                setParams({
                  ...params,
                  posSize: parseInt(event.target.value, 10) || 0,
                })
              }
              sx={paramFieldStyle}
            />
            <TextField
              id="minPos"
              label="Minimum position (€/$)"
              variant="outlined"
              type="number"
              size="small"
              value={params.minPos}
              onChange={(event) =>
                setParams({
                  ...params,
                  minPos: parseInt(event.target.value, 10) || 0,
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
              size="small"
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
            <Typography variant="body1" sx={{ marginTop: "1rem" }}>
              {strategies[strategyId].description}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      {!simulationRunning && outcome1 && outcome2 && (
        <>
          <ResultChart
            priceData={data}
            outcomeLeft={outcome1}
            outcomeRight={outcome2}
          />
          <Grid container>
            {
              <Grid item xs={6}>
                <TotalResult outcome={outcome1} />
              </Grid>
            }
            {
              <Grid item xs={6}>
                <TotalResult outcome={outcome2} />
              </Grid>
            }
          </Grid>
          <Grid container>
            {
              <Grid item xs={6}>
                <TransactionTable data={outcome1.transactions} />
              </Grid>
            }
            {
              <Grid item xs={6}>
                <TransactionTable data={outcome2.transactions} />
              </Grid>
            }
          </Grid>
        </>
      )}
    </>
  );
};

export default Simulation;
