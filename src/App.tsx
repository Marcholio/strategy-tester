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
import RSIChart from "./components/RSIChart";
import indicators from "./utils/technicalIndicators";
import mapData from "./utils/mapData";

import priceData from "./data/IBM-price.json";
import ema200Data from "./data/IBM-EMA-200.json";
import ema50Data from "./data/IBM-EMA-50.json";
import rsi14Data from "./data/IBM-RSI-14.json";
import macdData from "./data/IBM-MACDEXT.json";

import "./App.css";
import MACDChart from "./components/MACDChart";

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

  const data = mapData(priceData, ema200Data, ema50Data, rsi14Data, macdData);

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={10}>
          <Chart
            data={data}
            selectedIndicators={selectedIndicators}
            omitIndicators={[indicators.rsi14.key, indicators.macd.key]}
          />
          {selectedIndicators[indicators.rsi14.key] && <RSIChart data={data} />}
          {selectedIndicators[indicators.macd.key] && <MACDChart data={data} />}
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
      <Divider sx={{ margin: "2rem 0" }} />
      <Simulation data={data} />
      <Footer />
    </>
  );
};

export default App;
