import React, { useState } from "react";
import { Grid } from "@mui/material";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Chart from "./components/Chart";
import mapData from "./utils/mapData";
import { runSimulation } from "./simulation";
import { dollarCostAveraging, ema200Strategy } from "./strategies";

import sp500Price from "./data/SXR8.FRK-price.json";
import sp500Ema200 from "./data/SXR8.FRK-EMA.json";

import { SimulationOutcome } from "./types";

import "./App.css";

const App = () => {
  const [outcome, setOutcome] = useState<SimulationOutcome>();
  const [outcomeB, setOutcomeB] = useState<SimulationOutcome>();
  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={10}>
          <Chart priceData={sp500Price} ema200Data={sp500Ema200} />
        </Grid>
        <Grid item xs={2}>
          <span>To be added</span> {/* TODO: Add TA selectors here */}
        </Grid>
      </Grid>

      <button
        onClick={() => {
          setOutcome(
            runSimulation(mapData(sp500Price, sp500Ema200), dollarCostAveraging)
          );
          setOutcomeB(
            runSimulation(mapData(sp500Price, sp500Ema200), ema200Strategy)
          );
        }}
      >
        RUN SIMULATION
      </button>
      {"OUTCOME DCA"}
      {outcome && (
        <span>
          Cash: {outcome.cash}, shares: {outcome.shares}, total value:{" "}
          {outcome.value}. Profit: {outcome.profit} %
        </span>
      )}
      {"OUTCOME EMA"}
      {outcomeB && (
        <span>
          Cash: {outcomeB.cash}, shares: {outcomeB.shares}, total value:{" "}
          {outcomeB.value}. Profit: {outcomeB.profit} %
        </span>
      )}
      <Footer />
    </>
  );
};

export default App;
