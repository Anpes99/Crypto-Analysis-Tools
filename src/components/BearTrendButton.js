import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useCryptoPriceRangeInfo from "../hooks/useGetCryptoData";
import { setCurrentAnalysis, setResultStartEndDates } from "../slices/appSlice";

import ToggleButton from "@mui/material/ToggleButton";

const getCloserToMidNightPrice = (
  prevPriceTimeObj,
  curPriceTimeObj,
  prices,
  index
) => {
  const curPriceMinutesToMidNight =
    curPriceTimeObj.getUTCHours() * 60 + curPriceTimeObj.getUTCMinutes();
  const prevPriceMinutesToMidNight =
    (23 - prevPriceTimeObj.getUTCHours()) * 60 +
    (60 - prevPriceTimeObj.getUTCMinutes());
  if (curPriceMinutesToMidNight < prevPriceMinutesToMidNight) {
    return prices[index];
  } else {
    return prices[index - 1];
  }
};

const checkCurrentTrend = (
  priceMidNight,
  prevDayPrice,
  currentBearTrend,
  longestBearTrend
) => {
  const bearTrendEnded = priceMidNight[1] >= prevDayPrice?.[1] && prevDayPrice;
  if (bearTrendEnded) {
    currentBearTrend = { trend: 0, startDate: priceMidNight[0] };
  } else if (!bearTrendEnded) {
    currentBearTrend.trend++;
    currentBearTrend.endDate = priceMidNight[0];
    const currentBearTrendIsLongest =
      longestBearTrend.trend < currentBearTrend.trend;
    if (currentBearTrendIsLongest) {
      longestBearTrend = currentBearTrend;
    }
  }

  return {
    curBearTrend: currentBearTrend,
    curLongestBearTrend: longestBearTrend,
  };
};

// component that gets the longest bear trend between startDate and endDate
const BearTrendButton = ({ setResult }) => {
  const is24HourInterval = useSelector((state) => state.app.is24HourInterval);
  const currentAnalysis = useSelector((state) => state.app.currentAnalysis);
  const dispatch = useDispatch();
  const [getCryptoPriceRangeInfo] = useCryptoPriceRangeInfo();

  const handleBearTrendClick = () => {
    var longestBearTrend = { trend: 0, startDate: null, endDate: null };
    dispatch(setCurrentAnalysis(1));
    getCryptoPriceRangeInfo()
      .then((response) => {
        console.log(response);
        const prices = response.data.prices;

        console.log("is 24h interval   ", response.data);

        var currentBearTrend = { trend: 0 };

        var prevDayPrice = null;
        var priceMidNight = null;
        var checkTrend = false;
        console.log(prices);

        for (let index = 0; index < prices?.length; index++) {
          const price = prices[index];

          var curPriceTimeObj = new Date(price[0]);
          var prevPriceTimeObj =
            index === 0 ? null : new Date(prices[index - 1][0]);

          const isLastElement =
            prices[index + 1] === undefined &&
            curPriceTimeObj.getUTCHours() > 22;

          if (isLastElement) {
            priceMidNight = price;
            checkTrend = true;
          } else {
            if (is24HourInterval === false) {
              if (index === 0) {
                continue;
              }

              const elementDateIsDiffThenPrev = prevPriceTimeObj
                ? curPriceTimeObj.getUTCDate() !== prevPriceTimeObj.getUTCDate()
                : false;
              if (elementDateIsDiffThenPrev) {
                priceMidNight = getCloserToMidNightPrice(
                  prevPriceTimeObj,
                  curPriceTimeObj,
                  prices,
                  index
                );
                checkTrend = true;
              }
            } else if (is24HourInterval === true) {
              priceMidNight = price;
              checkTrend = true;
            }
          }
          if (priceMidNight && !currentBearTrend.startDate) {
            currentBearTrend.startDate = priceMidNight[0];
          }
          if (checkTrend === true) {
            const { curLongestBearTrend, curBearTrend } = checkCurrentTrend(
              priceMidNight,
              prevDayPrice,
              currentBearTrend,
              longestBearTrend
            );
            currentBearTrend = curBearTrend;
            longestBearTrend = curLongestBearTrend;

            prevDayPrice = priceMidNight;
            checkTrend = false;
          }
        }
      })
      .then(() => {
        console.log(longestBearTrend);
        dispatch(
          setResultStartEndDates({
            startDate: {
              date: longestBearTrend.startDate,
              text: "Longest bear trend start",
            },
            endDate: {
              date: longestBearTrend.endDate,
              text: "Longest bear trend end",
            },
          })
        );
        setResult(
          "Longest bear trend in given date range is " +
            longestBearTrend.trend +
            " days"
        );
      });
  };

  return (
    <ToggleButton
      sx={{
        color: "#1c1917",
        bgcolor: "white",
        ":hover": {
          backgroundColor: "#84cc16",

          color: "#fff",
        },
      }}
      selected={currentAnalysis === 1 ? true : false}
      value="bearTrend"
      onClick={handleBearTrendClick}
    >
      Longest Bear trend
    </ToggleButton>
  );
};

export default BearTrendButton;
