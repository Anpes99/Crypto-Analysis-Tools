import axios from "axios";

//gets btc price, 24 volume and market cap info for a date range
//time interval between info objects is 1h or 24h depending on date range
const getCryptoPriceRangeInfo = (startDate, endDate) => {
  // startDate & endDate are required to be in unix milliseconds

  return axios.get(
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${
      startDate / 1000
    }&to=${endDate / 1000}`
  );
};

export default getCryptoPriceRangeInfo;
