import React from "react";
import { Box } from "@mui/system";

const Footer = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-around",
      marginTop: "1rem",
      padding: "1rem",
      bgcolor: "#ddd",
    }}
  >
    <span>Copyright © 2022 Markus Tyrkkö</span>
    <span>
      <a
        href="https://github.com/Marcholio/strategy-tester"
        target="_blank"
        rel="noreferrer"
      >
        Source code
      </a>
    </span>
    <span>
      icons from:{" "}
      <a href="https://icons8.com" target="_blank" rel="noreferrer">
        icons8.com
      </a>
    </span>
  </Box>
);

export default Footer;
