import React, { useState } from "react";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";

import { runSimulation } from "../../simulation";
import { dollarCostAveraging, ema200Strategy } from "../../strategies";
import TotalResult from "./TotalResult";
import TransactionTable from "./TransactionTable";

import { GraphDataPoint, SimulationOutcome } from "../../types";

const Simulation = ({ data }: { data: GraphDataPoint[] }) => {
  const [outcome1, setOutcome1] = useState<SimulationOutcome>();
  const [outcome2, setOutcome2] = useState<SimulationOutcome>();

  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);

  const startSimulation = () => {
    setSimulationRunning(true);

    const dcaOutcome = runSimulation(data, dollarCostAveraging);
    const ema200Outcome = runSimulation(data, ema200Strategy);

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
