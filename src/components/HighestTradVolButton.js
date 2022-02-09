import { ToggleButton } from "@mui/material";
import moment from "moment";
import React from "react";
import { useDispatch } from "react-redux";
import useCryptoPriceRangeInfo from "../services/CryptoService";
import {
  setCryptoPriceRangeData,
  setResultStartEndDates,
} from "../slices/appSlice";
import { formatUTCTimeString, convDateToUTCUnix } from "../utils/utils";

const getHighestVolume = (total_volumes) => {
  var curHighestVol = 0;
  var curHighestVolDate = null;
  total_volumes.forEach((dateVol) => {
    if (dateVol[1] > curHighestVol) {
      curHighestVol = dateVol[1];
      curHighestVolDate = dateVol[0];
    }
  });
  return { highestVolume: curHighestVol, highestVolumeDate: curHighestVolDate };
};

//component that gets the highest 24h trading volume between startDate and endDate
const HighestTradVolButton = ({ startDate, endDate, setResult, setData }) => {
  const dispatch = useDispatch();
  const [getCryptoPriceRangeInfo] = useCryptoPriceRangeInfo();

  const handleHighTradingVolClick = () => {
    const startDateObject = new Date(
      moment(startDate).format("YYYY-MM-DD") + "T00:00:00"
    );
    const endDateObject = new Date(
      moment(endDate).format("YYYY-MM-DD") + "T00:00:00"
    );
    const startDateUnix = convDateToUTCUnix(startDateObject) - 3600000;
    const endDateUnix = convDateToUTCUnix(endDateObject) + 3600000;
    getCryptoPriceRangeInfo(startDateUnix, endDateUnix).then((response) => {
      const { highestVolume, highestVolumeDate } = getHighestVolume(
        response.data.total_volumes
      );
      dispatch(setCryptoPriceRangeData(response.data));

      const highestVolDate = new Date(highestVolumeDate);
      dispatch(
        setResultStartEndDates({
          startDate: { date: highestVolDate.getTime(), text: "Highest volume" },
        })
      );
      setResult(
        "Highest 24h volume in given date range is " +
          highestVolume +
          "€ at date: " +
          formatUTCTimeString(highestVolDate.getTime())
      );
    });
  };

  return (
    <ToggleButton value="HighestTradingVol" onClick={handleHighTradingVolClick}>
      Highest trading volume
    </ToggleButton>
  );
};

export default HighestTradVolButton;
