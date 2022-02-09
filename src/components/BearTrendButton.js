import React from "react";
import { useDispatch } from "react-redux";
import useCryptoPriceRangeInfo from "../services/CryptoService";
import {
  setCryptoPriceRangeData,
  setResultStartEndDates,
} from "../slices/appSlice";
import { convDateToUTCUnix } from "../utils/utils";

import ToggleButton from "@mui/material/ToggleButton";
import moment from "moment";

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

const getIs24HourInterval = (prices) => {
  let startCount = false;
  let countDone = false;
  let dataPointsBetweenDays = 0;
  for (let index = 0; index < prices.length; index++) {
    const price = prices[index];

    if (index === 0) {
      continue;
    }

    var curPriceTimeObj = new Date(price[0]);
    var prevPriceTimeObj = new Date(prices[index - 1][0]);

    if (curPriceTimeObj.getUTCDate() !== prevPriceTimeObj.getUTCDate()) {
      if (startCount) {
        countDone = true;
        break;
      }
      startCount = true;
    }
    if (startCount === true && countDone === false) {
      dataPointsBetweenDays++;
    }
  }
  return dataPointsBetweenDays < 10;
};

const checkCurrentTrend = (
  priceMidNight,
  prevDayPrice,
  currentBearTrend,
  longestBearTrend
) => {
  console.log(priceMidNight, prevDayPrice, currentBearTrend, longestBearTrend);

  if (priceMidNight[1] >= prevDayPrice?.[1] && prevDayPrice) {
    currentBearTrend = { trend: 0, startDate: priceMidNight[0] };
  } else if (priceMidNight[1] < prevDayPrice?.[1] && prevDayPrice) {
    currentBearTrend.trend++;
    currentBearTrend.endDate = priceMidNight[0];
    if (longestBearTrend.trend < currentBearTrend.trend) {
      console.log(currentBearTrend);
      longestBearTrend = currentBearTrend;
    }
  }

  return {
    curBearTrend: currentBearTrend,
    curLongestBearTrend: longestBearTrend,
  };
};

// component that gets the longest bear trend between startDate and endDate
const BearTrendButton = ({ startDate, endDate, setResult, setData }) => {
  const dispatch = useDispatch();
  const [getCryptoPriceRangeInfo] = useCryptoPriceRangeInfo();

  const handleBearTrendClick = () => {
    const startDateObject = new Date(
      moment(startDate).format("YYYY-MM-DD") + "T00:00:00"
    );
    const endDateObject = new Date(
      moment(endDate).format("YYYY-MM-DD") + "T00:00:00"
    );

    console.log("before  ", endDateObject);

    var longestBearTrend = { trend: 0, startDate: null, endDate: null };
    const startDateUnix = convDateToUTCUnix(startDateObject) - 3600000;
    const endDateUnix = convDateToUTCUnix(endDateObject) + 3600000;
    console.log("after  ", new Date(endDateUnix));

    getCryptoPriceRangeInfo(startDateUnix, endDateUnix)
      .then((response) => {
        console.log(response);
        const prices = response.data.prices;
        dispatch(setCryptoPriceRangeData(response.data));

        let is24HourInterval = getIs24HourInterval(prices);
        console.log("is 24h interval   ", response.data);

        var currentBearTrend = { trend: 0 };

        var currentBearTrendStartDate;
        var prevDayPrice = null;
        var priceMidNight = null;
        var checkTrend = false;
        console.log(prices);

        for (let index = 0; index < prices.length; index++) {
          const price = prices[index];
          var curPriceTimeObj = new Date(price[0]);
          var prevPriceTimeObj =
            index === 0 ? null : new Date(prices[index - 1][0]);
          if (
            prices[index + 1] === undefined &&
            curPriceTimeObj.getUTCHours() > 22
          ) {
            priceMidNight = price;
            checkTrend = true;
          } else {
            if (is24HourInterval === false) {
              if (index === 0) {
                continue;
              }
              if (
                curPriceTimeObj.getUTCDate() !== prevPriceTimeObj.getUTCDate()
              ) {
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
    <ToggleButton value="bearTrend" onClick={handleBearTrendClick}>
      Longest Bear trend
    </ToggleButton>
  );
};

export default BearTrendButton;
