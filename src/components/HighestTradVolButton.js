import { ToggleButton } from "@mui/material";
import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useCryptoPriceRangeInfo from "../hooks/useGetCryptoData";
import {
  setCryptoPriceRangeData,
  setCurrentAnalysis,
  setResultStartEndDates,
} from "../slices/appSlice";
import { formatUTCTimeString, convDateToUTCUnix } from "../utils/utils";

const getHighestVolume = (total_volumes) => {
  var curHighestVol = 0;
  var curHighestVolDate = null;
  total_volumes?.forEach((dateVol) => {
    if (dateVol[1] > curHighestVol) {
      curHighestVol = dateVol[1];
      curHighestVolDate = dateVol[0];
    }
  });
  return { highestVolume: curHighestVol, highestVolumeDate: curHighestVolDate };
};

//component that gets the highest 24h trading volume between startDate and endDate
const HighestTradVolButton = ({ setResult, setData }) => {
  const currentAnalysis = useSelector((state) => state.app.currentAnalysis);
  const startDate1 = useSelector((state) => state.app.startDate);
  const endDate1 = useSelector((state) => state.app.endDate);
  const startDate = JSON.parse(startDate1);
  const endDate = JSON.parse(endDate1);

  const dispatch = useDispatch();
  const [getCryptoPriceRangeInfo] = useCryptoPriceRangeInfo();

  const handleHighTradingVolClick = () => {
    dispatch(setCurrentAnalysis(2));

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
    <ToggleButton
      selected={currentAnalysis === 2 ? true : false}
      value="HighestTradingVol"
      onClick={handleHighTradingVolClick}
    >
      Highest trading volume
    </ToggleButton>
  );
};

export default HighestTradVolButton;
