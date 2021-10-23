import React from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis } from "recharts";

import "./App.css";

const App = () => (
  <div className="main">
    <LineChart
      data={[
        { name: "1", a: 1, b: 2 },
        { name: "2", a: 2, b: 4 },
        { name: "3", a: 3, b: 6 },
        { name: "4", a: 4, b: 8 },
        { name: "5", a: 5, b: 10 },
      ]}
      width={window.innerWidth * 0.9}
      height={window.innerHeight * 0.9}
    >
      {" "}
      <XAxis dataKey="name" />
      <CartesianGrid stroke="#f5f5f5" />
      <Line type="monotone" dataKey="a" stroke="#ff7300" yAxisId={0} />
      <Line type="monotone" dataKey="b" stroke="#387908" yAxisId={1} />
    </LineChart>
  </div>
);

export default App;
