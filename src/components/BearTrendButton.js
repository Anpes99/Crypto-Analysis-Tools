import React from "react";
import getCryptoPriceRangeInfo from "../services/CryptoService";
import { convDateToUTCUnix } from "../utils/utils";

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
    return prices[index][1];
  } else {
    return prices[index - 1][1];
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

// component that gets the longest bear trend between startDate and endDate
const BearTrendButton = ({ startDate, endDate, setResult }) => {
  const handleBearTrendClick = () => {
    const startDateObject = new Date(startDate + "T00:00:00");
    const endDateObject = new Date(endDate + "T00:00:00");
    console.log("before  ", endDateObject);

    var longestBearTrend = 0;
    const startDateUnix = convDateToUTCUnix(startDateObject) - 3600000;
    const endDateUnix = convDateToUTCUnix(endDateObject) + 3600000;
    console.log("after  ", new Date(endDateUnix));

    getCryptoPriceRangeInfo(startDateUnix, endDateUnix)
      .then((response) => {
        const prices = response.data.prices;

        let is24HourInterval = getIs24HourInterval(prices);
        console.log("is 24h interval   ", is24HourInterval);

        var currentBearTrend = 0;
        var prevDayPrice = null;
        var priceMidNight = null;
        var checkTrend = false;

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
              priceMidNight = price[1];
              checkTrend = true;
            }
          }

          if (checkTrend === true) {
            if (index !== 0)
              if (priceMidNight >= prevDayPrice && prevDayPrice) {
                currentBearTrend = 0;
              } else if (priceMidNight < prevDayPrice && prevDayPrice) {
                currentBearTrend++;
                if (longestBearTrend < currentBearTrend) {
                  longestBearTrend = currentBearTrend;
                }
              }

            prevDayPrice = priceMidNight;
            checkTrend = false;
          }
        }
      })
      .then(() =>
        setResult(
          "Longest bear trend in given date range is " + longestBearTrend
        )
      );
  };

  return <button onClick={handleBearTrendClick}>Longest Bear trend</button>;
};

export default BearTrendButton;
