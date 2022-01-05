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
  console.log(UTCTimeString);
  return UTCTimeString;
};
