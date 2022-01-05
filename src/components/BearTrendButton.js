import React from "react";
import getCryptoPriceRangeInfo from "../services/CryptoService";
import { convDateToUTCUnix } from "../utils/utils";

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
        //console.log(response.data.prices);

        if (
          response.data.prices[2][0] - response.data.prices[1][0] >
          45000000
        ) {
          var is24HourInterval = true;
        }

        var currentBearTrend = 0;
        var prevDayPrice = null;
        var priceMidNight = null;
        var checkTrend = false;

        response.data.prices.forEach((price, index, prices) => {
          var curPriceTimeObj = new Date(price[0]);
          if (prices[index + 1] === undefined) {
            checkTrend = true;
            priceMidNight = price[1];
            //console.log(curPriceTimeObj);
          } else {
            if (is24HourInterval === false) {
              if (
                curPriceTimeObj.getUTCHours() === 23 ||
                curPriceTimeObj.getUTCHours() === 0
              ) {
                if (curPriceTimeObj.getUTCHours() === 23) {
                  const nextTime = new Date(prices[index + 1][0]);

                  if (
                    nextTime.getUTCHours() >= 0 &&
                    nextTime.getUTCHours() !== 23
                  ) {
                    if (
                      60 - curPriceTimeObj.getUTCMinutes() <
                      nextTime.getUTCMinutes()
                    ) {
                      priceMidNight = price[1];
                      checkTrend = true;
                    } else {
                      priceMidNight = prices[index + 1][1];
                      checkTrend = true;
                    }
                  }
                } else {
                  if (index !== 0) {
                    const prevTime = new Date(prices[index - 1][0]);
                    if (
                      prevTime.getUTCHours() !== 23 &&
                      prevTime.getUTCHours() !== 0
                    ) {
                      priceMidNight = price[1];
                      checkTrend = true;
                    }
                  } else if (index === 0) {
                    prevDayPrice = price[1];
                  }
                }
              }
            } else if (is24HourInterval === true) {
              priceMidNight = price[1];
              checkTrend = true;
            }
          }

          if (checkTrend === true) {
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
        });
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
