import React from "react";
import getCryptoPriceRangeInfo from "../services/CryptoService";
import { convDateToUTCUnix, formatUTCTimeString } from "../utils/utils";

const priceOnlyDeclines = (prices) => {
  let moreThanPrev = false;

  prices.forEach((price, index, prices) => {
    if (index === 0) {
      return;
    }
    if (price[1] > prices[index - 1][1]) {
      moreThanPrev = true;
    }
  });
  return !moreThanPrev;
};

const getLowestPrice = (prices) => {
  let lowestPrice = 999999999999999999;
  let lowestPriceDate;
  prices.forEach((price, index, prices) => {
    if (price[1] < lowestPrice) {
      lowestPrice = price[1];
      lowestPriceDate = price[0];
    }
  });

  return { lowestPrice, lowestPriceDate };
};
const getHighestPrice = (prices) => {
  let highestPrice = 0;
  let highestPriceDate;
  prices.forEach((price, index, prices) => {
    if (price[1] > highestPrice) {
      highestPrice = price[1];
      highestPriceDate = price[0];
    }
  });

  return { highestPrice, highestPriceDate };
};

const getLowestBeforeHighest = (prices, highestPriceDate) => {
  let lowestBeforeHighest = 99999999999999999999;
  let lowestBeforeHighestDate;
  prices.forEach((price) => {
    if (price[0] >= highestPriceDate) {
      return;
    }
    if (lowestBeforeHighest > price[1]) {
      lowestBeforeHighest = price[1];
      lowestBeforeHighestDate = price[0];
    }
  });
  return { lowestBeforeHighest, lowestBeforeHighestDate };
};

const getHighestAfterLowest = (prices, lowestPriceDate) => {
  let highestAfterLowest = 0;
  let highestAfterLowestDate;
  const pricesReversed = prices.reverse();
  pricesReversed.forEach((price) => {
    if (price[0] <= lowestPriceDate) {
      return;
    }
    if (highestAfterLowest < price[1]) {
      highestAfterLowest = price[1];
      highestAfterLowestDate = price[0];
    }
  });
  return { highestAfterLowest, highestAfterLowestDate };
};

//component that gets the highest profit margin for buying and selling between startDate and endDate
const TimeMachineMaxProfitButton = ({ startDate, endDate, setResult }) => {
  const handleTimeMachineMaxProfitClick = () => {
    const startDateObject = new Date(startDate + "T00:00:00");
    const endDateObject = new Date(endDate + "T00:00:00");
    const startDateUnix = convDateToUTCUnix(startDateObject) - 3600000;
    const endDateUnix = convDateToUTCUnix(endDateObject) + 3600000;
    getCryptoPriceRangeInfo(startDateUnix, endDateUnix).then((response) => {
      const prices = response.data.prices;
      if (priceOnlyDeclines(prices) === true) {
        setResult(
          "it is not possible to buy & sell for profit in given date range"
        );
        return;
      }

      const { lowestPrice, lowestPriceDate } = getLowestPrice(prices);
      const { highestPrice, highestPriceDate } = getHighestPrice(prices);

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
        const { lowestBeforeHighest, lowestBeforeHighestDate } =
          getLowestBeforeHighest(prices, highestPriceDate);
        const { highestAfterLowest, highestAfterLowestDate } =
          getHighestAfterLowest(prices, lowestPriceDate);
        const profit1 = highestPrice - lowestBeforeHighest;
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
