import axios from "axios";
import { Chart as ChartJS, registerables } from "chart.js";
import { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { convertPriceIntervalToDay, mergeArrays } from "../utils/utils";

ChartJS.register(...registerables);

function DataChart({}) {
  const startDate = useSelector(
    (state) => new Date(JSON.parse(state.app.startDate))
  );
  const endDate = useSelector(
    (state) => new Date(JSON.parse(state.app.endDate))
  );
  const resultStartEndDates = useSelector(
    (state) => state.app.resultStartEndDates
  );
  const cryptoData = useSelector((state) => state.app.cryptoPriceRangeData);
  const prevApiCallUrl = useSelector((state) => state.app.prevApiCallUrl);
  const is24HourInterval = useSelector((state) => state.app.is24HourInterval);
  const [smaDataPrices, setSmaDataPrices] = useState(null);

  const [arrayJoinIndex, setArrayJoinIndex] = useState(null);
  const [lastArrayJoinIndex, setLastArrayJoinIndex] = useState(null);

  const labels = cryptoData?.prices?.map(
    (price) =>
      "" +
      (new Date(price[0]).getMonth() + 1) +
      "/" +
      (new Date(price[0]).getDate() + 1) +
      "/" +
      new Date(price[0]).getFullYear()
  );
  useEffect(async () => {
    try {
      const smaStarturl = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${
        startDate.getTime() / 1000 - 1728000
      }&to=${startDate.getTime() / 1000}`;
      const smaEndurl = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${
        endDate.getTime() / 1000
      }&to=${endDate.getTime() / 1000 + 1728000}`;

      const resStart = await axios.get(smaStarturl);

      const resEnd = await axios.get(smaEndurl);

      let newPrices = [cryptoData?.prices?.slice()];
      let startPrices = resStart.data.prices;
      let endPrices = resEnd.data.prices;

      if (is24HourInterval) {
        startPrices = convertPriceIntervalToDay(startPrices);
        endPrices = convertPriceIntervalToDay(endPrices);
      }

      setArrayJoinIndex(startPrices.length - 1);

      setLastArrayJoinIndex(startPrices.length + newPrices.length - 2);

      newPrices = mergeArrays({
        startArray: startPrices,
        middleArray: newPrices,
        endArray: endPrices,
      });

      //  setSmaData(newPrices);

      setSmaDataPrices(newPrices.map((price) => price[1]));
    } catch (e) {
      console.log(e);
    }
  }, [prevApiCallUrl]);

  const data = {
    labels,
    datasets: [
      {
        type: "line",
        label: "price €",
        borderColor: "blue",
        backgroundColor: "blue",

        borderWidth: 2,
        data: cryptoData?.prices?.map((price) => price[1]),
        pointRadius: 0,
      },

      {
        type: "line",
        label: "sma (20)",
        borderColor: "black",
        backgroundColor: "black",

        borderWidth: 2,
        data: cryptoData?.prices?.map((price1, i) => {
          try {
            const enoughDataExistsForSma =
              smaDataPrices[arrayJoinIndex + i - lastArrayJoinIndex] &&
              smaDataPrices[arrayJoinIndex + i + lastArrayJoinIndex] &&
              smaDataPrices;
            if (enoughDataExistsForSma) {
              const subArray = smaDataPrices?.slice(
                i,
                arrayJoinIndex + i + lastArrayJoinIndex
              );
              const average =
                subArray.reduce((prev, curr) => prev + curr) /
                (lastArrayJoinIndex * 2);
              return average || null;
            } else return null;
          } catch (e) {
            return null;
          }
        }),
        pointRadius: 0,
      },
      {
        type: "line",
        label: resultStartEndDates.startDate.text,
        borderColor: "red",
        backgroundColor: "red",

        borderWidth: 1,
        data: cryptoData?.prices?.map((price, i) => {
          if (resultStartEndDates.startDate.date === price[0]) {
            return price[1];
          }
        }),
        pointRadius: 10,
        fill: true,
      },
      {
        type: "line",
        label: resultStartEndDates?.endDate?.text,
        borderColor: "red",
        backgroundColor: "red",

        borderWidth: 1,
        data: cryptoData?.prices?.map((price, i) => {
          if (resultStartEndDates?.endDate?.date === price[0]) {
            return price[1];
          }
        }),
        pointRadius: 10,
      },
    ],
    options: {
      responsive: true,
    },
  };

  return (
    <div className="datachart">
      <Chart type="bar" data={data} />
    </div>
  );
}

export default DataChart;
