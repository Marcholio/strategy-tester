import React, { useState } from "react";
import {
  Grid,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  Divider,
} from "@mui/material";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Chart from "./components/Chart";
import Simulation from "./components/Simulation";
import indicators from "./utils/technicalIndicators";
import mapData from "./utils/mapData";

import sp500Price from "./data/SXR8.FRK-price.json";
import sp500Ema200 from "./data/SXR8.FRK-EMA.json";

import "./App.css";

const App = () => {
  const [selectedIndicators, setSelectedIndicators] = useState(
    Object.keys(indicators).reduce((acc, cur) => {
      acc[cur] = true;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  const toggleIndicator = (indicator: string) => {
    setSelectedIndicators({
      ...selectedIndicators,
      [indicator]: !selectedIndicators[indicator],
    });
  };

  const data = mapData(sp500Price, sp500Ema200);

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={10}>
          <Chart data={data} selectedIndicators={selectedIndicators} />
        </Grid>
        <Grid item xs={2}>
          <Typography variant={"h6"}>Technical indicators</Typography>
          <FormGroup>
            {Object.values(indicators).map((indicator) => (
              <FormControlLabel
                control={
                  <Checkbox
                    value={indicator.key}
                    checked={selectedIndicators[indicator.key]}
                    onChange={() => toggleIndicator(indicator.key)}
                  />
                }
                label={indicator.description}
                key={indicator.key}
              />
            ))}
          </FormGroup>
        </Grid>
      </Grid>
      <Divider />
      <Simulation data={data} />
      <Footer />
    </>
  );
};

export default App;
