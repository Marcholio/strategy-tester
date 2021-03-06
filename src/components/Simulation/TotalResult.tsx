import React from "react";
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

import { SimulationOutcome } from "../../types/internal";

const TotalResult = ({ outcome }: { outcome: SimulationOutcome }) => (
  <Box
    sx={{
      width: "50%",
      paddingLeft: "25%",
      textAlign: "center",
      marginBottom: "2rem",
    }}
  >
    <Typography variant="h6">Result</Typography>
    <TableContainer>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell align="center">Cash</TableCell>
            <TableCell align="center">{outcome.cash.toFixed(2)} €</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">Shares</TableCell>
            <TableCell align="center">{outcome.shares.toFixed(1)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">Total</TableCell>
            <TableCell align="center">{outcome.value.toFixed(2)} €</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">Profit</TableCell>
            <TableCell align="center">{outcome.profit.toFixed(1)} %</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default TotalResult;
