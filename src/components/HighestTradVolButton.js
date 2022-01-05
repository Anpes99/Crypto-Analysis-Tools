import React from "react";
import getCryptoPriceRangeInfo from "../services/CryptoService";
import { formatUTCTimeString, convDateToUTCUnix } from "../utils/utils";

//component that gets the highest 24h trading volume between startDate and endDate
const HighestTradVolButton = ({ startDate, endDate, setResult }) => {
  const handleHighTradingVolClick = () => {
    const startDateObject = new Date(startDate + "T00:00:00");
    const endDateObject = new Date(endDate + "T00:00:00");
    const startDateUnix = convDateToUTCUnix(startDateObject) - 3600000;
    const endDateUnix = convDateToUTCUnix(endDateObject) + 3600000;
    getCryptoPriceRangeInfo(startDateUnix, endDateUnix).then((response) => {
      var curHighestVol = 0;
      var curHighestVolDate = null;
      response.data.total_volumes.forEach((dateVol) => {
        if (dateVol[1] > curHighestVol) {
          curHighestVol = dateVol[1];
          curHighestVolDate = dateVol[0];
        }
      });

      const highestVolDate = new Date(curHighestVolDate);
      setResult(
        "Highest 24h volume in given date range is " +
          curHighestVol +
          "€ at date: " +
          formatUTCTimeString(highestVolDate.getTime())
      );
    });
  };

  return (
    <button onClick={handleHighTradingVolClick}>Highest trading volume</button>
  );
};

export default HighestTradVolButton;
