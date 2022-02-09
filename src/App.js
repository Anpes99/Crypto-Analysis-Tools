import React, { useEffect, useState } from "react";
import BearTrendButton from "./components/BearTrendButton";
import DataChart from "./components/DataChart";
import DateRangeInput from "./components/DateRangeInput";
import HighestTradVolButton from "./components/HighestTradVolButton";
import TimeMachineMaxProfitButton from "./components/TimeMachineMaxProfitButton";
import { Provider } from "react-redux";
import { store } from "./app/store";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import "./App.css";

function App() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [result, setResult] = useState("");
  const cryptoPriceRangeData = store.getState().app.cryptoPriceRangeData;
  const [alignment, setAlignment] = useState("TimeMachineProfit");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <div className="App">
      <Provider store={store}>
        <DateRangeInput
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
        >
          <BearTrendButton
            startDate={startDate}
            endDate={endDate}
            setResult={setResult}
          />
          <HighestTradVolButton
            startDate={startDate}
            endDate={endDate}
            setResult={setResult}
          />
          <TimeMachineMaxProfitButton
            startDate={startDate}
            endDate={endDate}
            setResult={setResult}
          />
        </ToggleButtonGroup>
        <DataChart />
      </Provider>
      <p>{result}</p>
    </div>
  );
}

export default App;
