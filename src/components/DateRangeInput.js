import React from "react";

const DateRangeInput = ({ setStartDate, setEndDate }) => {
  return (
    <div>
      <div>
        <label htmlFor="startDate">Start date:</label>
        <input
          type="date"
          id="startDate"
          onChange={(event) => setStartDate(event.target.value)}
          min="2010-01-01"
          max="2025-12-31"
        />
      </div>
      <div>
        <label htmlFor="endDate">End date:</label>
        <input
          type="date"
          id="endDate"
          onChange={(event) => setEndDate(event.target.value)}
          min="2010-01-01"
          max="2025-12-31"
        />
      </div>
    </div>
  );
};

export default DateRangeInput;
