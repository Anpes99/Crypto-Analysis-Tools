import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useSelector } from "react-redux";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

function DataChart({}) {
  const startDate = useSelector((state) => state.app.startDate);
  const resultStartEndDates = useSelector(
    (state) => state.app.resultStartEndDates
  );
  const cryptoData = useSelector((state) => state.app.cryptoPriceRangeData);
  const labels = cryptoData?.prices?.map(
    (price) =>
      "" +
      new Date(price[0]).getMonth() +
      "/" +
      new Date(price[0]).getDate() +
      "/" +
      new Date(price[0]).getFullYear()
  );

  const data = {
    labels,
    datasets: [
      {
        type: "line",
        label: "price €",
        borderColor: "blue",
        backgroundColor: "blue",

        borderWidth: 2,
        fill: true,
        data: cryptoData?.prices?.map((price) => price[1]),
        pointRadius: 0,
      },
      {
        type: "line",
        label: "sma (50)",
        borderColor: "black",
        backgroundColor: "black",

        borderWidth: 2,
        fill: true,
        data: cryptoData?.prices?.map((price, i) => {
          if (cryptoData?.prices?.[i - 50] && cryptoData.prices?.[i + 50]) {
            const subArray = cryptoData?.prices
              .slice(i - 50, i + 50)
              .map((price) => price[1]);
            const average = subArray.reduce((prev, curr) => prev + curr) / 100;
            return average || null;
          }
          return null;
        }),
        pointRadius: 0,
      },
      {
        type: "line",
        label: resultStartEndDates.startDate.text,
        borderColor: "red",
        backgroundColor: "red",

        borderWidth: 1,
        fill: true,
        data: cryptoData?.prices?.map((price, i) => {
          if (resultStartEndDates.startDate.date === price[0]) {
            console.log("fads");
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
        fill: true,
        data: cryptoData?.prices?.map((price, i) => {
          if (resultStartEndDates?.endDate?.date === price[0]) {
            return price[1];
          }
        }),
        pointRadius: 10,
        fill: true,
      },
    ],
    options: {
      responsive: true,
    },
  };

  return <Chart type="bar" data={data} />;
}

export default DataChart;
