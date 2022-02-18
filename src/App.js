import React, { useEffect, useState } from "react";
import BearTrendButton from "./components/BearTrendButton";
import DataChart from "./components/DataChart";
import DateRangeInput from "./components/DateRangeInput";
import HighestTradVolButton from "./components/HighestTradVolButton";
import TimeMachineMaxProfitButton from "./components/TimeMachineMaxProfitButton";
import { Provider, useSelector } from "react-redux";
import { store } from "./app/store";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import "./App.css";

function App() {
  const [result, setResult] = useState("");
  const cryptoPriceRangeData = store.getState().app.cryptoPriceRangeData;
  const [alignment, setAlignment] = useState("TimeMachineProfit");
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <>
      <div className="header">
        <h1>Crypto Data-Analysis Tools</h1>
      </div>

      <div className="App">
        <Provider store={store}>
          <div className="controls">
            {" "}
            <DateRangeInput />
            <div className="buttons-container">
              <BearTrendButton setResult={setResult} />
              <HighestTradVolButton setResult={setResult} />
              <TimeMachineMaxProfitButton setResult={setResult} />
              {/*  <p className="result">{result}</p> */}
            </div>
          </div>

          <DataChart />
        </Provider>
      </div>
      <div className="shape"></div>
    </>
  );
}

export default App;
