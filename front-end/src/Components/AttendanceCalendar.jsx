import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";

const AttendanceCalendar = ({ attendanceLogs }) => {
  const date = new Date();
  const formattedDate =
    date.getFullYear() +
    "-" +
    String(date.getMonth()).padStart(2, "0") +
    "-01";

  const monthStart = startOfMonth(parseISO(formattedDate));
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const getStatusColor = (date) => {
    const log = attendanceLogs.find((log) =>
      isSameDay(parseISO(log.date), date)
    );
    if (!log) return "";
    if (log.status === 1) return "bg-green-500 text-white";
    if (log.status === 0) return "bg-red-500 text-white";
    if (log.status === 2) return "bg-yellow-400 text-white";
    return "";
  };

  let days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="">
      <div className="text-center font-medium mb-4">
        {format(monthStart, "MMMM yyyy")}
      </div>
      <div className="grid grid-cols-7 text-sm text-gray-500 mb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              isSameMonth(day, monthStart)
                ? getStatusColor(day)
                : "text-gray-300"
            }`}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
