import React, { useEffect, useState } from "react";
import Container from "../Components/Container";
import DropDowns from "../Components/DropDown";
import DualCircularProgress from "../Components/DualCircularProgress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEllipsis, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Dynamic Calendar Component
const DynamicAttendanceCalendar = ({ attendanceLogs }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get attendance status for a specific date
  const getAttendanceStatus = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const attendance = attendanceLogs.find(log => log.date === dateStr);
    return attendance ? attendance.status : null;
  };

  // Get status circle styling
  const getStatusCircleClass = (status, isToday) => {
    if (isToday && status !== null) {
      // Today with attendance status - combine blue background with colored border
      switch (status) {
        case 1: return "bg-blue-500 text-white ring-2 ring-green-600"; // Present
        case 0: return "bg-blue-500 text-white ring-2 ring-red-600";   // Absent
        case 2: return "bg-blue-500 text-white ring-2 ring-yellow-400"; // Absent with permission
        default: return "bg-blue-500 text-white";
      }
    } else if (isToday) {
      // Today without attendance
      return "bg-blue-500 text-white";
    } else if (status !== null) {
      // Regular day with attendance status
      switch (status) {
        case 1: return "bg-green-600 text-white"; // Present
        case 0: return "bg-red-600 text-white";   // Absent
        case 2: return "bg-yellow-400 text-gray-800"; // Absent with permission
        default: return "hover:bg-gray-100 text-gray-800";
      }
    } else {
      // Regular day without attendance
      return "hover:bg-gray-100 text-gray-800";
    }
  };

  // Check if date is today
  const isToday = (date) => {
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];

    // Previous month's trailing days
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(
        <div key={`prev-${date.getDate()}`} className="p-2 text-center">
          <div className="w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm text-gray-400">
            {date.getDate()}
          </div>
        </div>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const todayFlag = isToday(date);
      const status = getAttendanceStatus(date);
      const circleClass = getStatusCircleClass(status, todayFlag);

      days.push(
        <div key={day} className="p-2 text-center">
          <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-medium cursor-pointer transition-all ${circleClass}`}>
            {day}
          </div>
        </div>
      );
    }

    // Next month's leading days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push(
        <div key={`next-${day}`} className="p-2 text-center">
          <div className="w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm text-gray-400">
            {day}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div className="text-center">
          <h3 className="text-lg font-semibold">{monthNames[month]} {year}</h3>
          <button
            onClick={goToToday}
            className="text-sm text-blue-600 hover:underline"
          >
            Today
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays()}
      </div>
    </div>
  );
};

const Attendance = () => {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [rates, setRates] = useState({
    studentRate: 0,
    teacherRate: 91, // Keep static or fetch from another API
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios.get("http://localhost:8080/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const studentId = res.data.studentId;
        fetchAttendanceData(studentId, token);
        fetchAttendanceSummary(studentId, token);
      })
      .catch(() => navigate("/login"));
  }, []);

  const fetchAttendanceData = async (studentId, token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `http://localhost:8080/api/academic/daily-attendance/student/${studentId}`,
        { headers }
      );

      const attendanceData = Array.isArray(response.data) ? response.data : [];

      // Transform backend data to match your frontend format
      const logs = attendanceData.map(record => ({
        date: record.attendanceDate,
        checkIn: record.checkInTime,
        checkOut: record.checkOutTime,
        status: record.status === "Present" ? 1 :
                record.status === "Absent" ? 0 : 2, // "Absent with permission"
        note: record.note || "",
        courseName: record.courseName, // Additional info for display
      }));

      setAttendanceLogs(logs);
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
      setAttendanceLogs([]);
    }
  };

  const fetchAttendanceSummary = async (studentId, token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `http://localhost:8080/api/academic/daily-attendance/summary/student/${studentId}`,
        { headers }
      );

      const summary = response.data;
      setRates(prev => ({
        ...prev,
        studentRate: Math.round(summary.attendanceRate || 0),
      }));
    } catch (error) {
      console.error("Failed to fetch attendance summary:", error);
      setRates(prev => ({ ...prev, studentRate: 0 }));
    }
  };

  return (
    <section className="p-10">
      <Container className="flex justify-between items-stretch gap-5">
        {/* Left Side */}
        <div className="w-2/3">
          {/* Explanation */}
          <div className="bg-white p-5 rounded-md mb-5">
            <h1 className="text-font text-3xl mb-5">Attendances</h1>
            <p className="mb-10 text-justify">
              Every class you attend adds value to your learning journey. Being
              present shows dedication and builds habits that lead to strong
              academic performance. Try your best to stay consistent - your
              future self will thank you!
            </p>
            <div className="flex justify-between items-center">
              <h3 className="flex items-center gap-2">
                <span className="bg-green-600 w-5 h-5 rounded-full inline-block"></span>{" "}
                Present Days
              </h3>
              <h3 className="flex items-center gap-2">
                <span className="bg-red-600 w-5 h-5 rounded-full inline-block"></span>{" "}
                Absent Days
              </h3>
              <h3 className="flex items-center gap-2">
                <span className="bg-yellow-400 w-5 h-5 rounded-full inline-block"></span>{" "}
                Absent with permission
              </h3>
            </div>
          </div>

          {/* Daily attendance */}
          <div className="bg-white p-5 rounded-md">
            <div className="flex justify-between items-center mb-5">
              <h1 className="text-font text-3xl">
                Daily Attendance Table (Detailed Log)
              </h1>
              <DropDowns />
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left">Date</th>
                  <th className="py-3 text-left">Course</th>
                  <th className="py-3 text-left">Status</th>
                  <th className="py-3 text-left">Check-in</th>
                  <th className="py-3 text-left">Check-out</th>
                  <th className="py-3 text-left">Note</th>
                </tr>
              </thead>
              <tbody>
                {attendanceLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-5 text-center text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  attendanceLogs.map((log, index) => (
                    <tr key={`${log.date}-${index}`} className="border-b border-border">
                      <td className="py-3">{log.date}</td>
                      <td className="py-3">{log.courseName || "-"}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          log.status === 1
                            ? "bg-green-100 text-green-800"
                            : log.status === 0
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {log.status === 1
                            ? "Present"
                            : log.status === 0
                            ? "Absent"
                            : "Absent with permission"}
                        </span>
                      </td>
                      <td className="py-3">{log.checkIn || "-"}</td>
                      <td className="py-3">{log.checkOut || "-"}</td>
                      <td className="py-3">{log.note || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/3">
          {/* Chart */}
          <div className="bg-white p-5 rounded-md mb-5">
            <div className="flex justify-between items-center">
              <h1 className="text-font text-3xl mb-5">Attendances</h1>
              <FontAwesomeIcon icon={faEllipsis} />
            </div>
            <DualCircularProgress
              studentRate={rates.studentRate}
              teacherRate={rates.teacherRate}
              className="my-5"
            />
            <div className="flex justify-between items-center">
              {/* Student Rate */}
              <div>
                <h5 className="font-light text-font-light text-center">
                  Students
                </h5>
                <h1 className="text-[#1E3A8A] text-2xl text-center">
                  {rates.studentRate}%
                </h1>
              </div>

              {/* Teacher Rate */}
              <div>
                <h5 className="font-light text-font-light text-center">
                  Teachers
                </h5>
                <h1 className="text-[#F59E0B] text-2xl text-center">
                  {rates.teacherRate}%
                </h1>
              </div>
            </div>
          </div>

          {/* Dynamic Calendar */}
          <div className="p-5 bg-white rounded-xl shadow-md w-full">
            <div className="flex justify-between items-center">
              <h1 className="text-font text-3xl mb-5">Calendar</h1>
              <FontAwesomeIcon icon={faEllipsis} />
            </div>
            <DynamicAttendanceCalendar attendanceLogs={attendanceLogs} />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Attendance;