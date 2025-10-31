import React, { useEffect, useState, useCallback } from "react";
import Container from "../Components/Container";
import DropDowns from "../Components/DropDown";
import DualCircularProgress from "../Components/DualCircularProgress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEllipsis, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StackedBarChart from "../Components/StackedBarChart";

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
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [rates, setRates] = useState({
    studentRate: 0,
    teacherRate: 91, // Keep static or fetch from another API
  });
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      setFilteredLogs(logs); // Initialize filtered logs with all data
      setCurrentPage(1); // Reset to first page when data changes
      
      // Process data for the chart
      processChartData(logs);
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
      setAttendanceLogs([]);
      setFilteredLogs([]);
    }
  };

  // Process attendance data for the stacked bar chart
  const processChartData = (logs) => {
    // Group by course name
    const courseData = {};
    
    logs.forEach(log => {
      const courseName = log.courseName || "Unknown Course";
      if (!courseData[courseName]) {
        courseData[courseName] = {
          present: 0,
          absent: 0,
          absentWithPermission: 0
        };
      }
      
      // Calculate actual hours based on check-in/check-out times
      let hours = 0;
      if (log.checkIn && log.checkOut) {
        const checkInTime = new Date(`1970-01-01T${log.checkIn}`);
        const checkOutTime = new Date(`1970-01-01T${log.checkOut}`);
        
        // Handle case where checkout is next day (e.g. checkIn: 23:00, checkOut: 01:00)
        if (checkOutTime < checkInTime) {
          checkOutTime.setDate(checkOutTime.getDate() + 1);
        }
        
        const timeDiff = checkOutTime - checkInTime;
        hours = timeDiff / (1000 * 60 * 60); // Convert milliseconds to hours
        
        // Use actual calculated hours without rounding to specific decimal points
        // This will preserve the real numbers as they are calculated
      } else {
        // If no check-in/check-out times, default to 1 hour
        hours = 1;
      }
      
      // Add hours to appropriate category
      if (log.status === 1) {
        courseData[courseName].present += hours;
      } else if (log.status === 0) {
        courseData[courseName].absent += hours;
      } else if (log.status === 2) {
        courseData[courseName].absentWithPermission += hours;
      }
    });
    
    // Convert to array format for the chart, keeping actual calculated values
    const chartData = Object.entries(courseData).map(([course, data]) => ({
      course,
      present: data.present, // Keep actual calculated values
      absent: data.absent,   // Keep actual calculated values
      absentWithPermission: data.absentWithPermission, // Keep actual calculated values
      total: data.present + data.absent + data.absentWithPermission
    }));
    
    setChartData(chartData);
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

  // Pagination functions
  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 处理筛选变化
  const handleFilterChange = useCallback((filteredData) => {
    setFilteredLogs(filteredData);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  // Get current data based on pagination
  const currentLogs = getPaginatedData(filteredLogs);
  const totalPages = getTotalPages(filteredLogs);

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
            <h1 className="text-font text-3xl mb-5">
              Daily Attendance Table (Detailed Log)
            </h1>

            <div className="mb-5">
              <AttendanceFilter
                logs={attendanceLogs}
                onFilterChange={handleFilterChange}
              />
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
                {currentLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-5 text-center text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  currentLogs.map((log, index) => (
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`w-10 h-10 rounded-full ${
                          currentPage === pageNumber
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/3">
          {/* Chart */}
          <div className="bg-white p-5 rounded-md mb-5">
            <div className="flex justify-between items-center">
              <h1 className="text-font text-3xl mb-5">Attendance Hours</h1>
              <FontAwesomeIcon icon={faEllipsis} />
            </div>
            <div className="w-full overflow-x-auto">
              <StackedBarChart data={chartData} />
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

// 新增的筛选组件
const AttendanceFilter = ({ logs, onFilterChange }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  // 获取所有唯一的课程名称
  const courses = [...new Set(logs.map(log => log.courseName).filter(name => name))].sort();

  // 获取状态选项
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: '1', label: 'Present' },
    { value: '0', label: 'Absent' },
    { value: '2', label: 'Absent with permission' }
  ];

  // 处理筛选变化
  useEffect(() => {
    let result = logs;

    // 按状态筛选
    if (statusFilter !== 'all') {
      result = result.filter(log => log.status === parseInt(statusFilter));
    }

    // 按课程筛选
    if (courseFilter !== 'all') {
      result = result.filter(log => log.courseName === courseFilter);
    }

    onFilterChange(result);
  }, [statusFilter, courseFilter, logs, onFilterChange]);

  return (
    <div className="flex gap-2">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="rounded-md border border-border px-3 py-2 bg-white text-font-light focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
      >
        {statusOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      <select
        value={courseFilter}
        onChange={(e) => setCourseFilter(e.target.value)}
        className="rounded-md border border-border px-3 py-2 bg-white text-font-light focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
      >
        <option value="all">All Courses</option>
        {courses.map(course => (
          <option key={course} value={course}>{course}</option>
        ))}
      </select>
    </div>
  );
};

export default Attendance;

