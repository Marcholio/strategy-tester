import React from "react";
import { AppBar, Typography, Toolbar } from "@mui/material";
import packageInfo from "../../package.json";

const Header = () => (
  <AppBar position="static" sx={{ marginBottom: "1rem" }}>
    <Toolbar>
      <Typography variant="h5">
        STRATEGY TESTER v{packageInfo.version}
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
