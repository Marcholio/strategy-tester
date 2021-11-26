import React from "react";
import { AppBar, Typography, Toolbar } from "@mui/material";

const Header = () => (
  <AppBar position="static" sx={{ marginBottom: "1rem" }}>
    <Toolbar>
      <Typography variant="h5">STRATEGY TESTER</Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
