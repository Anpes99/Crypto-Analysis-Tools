import React, { useState } from "react";
import BearTrendButton from "./components/BearTrendButton";
import DateRangeInput from "./components/DateRangeInput";
import HighestTradVolButton from "./components/HighestTradVolButton";
import TimeMachineMaxProfitButton from "./components/TimeMachineMaxProfitButton";

function App() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [result, setResult] = useState("");

  return (
    <div className="App">
      <DateRangeInput setStartDate={setStartDate} setEndDate={setEndDate} />
      choose what to analyze:
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
      <div>{result}</div>
    </div>
  );
}

export default App;
