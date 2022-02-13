export const convDateToUTCUnix = (date) => {
  const normHours = date.getHours();
  const utcHours = date.getUTCHours();

  const diff = normHours - utcHours;
  if (utcHours > normHours) {
    if (diff < -12.1) {
      // time offset is positive
      const hoursToSubstract = 3600000 * (24 + diff);

      return date.getTime() - hoursToSubstract;
    }
    return date.getTime() + 3600000 * (utcHours - normHours); // offset is negative
  }
  if (utcHours < normHours) {
    if (diff > 14.1) {
      // time offset is negative

      const hoursToAdd = 3600000 * (24 - diff);
      return date.getTime() + hoursToAdd;
    }
    return date.getTime() + 3600000 * (utcHours - normHours); // offset is positive
  }
  return date.getTime();
};

export const formatUTCTimeString = (date) => {
  // give date in unix
  date = new Date(date);
  var UTCTimeString =
    "" +
    (date.getUTCMonth() + 1) +
    "." +
    (date.getUTCDate() + 1) +
    "." +
    date.getUTCFullYear() +
    "   " +
    (date.getUTCHours() < 10 ? "0" + date.getUTCHours() : date.getUTCHours()) +
    ":" +
    (date.getUTCMinutes() < 10
      ? "0" + date.getUTCMinutes()
      : date.getUTCMinutes()) +
    "  UTC";

  return UTCTimeString;
};

export const convertPriceIntervalToDay = (arr) => {
  const newArr = arr?.filter((obj, i) => {
    const date = new Date(obj?.[0]);
    const prevDate = new Date(arr?.[i - 1]?.[0]);
    return prevDate.getUTCDate() !== date.getUTCDate();
  });
  return newArr;
};

export const getIs24HourInterval = (prices) => {
  let startCount = false;
  let countDone = false;
  let dataPointsBetweenDays = 0;
  for (let index = 0; index < prices?.length; index++) {
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
  return dataPointsBetweenDays < 20;
};

export const mergeArrays = ({ startArray, middleArray, endArray }) => {
  middleArray?.unshift(startArray);
  middleArray?.push(endArray);

  middleArray = middleArray.flat();
  return middleArray;
};
