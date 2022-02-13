import axios from "axios";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  setCryptoPriceRangeData,
  setIs24HourInterval,
  setPrevApiCallUrl,
} from "../slices/appSlice";
import { convDateToUTCUnix, getIs24HourInterval } from "../utils/utils";

//gets btc price, 24 volume and market cap info for a date range
//time interval between info objects is 1h or 24h depending on date range
const useCryptoPriceRangeInfo = () => {
  const dispatch = useDispatch();
  // startDate & endDate are required to be in unix milliseconds

  const prevApiCallUrl = useSelector((state) => state.app.prevApiCallUrl);
  const cryptoPriceRangeData = useSelector(
    (state) => state.app.cryptoPriceRangeData
  );
  const startDate = useSelector((state) => JSON.parse(state.app.startDate));
  const endDate = useSelector((state) => JSON.parse(state.app.endDate));

  const getCryptoPriceRangeInfo = async () => {
    const startDateObject = new Date(
      moment(startDate).format("YYYY-MM-DD") + "T00:00:00"
    );
    const endDateObject = new Date(
      moment(endDate).format("YYYY-MM-DD") + "T00:00:00"
    );

    const startDateUnix = convDateToUTCUnix(startDateObject) - 3600000;
    const endDateUnix = convDateToUTCUnix(endDateObject) + 3600000;

    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${
      startDateUnix / 1000
    }&to=${endDateUnix / 1000}`;
    if (url === prevApiCallUrl) {
      return { data: cryptoPriceRangeData };
    } else {
      let res = await axios.get(url);
      dispatch(setIs24HourInterval(getIs24HourInterval(res.data.prices)));
      dispatch(setCryptoPriceRangeData(res.data));

      dispatch(setPrevApiCallUrl(url));

      return { data: res.data };
    }
  };
  return [getCryptoPriceRangeInfo];
};

export default useCryptoPriceRangeInfo;

/* 
const startDate1 = useSelector((state) => state.app.startDate);
const endDate1 = useSelector((state) => state.app.endDate);
const startDate = new Date(JSON.parse(startDate1));
const endDate = new Date(JSON.parse(endDate1));
startDate.getTime() 
endDate.getTime() */
