import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const AdminAttendanceManager = () => {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' or 'daily'
  const [attendanceSummaries, setAttendanceSummaries] = useState([]);
  const [dailyAttendances, setDailyAttendances] = useState([]);
  const [students, setStudents] = useState([]);
  const [studyPlanCourses, setStudyPlanCourses] = useState([]);
  const [classSchedules, setClassSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({});

  // 获取所有考勤汇总记录
  const fetchAttendanceSummaries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/academic/attendance-summaries');
      setAttendanceSummaries(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch attendance summaries:', err);
      setError('Failed to fetch attendance summaries: ' + (err.response?.data?.message || err.message));
      setAttendanceSummaries([]);
    } finally {
      setLoading(false);
    }
  };

  // 获取所有每日考勤记录
  const fetchDailyAttendances = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/academic/daily-attendances');
      setDailyAttendances(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch daily attendances:', err);
      setError('Failed to fetch daily attendances: ' + (err.response?.data?.message || err.message));
      setDailyAttendances([]);
    } finally {
      setLoading(false);
    }
  };

  // 获取所有学生（用于下拉列表）
  const fetchStudents = async () => {
    try {
      const response = await axios.get('/admin/students');
      setStudents(response.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  // 获取所有学习计划课程（用于下拉列表）
  const fetchStudyPlanCourses = async () => {
    try {
      const response = await axios.get('/academic/study-plan-courses');
      setStudyPlanCourses(response.data);
    } catch (err) {
      console.error('Failed to fetch study plan courses:', err);
    }
  };

  // 获取所有课程时间表（用于下拉列表）
  const fetchClassSchedules = async () => {
    try {
      const response = await axios.get('/admin/academic/class-schedules');
      setClassSchedules(response.data);
    } catch (err) {
      console.error('Failed to fetch class schedules:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'summary') {
      fetchAttendanceSummaries();
    } else {
      fetchDailyAttendances();
    }
    fetchStudents();
    fetchStudyPlanCourses();
    fetchClassSchedules();
  }, [activeTab]);

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRecord(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 打开添加模态框
  const openAddModal = () => {
    setIsEditing(false);
    if (activeTab === 'summary') {
      setCurrentRecord({
        id: null,
        studentId: '',
        studyPlanCourseId: '',
        presentDays: 0,
        totalDays: 0,
        absentDays: 0,
        totalAttendancePercentage: 0,
        flagLevel: 'Good'
      });
    } else {
      setCurrentRecord({
        studentId: '',
        classScheduleId: '',
        attendanceDate: '',
        status: 'Present',
        checkInTime: '',
        checkOutTime: '',
        note: ''
      });
    }
    setShowModal(true);
  };

  // 打开编辑模态框
  const openEditModal = (record) => {
    setIsEditing(true);
    setCurrentRecord({ ...record });
    setShowModal(true);
  };

  // 关闭模态框
  const closeModal = () => {
    setShowModal(false);
  };

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'summary') {
        const summaryData = { ...currentRecord };
        
        if (isEditing) {
          // 更新考勤汇总记录
          await axios.put(`/admin/academic/attendance-summaries/${currentRecord.id}`, summaryData);
        } else {
          // 创建新的考勤汇总记录
          await axios.post('/admin/academic/attendance-summaries', summaryData);
        }
      } else {
        const attendanceData = { ...currentRecord };
        
        if (isEditing) {
          // 更新每日考勤记录
          await axios.put(`/admin/academic/daily-attendances/${currentRecord.studentId}/${currentRecord.classScheduleId}`, attendanceData);
        } else {
          // 创建新的每日考勤记录
          await axios.post('/admin/academic/daily-attendances', attendanceData);
        }
      }
      closeModal();
      if (activeTab === 'summary') {
        fetchAttendanceSummaries(); // 重新获取数据
      } else {
        fetchDailyAttendances(); // 重新获取数据
      }
      setError('');
    } catch (err) {
      console.error('Operation failed:', err);
      setError('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // 删除记录
  const handleDelete = async (record) => {
    if (activeTab === 'summary') {
      if (window.confirm('Are you sure you want to delete this attendance summary?')) {
        try {
          await axios.delete(`/admin/academic/attendance-summaries/${record.id}`);
          fetchAttendanceSummaries(); // 重新获取数据
          setError('');
        } catch (err) {
          console.error('Delete failed:', err);
          setError('Delete failed: ' + (err.response?.data?.message || err.message));
        }
      }
    } else {
      if (window.confirm('Are you sure you want to delete this daily attendance record?')) {
        try {
          await axios.delete(`/admin/academic/daily-attendances/${record.studentId}/${record.classScheduleId}`);
          fetchDailyAttendances(); // 重新获取数据
          setError('');
        } catch (err) {
          console.error('Delete failed:', err);
          setError('Delete failed: ' + (err.response?.data?.message || err.message));
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Attendance Management</h1>
          <p className="text-gray-600 mb-6">
            Manage student attendance records
          </p>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Attendance Management</h1>
        <p className="text-gray-600 mb-6">
          Manage student attendance records
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'summary' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('summary')}
          >
            Attendance Summary
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'daily' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('daily')}
          >
            Daily Attendance
          </button>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={openAddModal}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Record
          </button>
        </div>

        {/* Attendance Summary Table */}
        {activeTab === 'summary' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">ID</th>
                  <th className="py-2 px-4 border-b text-left">Student</th>
                  <th className="py-2 px-4 border-b text-left">Study Plan Course</th>
                  <th className="py-2 px-4 border-b text-left">Present Days</th>
                  <th className="py-2 px-4 border-b text-left">Total Days</th>
                  <th className="py-2 px-4 border-b text-left">Absent Days</th>
                  <th className="py-2 px-4 border-b text-left">Attendance %</th>
                  <th className="py-2 px-4 border-b text-left">Flag Level</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(attendanceSummaries) && attendanceSummaries.length > 0 ? (
                  attendanceSummaries.map((summary) => (
                    <tr key={summary.id}>
                      <td className="py-2 px-4 border-b">{summary.id}</td>
                      <td className="py-2 px-4 border-b">{summary.studentId}</td>
                      <td className="py-2 px-4 border-b">{summary.studyPlanCourseId}</td>
                      <td className="py-2 px-4 border-b">{summary.presentDays}</td>
                      <td className="py-2 px-4 border-b">{summary.totalDays}</td>
                      <td className="py-2 px-4 border-b">{summary.absentDays}</td>
                      <td className="py-2 px-4 border-b">{summary.totalAttendancePercentage}%</td>
                      <td className="py-2 px-4 border-b">{summary.flagLevel}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => openEditModal(summary)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(summary)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No attendance summaries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Daily Attendance Table */}
        {activeTab === 'daily' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Student</th>
                  <th className="py-2 px-4 border-b text-left">Class Schedule</th>
                  <th className="py-2 px-4 border-b text-left">Attendance Date</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Check In</th>
                  <th className="py-2 px-4 border-b text-left">Check Out</th>
                  <th className="py-2 px-4 border-b text-left">Note</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(dailyAttendances) && dailyAttendances.length > 0 ? (
                  dailyAttendances.map((attendance, index) => (
                    <tr key={`${attendance.studentId}-${attendance.classScheduleId}-${index}`}>
                      <td className="py-2 px-4 border-b">{attendance.studentId}</td>
                      <td className="py-2 px-4 border-b">{attendance.classScheduleId}</td>
                      <td className="py-2 px-4 border-b">{attendance.attendanceDate}</td>
                      <td className="py-2 px-4 border-b">{attendance.status}</td>
                      <td className="py-2 px-4 border-b">{attendance.checkInTime || '-'}</td>
                      <td className="py-2 px-4 border-b">{attendance.checkOutTime || '-'}</td>
                      <td className="py-2 px-4 border-b">{attendance.note || '-'}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => openEditModal(attendance)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(attendance)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No daily attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-1/3 max-h-screen overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {isEditing ? 'Edit Record' : 'Add New Record'}
              </h2>
              <form onSubmit={handleSubmit}>
                {activeTab === 'summary' ? (
                  // Attendance Summary Form
                  <>
                    {!isEditing && (
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id">
                          ID
                        </label>
                        <input
                          type="text"
                          id="id"
                          name="id"
                          value={currentRecord.id || ''}
                          onChange={handleInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          disabled
                        />
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentId">
                        Student
                      </label>
                      <select
                        id="studentId"
                        name="studentId"
                        value={currentRecord.studentId}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      >
                        <option value="">Select a Student</option>
                        {students.map(student => (
                          <option key={student.studentId} value={student.studentId}>
                            {student.studentId} - {student.firstName} {student.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studyPlanCourseId">
                        Study Plan Course
                      </label>
                      <select
                        id="studyPlanCourseId"
                        name="studyPlanCourseId"
                        value={currentRecord.studyPlanCourseId}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      >
                        <option value="">Select a Study Plan Course</option>
                        {studyPlanCourses.map(course => (
                          <option key={course.studyPlanCourseId} value={course.studyPlanCourseId}>
                            {course.studyPlanCourseId}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="presentDays">
                        Present Days
                      </label>
                      <input
                        type="number"
                        id="presentDays"
                        name="presentDays"
                        value={currentRecord.presentDays}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalDays">
                        Total Days
                      </label>
                      <input
                        type="number"
                        id="totalDays"
                        name="totalDays"
                        value={currentRecord.totalDays}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="absentDays">
                        Absent Days
                      </label>
                      <input
                        type="number"
                        id="absentDays"
                        name="absentDays"
                        value={currentRecord.absentDays}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalAttendancePercentage">
                        Attendance Percentage (0-100)
                      </label>
                      <input
                        type="number"
                        id="totalAttendancePercentage"
                        name="totalAttendancePercentage"
                        value={currentRecord.totalAttendancePercentage}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="flagLevel">
                        Flag Level
                      </label>
                      <select
                        id="flagLevel"
                        name="flagLevel"
                        value={currentRecord.flagLevel}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      >
                        <option value="Low">Low</option>
                        <option value="Warning">Warning</option>
                        <option value="Good">Good</option>
                        <option value="Excellent">Excellent</option>
                      </select>
                    </div>
                  </>
                ) : (
                  // Daily Attendance Form
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentId">
                        Student
                      </label>
                      <select
                        id="studentId"
                        name="studentId"
                        value={currentRecord.studentId}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      >
                        <option value="">Select a Student</option>
                        {students.map(student => (
                          <option key={student.studentId} value={student.studentId}>
                            {student.studentId} - {student.firstName} {student.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="classScheduleId">
                        Class Schedule
                      </label>
                      <select
                        id="classScheduleId"
                        name="classScheduleId"
                        value={currentRecord.classScheduleId}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      >
                        <option value="">Select a Class Schedule</option>
                        {classSchedules.map(schedule => (
                          <option key={schedule.classScheduleId} value={schedule.classScheduleId}>
                            {schedule.classScheduleId}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attendanceDate">
                        Attendance Date
                      </label>
                      <input
                        type="date"
                        id="attendanceDate"
                        name="attendanceDate"
                        value={currentRecord.attendanceDate}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={currentRecord.status}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Absent with permission">Absent with permission</option>
                        <option value="Late">Late</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="checkInTime">
                        Check In Time
                      </label>
                      <input
                        type="time"
                        id="checkInTime"
                        name="checkInTime"
                        value={currentRecord.checkInTime}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="checkOutTime">
                        Check Out Time
                      </label>
                      <input
                        type="time"
                        id="checkOutTime"
                        name="checkOutTime"
                        value={currentRecord.checkOutTime}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="note">
                        Note
                      </label>
                      <textarea
                        id="note"
                        name="note"
                        value={currentRecord.note}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="3"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {isEditing ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttendanceManager;