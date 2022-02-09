import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setCryptoPriceRangeData, setPrevApiCallUrl } from "../slices/appSlice";

//gets btc price, 24 volume and market cap info for a date range
//time interval between info objects is 1h or 24h depending on date range
const useCryptoPriceRangeInfo = () => {
  const dispatch = useDispatch();
  // startDate & endDate are required to be in unix milliseconds

  const prevApiCallUrl = useSelector((state) => state.app.prevApiCallUrl);
  const cryptoPriceRangeData = useSelector(
    (state) => state.app.cryptoPriceRangeData
  );

  const getCryptoPriceRangeInfo = async (startDate, endDate) => {
    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${
      startDate / 1000
    }&to=${endDate / 1000}`;
    console.log("startdate", endDate);
    if (url === prevApiCallUrl) {
      return { data: cryptoPriceRangeData };
    } else {
      dispatch(setPrevApiCallUrl(url));
      let res = await axios.get(url);
      dispatch(setCryptoPriceRangeData(res.data));

      return { data: res.data };
    }
  };
  return [getCryptoPriceRangeInfo];
};

export default useCryptoPriceRangeInfo;
