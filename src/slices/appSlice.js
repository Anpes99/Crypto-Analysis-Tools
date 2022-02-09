import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cryptoPriceRangeData: [],
  resultStartEndDates: {
    startDate: { date: null, text: "" },
    endDate: { date: null, text: "" },
  },
  prevApiCallUrl: "",
  sma: 50,
  startDate: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCryptoPriceRangeData: (state, action) => {
      state.cryptoPriceRangeData = action.payload;
    },
    setResultStartEndDates: (state, action) => {
      state.resultStartEndDates = action.payload;
    },
    setPrevApiCallUrl: (state, action) => {
      state.prevApiCallUrl = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setSMA: (state, action) => {
      state.sma = action.payload;
    },
  },
});

export const {
  setCryptoPriceRangeData,
  setResultStartEndDates,
  setPrevApiCallUrl,
  setStartDate,
  setSMA,
} = appSlice.actions;

// Selectors - This is how we pull information from the Global store slice
//export const selectItems = (state) => state.basket.items;

export default appSlice.reducer;
