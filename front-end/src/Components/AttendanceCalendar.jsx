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
  subMonths,
  addMonths
} from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const AttendanceCalendar = ({ attendanceLogs }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
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

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  let days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousMonth}
          className="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Previous month"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-gray-700 mr-1" />
          <span className="text-sm font-medium text-gray-700">Prev</span>
        </button>
        
        <div className="text-center font-medium text-gray-800">
          {format(monthStart, "MMMM yyyy")}
        </div>
        
        <button 
          onClick={goToNextMonth}
          className="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Next month"
        >
          <span className="text-sm font-medium text-gray-700">Next</span>
          <FontAwesomeIcon icon={faChevronRight} className="text-gray-700 ml-1" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 text-sm text-gray-500 mb-2">
        <div className="text-center">Sun</div>
        <div className="text-center">Mon</div>
        <div className="text-center">Tue</div>
        <div className="text-center">Wed</div>
        <div className="text-center">Thu</div>
        <div className="text-center">Fri</div>
        <div className="text-center">Sat</div>
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