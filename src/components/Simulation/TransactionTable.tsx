import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Transaction } from "../../types/internal";

const TransactionTable = ({ data }: { data: Transaction[] }) => (
  <Box
    sx={{
      width: "80%",
      paddingLeft: "10%",
      marginTop: "1rem",
      textAlign: "center",
    }}
  >
    <Typography variant="h6">Transactions</Typography>
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">Shares</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((tx, idx) => (
            <TableRow key={idx}>
              <TableCell align="center">{tx.date}</TableCell>
              <TableCell align="center">{tx.type.toUpperCase()}</TableCell>
              <TableCell align="center">{tx.amount.toFixed(1)}</TableCell>
              <TableCell align="center">{tx.price.toFixed(2)} €</TableCell>
              <TableCell align="center">{tx.totalValue.toFixed(2)} €</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default TransactionTable;
