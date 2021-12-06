import React, { useState } from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";

import { runSimulation } from "../../simulation";
import { dollarCostAveraging, ema200Strategy } from "../../strategies";
import TotalResult from "./TotalResult";
import TransactionTable from "./TransactionTable";

import {
  GraphDataPoint,
  SimulationOutcome,
  SimulationParams,
} from "../../types";

const defaultParams: SimulationParams = {
  initialCash: 1000,
  monthlyCash: 100,
  txCost: 15,
};

const paramFieldStyle = {
  margin: "12px 0",
};

const Simulation = ({ data }: { data: GraphDataPoint[] }) => {
  const [outcome1, setOutcome1] = useState<SimulationOutcome>();
  const [outcome2, setOutcome2] = useState<SimulationOutcome>();

  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);

  const [params, setParams] = useState<SimulationParams>(defaultParams);

  const startSimulation = () => {
    setSimulationRunning(true);

    const dcaOutcome = runSimulation(data, dollarCostAveraging, params);
    const ema200Outcome = runSimulation(data, ema200Strategy, params);

    setOutcome1(dcaOutcome);
    setOutcome2(ema200Outcome);

    setSimulationRunning(false);
  };

  // TODO: Implement strategy selectors
  // TODO: Add better descriptions for strategies
  return (
    <>
      <Grid container sx={{ margin: "2rem 0" }}>
        <Grid item xs={5}>
          <Box sx={{ textAlign: "center" }}>
            <span>Dollar cost averaging</span>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Typography variant={"h6"}>Parameters</Typography>
            <TextField
              id="initialCash"
              label="Initial cash"
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
              label="Monthly investment"
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
              label="Transaction fee"
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
            <span>EMA 200 strategy</span>
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
