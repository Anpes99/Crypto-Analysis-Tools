import React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { setStartDate, setEndDate } from "../slices/appSlice";

const DateRangeInput = ({}) => {
  const startDate1 = useSelector((state) => state.app.startDate);
  const endDate1 = useSelector((state) => state.app.endDate);
  const startDate = JSON.parse(startDate1);
  const endDate = JSON.parse(endDate1);

  const dispatch = useDispatch();

  return (
    <div className="daterange-inputs">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          className="u-mb-1"
          label="Start Date"
          value={startDate}
          onChange={(newValue) => {
            dispatch(setStartDate(JSON.stringify(newValue)));
          }}
          renderInput={(params) => <TextField {...params} />}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newValue) => {
            dispatch(setEndDate(JSON.stringify(newValue)));
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </div>
  );
};

export default DateRangeInput;
