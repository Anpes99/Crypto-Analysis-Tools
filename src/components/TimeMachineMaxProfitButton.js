import React from "react";
import getCryptoPriceRangeInfo from "../services/CryptoService";
import { convDateToUTCUnix, formatUTCTimeString } from "../utils/utils";

//component that gets the highest profit margin for buying and selling between startDate and endDate
const TimeMachineMaxProfitButton = ({ startDate, endDate, setResult }) => {
  const handleTimeMachineMaxProfitClick = () => {
    const startDateObject = new Date(startDate + "T00:00:00");
    const endDateObject = new Date(endDate + "T00:00:00");
    const startDateUnix = convDateToUTCUnix(startDateObject) - 3600000;
    const endDateUnix = convDateToUTCUnix(endDateObject) + 3600000;
    getCryptoPriceRangeInfo(startDateUnix, endDateUnix).then((response) => {
      var moreThanPrev;

      response.data.prices.forEach((price, index, prices) => {
        if (price[1] > prices[index - 1]) {
          moreThanPrev = true;
        }
      });

      if (moreThanPrev === false) {
        setResult(
          "it is not possible to buy & sell for profit in given date range"
        );
        return;
      }

      var lowestPrice = 9999999999999999999999999;
      var lowestPriceDate;
      var highestPrice = 0;
      var highestPriceDate;

      response.data.prices.forEach((price, index, prices) => {
        if (price[1] < lowestPrice) {
          lowestPrice = price[1];
          lowestPriceDate = price[0];
        }

        if (price[1] > highestPrice) {
          highestPrice = price[1];
          highestPriceDate = price[0];
        }
      });

      const highestPriceDateObj = new Date(highestPriceDate);
      const lowestPriceDateObj = new Date(lowestPriceDate);

      if (highestPriceDate > lowestPriceDate) {
        console.log(lowestPriceDateObj);
        setResult(
          "best time to buy: " +
            formatUTCTimeString(lowestPriceDateObj.getTime()) +
            " best time to sell: " +
            formatUTCTimeString(highestPriceDateObj.getTime())
        );
      } else {
        var lowestBeforeHighest = 99999999999999999999;
        var lowestBeforeHighestDate;
        var highestAfterLowest = 0;
        var highestAfterLowestDate;

        response.data.prices.forEach((price) => {
          if (price[0] >= highestPriceDate) {
            return;
          }
          if (lowestBeforeHighest > price[1]) {
            lowestBeforeHighest = price[1];
            lowestBeforeHighestDate = price[0];
          }
        });

        const profit1 = highestPrice - lowestBeforeHighest;

        const pricesReversed = response.data.prices.reverse();

        pricesReversed.forEach((price) => {
          if (price[0] <= lowestPriceDate) {
            return;
          }
          if (highestAfterLowest > price[1]) {
            highestAfterLowest = price[1];
            highestAfterLowestDate = price[0];
          }
        });

        const profit2 = highestAfterLowest - lowestPrice;
        const lowestBeforeHighestDateObj = new Date(lowestBeforeHighestDate);
        const highestAfterLowestDateObj = new Date(highestAfterLowestDate);

        if (profit1 > profit2) {
          console.log(highestPriceDateObj);
          setResult(
            "best time to buy: " +
              formatUTCTimeString(lowestBeforeHighestDateObj.getTime()) +
              " best time to sell: " +
              formatUTCTimeString(highestPriceDateObj.getTime())
          );
        } else if (profit2 > profit1) {
          setResult(
            "best time to buy: " +
              formatUTCTimeString(lowestPriceDateObj.getTime()) +
              " best time to sell: " +
              formatUTCTimeString(highestAfterLowestDateObj.getTime())
          );
        } else {
          setResult("no result found for best time to sell and buy");
        }
      }
    });
  };

  return (
    <button onClick={handleTimeMachineMaxProfitClick}>
      Time machine max profit
    </button>
  );
};

export default TimeMachineMaxProfitButton;
