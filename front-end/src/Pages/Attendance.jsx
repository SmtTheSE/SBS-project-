import React, { useEffect, useState, useCallback } from "react";
import Container from "../Components/Container";
import DropDowns from "../Components/DropDown";
import DualCircularProgress from "../Components/DualCircularProgress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StackedBarChart from "../Components/StackedBarChart";

// Get course color based on course name
const getCourseColor = (courseName) => {
  // Define a set of colors to use
  const colorPalette = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-lime-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-fuchsia-500"
  ];
  
  // Create a consistent hash from the course name to select a color
  let hash = 0;
  for (let i = 0; i < courseName.length; i++) {
    const char = courseName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash to select a color from the palette
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};

// Calendar Event Popup Component
const EventPopup = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-96 border border-gray-200 transform transition-all duration-300 scale-95 animate-scaleIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{event.courseName}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20">Date:</span>
            <span className="text-gray-900">{event.classDate}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20">Time:</span>
            <span className="text-gray-900">{event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20">Room:</span>
            <span className="text-gray-900">{event.room}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20">Lecturer:</span>
            <span className="text-gray-900">{event.lecturerName}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-20">Duration:</span>
            <span className="text-gray-900">{event.durationMinutes} minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Day Detail Popup Component
const DayDetailPopup = ({ date, schedules, onClose }) => {
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200 transform transition-all duration-300 scale-95 animate-scaleIn">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Schedule for {formattedDate}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto flex-grow">
          {schedules && schedules.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lecturer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedules.map((schedule, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`w-3 h-3 ${getCourseColor(schedule.courseName)} rounded-full mr-2`}></span>
                        <div className="text-sm font-medium text-gray-900">{schedule.courseName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.startTime} - {schedule.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.room}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.lecturerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.durationMinutes} minutes
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No classes scheduled for this day</div>
            </div>
          )}
        </div>
        
        {(schedules && schedules.length > 0) && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Total classes: {schedules.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Class Schedule Calendar Component
const ClassScheduleCalendar = ({ classSchedules }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [daySchedules, setDaySchedules] = useState([]);
  const [isCalendarAnimating, setIsCalendarAnimating] = useState(false);
  const [calendarTheme, setCalendarTheme] = useState('light'); // Add theme state

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
    setIsCalendarAnimating(true);
    setTimeout(() => {
      setCurrentDate(new Date(year, month - 1, 1));
      setIsCalendarAnimating(false);
    }, 150);
  };

  const goToNextMonth = () => {
    setIsCalendarAnimating(true);
    setTimeout(() => {
      setCurrentDate(new Date(year, month + 1, 1));
      setIsCalendarAnimating(false);
    }, 150);
  };

  const goToToday = () => {
    setIsCalendarAnimating(true);
    setTimeout(() => {
      setCurrentDate(new Date());
      setIsCalendarAnimating(false);
    }, 150);
  };

  // Get class schedules for a specific date
  const getSchedulesForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return classSchedules.filter(schedule => {
      // Check if the schedule has a valid classDate and matches the date
      if (schedule.classDate) {
        // Normalize the schedule date to string format for comparison
        let scheduleDateStr = '';
        
        if (typeof schedule.classDate === 'string') {
          // Already a string, use as is
          scheduleDateStr = schedule.classDate;
        } else if (schedule.classDate instanceof Object && schedule.classDate.year !== undefined) {
          // LocalDate object format {year, month, day}
          scheduleDateStr = `${schedule.classDate.year}-${String(schedule.classDate.month).padStart(2, '0')}-${String(schedule.classDate.day).padStart(2, '0')}`;
        } else if (schedule.classDate instanceof Date) {
          // Date object format
          scheduleDateStr = schedule.classDate.toISOString().split('T')[0];
        }
        
        return scheduleDateStr === dateStr;
      }
      return false;
    });
  };

  // Check if date is today
  const isToday = (date) => {
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // Handle day click
  const handleDayClick = (date) => {
    const schedules = getSchedulesForDate(date);
    setSelectedDay(date);
    setDaySchedules(schedules);
  };

  // Close popups
  const closeEventPopup = () => {
    setSelectedEvent(null);
  };

  const closeDayPopup = () => {
    setSelectedDay(null);
    setDaySchedules([]);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];

    // Previous month's trailing days
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      const schedules = getSchedulesForDate(date);
      
      days.push(
        <div 
          key={`prev-${date.getDate()}`} 
          className={`p-2 text-center h-36 border cursor-pointer transition-all duration-200 rounded-lg shadow-sm hover:shadow-md ${calendarTheme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}
          onClick={() => handleDayClick(date)}
        >
          <div className={`text-xs ${calendarTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{date.getDate()}</div>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {schedules.slice(0, 3).map((schedule, idx) => (
              <div 
                key={idx} 
                className={`w-6 h-6 rounded-full ${getCourseColor(schedule.courseName)} transition-all duration-200 hover:scale-110 flex items-center justify-center shadow-sm hover:shadow-md border-2 ${calendarTheme === 'dark' ? 'border-gray-800' : 'border-white'}`}
                title={`${schedule.courseName} - ${schedule.startTime}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(schedule);
                }}
              >
                <span className="text-xs text-white font-bold opacity-0 hover:opacity-100 transition-opacity duration-200">
                  ●
                </span>
              </div>
            ))}
            {schedules.length > 3 && (
              <div className={`text-xs font-semibold ${calendarTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>+{schedules.length - 3}</div>
            )}
          </div>
        </div>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const todayFlag = isToday(date);
      const schedules = getSchedulesForDate(date);
      
      days.push(
        <div 
          key={day} 
          className={`p-2 text-center h-36 border cursor-pointer transition-all duration-200 rounded-lg shadow-sm hover:shadow-md ${calendarTheme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}
          onClick={() => handleDayClick(date)}
        >
          <div className={`text-base font-bold ${todayFlag ? 'bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center ml-auto mr-auto transition-all duration-300 shadow-md' : calendarTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {schedules.slice(0, 3).map((schedule, idx) => (
              <div 
                key={idx} 
                className={`w-6 h-6 rounded-full ${getCourseColor(schedule.courseName)} cursor-pointer transition-all duration-200 hover:scale-110 flex items-center justify-center shadow-sm hover:shadow-md border-2 ${calendarTheme === 'dark' ? 'border-gray-800' : 'border-white'}`}
                title={`${schedule.courseName} - ${schedule.startTime}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(schedule);
                }}
              >
                <span className="text-xs text-white font-bold opacity-0 hover:opacity-100 transition-opacity duration-200">
                  ●
                </span>
              </div>
            ))}
            {schedules.length > 3 && schedules.length <= 6 && (
              <div className={`text-xs font-semibold ${calendarTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>+{schedules.length - 3}</div>
            )}
            {schedules.length > 6 && (
              <div className={`text-xs font-semibold ${calendarTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>+{schedules.length - 6}</div>
            )}
          </div>
        </div>
      );
    }

    // Next month's leading days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const schedules = getSchedulesForDate(date);
      
      days.push(
        <div 
          key={`next-${day}`} 
          className={`p-2 text-center h-36 border cursor-pointer transition-all duration-200 rounded-lg shadow-sm hover:shadow-md ${calendarTheme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}
          onClick={() => handleDayClick(date)}
        >
          <div className={`text-xs ${calendarTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{date.getDate()}</div>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {schedules.slice(0, 3).map((schedule, idx) => (
              <div 
                key={idx} 
                className={`w-6 h-6 rounded-full ${getCourseColor(schedule.courseName)} transition-all duration-200 hover:scale-110 flex items-center justify-center shadow-sm hover:shadow-md border-2 ${calendarTheme === 'dark' ? 'border-gray-800' : 'border-white'}`}
                title={`${schedule.courseName} - ${schedule.startTime}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(schedule);
                }}
              >
                <span className="text-xs text-white font-bold opacity-0 hover:opacity-100 transition-opacity duration-200">
                  ●
                </span>
              </div>
            ))}
            {schedules.length > 3 && (
              <div className={`text-xs font-semibold ${calendarTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>+{schedules.length - 3}</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  // Toggle calendar theme
  const toggleCalendarTheme = () => {
    setCalendarTheme(calendarTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`w-full ${calendarTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousMonth}
          className={`flex items-center p-2 rounded-lg transition-all duration-200 hover:shadow-md ${calendarTheme === 'dark' ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
          title="Previous month"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="mr-1" />
          <span className="text-sm font-medium">Prev</span>
        </button>

        <div className="text-center">
          <h3 className="text-lg font-semibold">{monthNames[month]} {year}</h3>
          <button
            onClick={goToToday}
            className={`text-sm ${calendarTheme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline transition-all duration-200`}
          >
            Today
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          className={`flex items-center p-2 rounded-lg transition-all duration-200 hover:shadow-md ${calendarTheme === 'dark' ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
          title="Next month"
        >
          <span className="text-sm font-medium">Next</span>
          <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className={`p-2 text-center text-sm font-medium ${calendarTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={`grid grid-cols-7 gap-1 transition-opacity duration-150 ${isCalendarAnimating ? 'opacity-0' : 'opacity-100'}`}>
        {generateCalendarDays()}
      </div>

      {/* Event Popup */}
      {selectedEvent && <EventPopup event={selectedEvent} onClose={closeEventPopup} />}
      
      {/* Day Detail Popup */}
      {selectedDay && <DayDetailPopup date={selectedDay} schedules={daySchedules} onClose={closeDayPopup} />}
    </div>
  );
};

const Attendance = () => {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [classSchedules, setClassSchedules] = useState([]);
  const [rates, setRates] = useState({
    studentRate: 0,
    teacherRate: 91, // Keep static or fetch from another API
  });
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();
  
  // Pagination states for class schedules
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Show 10 schedules per page
  
  // 添加动画状态
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Theme state for Attendance Hours section
  const [attendanceHoursTheme, setAttendanceHoursTheme] = useState('light');

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
        fetchClassSchedules(studentId, token);
      })
      .catch(() => navigate("/login"));
  }, []);

  // Reset to first page when classSchedules changes
  useEffect(() => {
    setCurrentPage(1);
  }, [classSchedules]);

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
      
      // Process data for the chart
      processChartData(logs);
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
      setAttendanceLogs([]);
    }
  };

  const fetchClassSchedules = async (studentId, token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `http://localhost:8080/api/academic/class-timelines/${studentId}`,
        { headers }
      );

      const scheduleData = Array.isArray(response.data) ? response.data : [];
      
      // Transform data for calendar - ensure proper date format
      const schedules = scheduleData.map(schedule => {
        // Ensure classDate is in the correct format
        let classDate = schedule.classDate;
        if (typeof classDate === 'object' && classDate !== null) {
          if (classDate.year !== undefined) {
            // Convert LocalDate object to string
            classDate = `${classDate.year}-${String(classDate.month).padStart(2, '0')}-${String(classDate.day).padStart(2, '0')}`;
          } else if (classDate instanceof Date) {
            // Convert Date object to string
            classDate = classDate.toISOString().split('T')[0];
          }
        }
        
        return {
          classScheduleId: schedule.classScheduleId,
          classDate: classDate,
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          durationMinutes: schedule.durationMinutes,
          room: schedule.room,
          courseName: schedule.courseName,
          lecturerName: schedule.lecturerName
        };
      });

      setClassSchedules(schedules);
      console.log("Class schedules loaded:", schedules);
    } catch (error) {
      console.error("Failed to fetch class schedules:", error);
      setClassSchedules([]);
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

  // Pagination functions for class schedules
  const getPaginatedSchedules = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return classSchedules.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(classSchedules.length / itemsPerPage);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber !== currentPage && pageNumber >= 1 && pageNumber <= getTotalPages()) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage(pageNumber);
        setIsAnimating(false);
      }, 150); // 与CSS动画持续时间匹配
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleNextPage = () => {
    if (currentPage < getTotalPages()) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  return (
    <section className="p-10">
      <Container className="flex flex-col gap-5">
        {/* Calendar Section - Moved to top */}
        <div className="bg-white p-5 rounded-xl shadow-lg w-full transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <h1 className="text-font text-3xl mb-5">Calendar</h1>
          </div>
          <div className="min-h-[500px]">
            <ClassScheduleCalendar classSchedules={classSchedules} />
          </div>
        </div>

        {/* Class Schedule Information and Attendance Hours - Moved below calendar */}
        <div className="flex justify-between items-stretch gap-5">
          {/* Left Side - Class Schedule Information */}
          <div className="w-2/3">
            {/* Class Schedule Information */}
            <div className="bg-white p-5 rounded-md shadow-lg transition-all duration-300 hover:shadow-xl">
              <h1 className="text-font text-3xl mb-5">Class Schedule for the Semester</h1>
              <p className="mb-4 text-gray-600">
                This calendar shows all your scheduled classes for the entire semester.
              </p>
              
              {/* Course Schedule Table */}
              <div className={`overflow-x-auto transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getPaginatedSchedules()
                      .sort((a, b) => {
                        // Sort by day of week and then by start time
                        const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                        const dayComparison = dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
                        if (dayComparison !== 0) return dayComparison;
                        
                        // If same day, sort by start time
                        return a.startTime.localeCompare(b.startTime);
                      })
                      .map((schedule, index) => (
                        <tr key={`${schedule.classScheduleId}-${index}`} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`w-3 h-3 ${getCourseColor(schedule.courseName)} rounded-full mr-2 transition-all duration-200`}></span>
                              <div className="text-sm font-medium text-gray-900">{schedule.courseName}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {schedule.dayOfWeek}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                
                {classSchedules.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No class schedules found
                  </div>
                )}
              </div>
              
              {/* Pagination Controls */}
              {classSchedules.length > itemsPerPage && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === 1 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5`}
                    >
                      Previous
                    </button>
                    
                    {[...Array(getTotalPages())].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-10 h-10 rounded-full ${
                            currentPage === pageNumber
                              ? 'bg-blue-500 text-white shadow-md transform scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === getTotalPages()}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === getTotalPages() 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
              
              <p className="mt-4 text-sm text-gray-500">
                Click on any colored dot in the calendar to see detailed information about the class.
              </p>
            </div>
          </div>

          {/* Right Side - Attendance Hours Chart */}
          <div className="w-1/3">
            <div className={`p-5 rounded-md shadow-lg transition-all duration-300 hover:shadow-xl ${attendanceHoursTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center">
                <h1 className={`text-3xl mb-5 ${attendanceHoursTheme === 'dark' ? 'text-white' : 'text-font'}`}>Attendance Hours</h1>
              </div>
              <div className="w-full overflow-x-auto">
                <StackedBarChart data={chartData} />
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default Attendance;