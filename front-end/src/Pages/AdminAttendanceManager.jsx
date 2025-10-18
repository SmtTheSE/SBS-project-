import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton } from '../Components/ModernForm';

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


  const fetchStudents = async () => {
    try {
      const response = await axios.get('/admin/students');
      setStudents(response.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };


  const fetchStudyPlanCourses = async () => {
    try {
      const response = await axios.get('/academic/study-plan-courses');
      setStudyPlanCourses(response.data);
    } catch (err) {
      console.error('Failed to fetch study plan courses:', err);
    }
  };


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


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRecord(prev => ({
      ...prev,
      [name]: value
    }));
  };


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


  const openEditModal = (record) => {
    setIsEditing(true);
    setCurrentRecord({ ...record });
    setShowModal(true);
  };


  const closeModal = () => {
    setShowModal(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'summary') {
        const summaryData = { ...currentRecord };
        
        if (isEditing) {

          await axios.put(`/admin/academic/attendance-summaries/${currentRecord.id}`, summaryData);
        } else {

          await axios.post('/admin/academic/attendance-summaries', summaryData);
        }
      } else {
        const attendanceData = { ...currentRecord };
        
        if (isEditing) {

          await axios.put(`/admin/academic/daily-attendances/${currentRecord.studentId}/${currentRecord.classScheduleId}`, attendanceData);
        } else {

          await axios.post('/admin/academic/daily-attendances', attendanceData);
        }
      }
      closeModal();
      if (activeTab === 'summary') {
        fetchAttendanceSummaries();
      } else {
        fetchDailyAttendances();
      }
      setError('');
    } catch (err) {
      console.error('Operation failed:', err);
      setError('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };


  const handleDelete = async (record) => {
    if (activeTab === 'summary') {
      if (window.confirm('Are you sure you want to delete this attendance summary?')) {
        try {
          await axios.delete(`/admin/academic/attendance-summaries/${record.id}`);
          fetchAttendanceSummaries();
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
          fetchDailyAttendances();
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
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
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
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
            <p className="text-gray-600">
              Manage student attendance records
            </p>
          </div>
          <FormButton
            variant="primary"
            onClick={openAddModal}
          >
            Add New Record
          </FormButton>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
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

        {/* Attendance Summary Table */}
        {activeTab === 'summary' && (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Study Plan Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Present Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Absent Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flag Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(attendanceSummaries) && attendanceSummaries.length > 0 ? (
                  attendanceSummaries.map((summary) => (
                    <tr key={summary.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {summary.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {summary.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {summary.studyPlanCourseId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {summary.presentDays}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {summary.totalDays}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {summary.absentDays}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {summary.totalAttendancePercentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {summary.flagLevel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal(summary)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(summary)}
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-12 bg-gray-50">
                      <p className="text-gray-500 text-lg">No attendance summaries found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Daily Attendance Table */}
        {activeTab === 'daily' && (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(dailyAttendances) && dailyAttendances.length > 0 ? (
                  dailyAttendances.map((attendance, index) => (
                    <tr key={`${attendance.studentId}-${attendance.classScheduleId}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {attendance.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attendance.classScheduleId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attendance.attendanceDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attendance.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attendance.checkInTime || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attendance.checkOutTime || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {attendance.note || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal(attendance)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(attendance)}
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12 bg-gray-50">
                      <p className="text-gray-500 text-lg">No daily attendance records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {isEditing ? 'Edit Record' : 'Add New Record'}
                  </h2>
                  <button 
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <ModernForm onSubmit={handleSubmit}>
                  {activeTab === 'summary' ? (
                    // Attendance Summary Form
                    <>
                      {!isEditing && (
                        <FormGroup>
                          <FormLabel>ID</FormLabel>
                          <FormInput
                            type="text"
                            id="id"
                            name="id"
                            value={currentRecord.id || ''}
                            onChange={handleInputChange}
                            disabled
                          />
                        </FormGroup>
                      )}
                      
                      <FormGroup>
                        <FormLabel required>Student</FormLabel>
                        <FormSelect
                          id="studentId"
                          name="studentId"
                          value={currentRecord.studentId}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select a Student</option>
                          {students.map(student => (
                            <option key={student.studentId} value={student.studentId}>
                              {student.studentId} - {student.firstName} {student.lastName}
                            </option>
                          ))}
                        </FormSelect>
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel required>Study Plan Course</FormLabel>
                        <FormSelect
                          id="studyPlanCourseId"
                          name="studyPlanCourseId"
                          value={currentRecord.studyPlanCourseId}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select a Study Plan Course</option>
                          {studyPlanCourses.map(course => (
                            <option key={course.studyPlanCourseId} value={course.studyPlanCourseId}>
                              {course.studyPlanCourseId}
                            </option>
                          ))}
                        </FormSelect>
                      </FormGroup>
                      
                      <FormRow>
                        <FormGroup>
                          <FormLabel required>Present Days</FormLabel>
                          <FormInput
                            type="number"
                            id="presentDays"
                            name="presentDays"
                            value={currentRecord.presentDays}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                        
                        <FormGroup>
                          <FormLabel required>Total Days</FormLabel>
                          <FormInput
                            type="number"
                            id="totalDays"
                            name="totalDays"
                            value={currentRecord.totalDays}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </FormRow>
                      
                      <FormRow>
                        <FormGroup>
                          <FormLabel required>Absent Days</FormLabel>
                          <FormInput
                            type="number"
                            id="absentDays"
                            name="absentDays"
                            value={currentRecord.absentDays}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                        
                        <FormGroup>
                          <FormLabel required>Attendance Percentage (0-100)</FormLabel>
                          <FormInput
                            type="number"
                            id="totalAttendancePercentage"
                            name="totalAttendancePercentage"
                            value={currentRecord.totalAttendancePercentage}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                            required
                          />
                        </FormGroup>
                      </FormRow>
                      
                      <FormGroup>
                        <FormLabel required>Flag Level</FormLabel>
                        <FormSelect
                          id="flagLevel"
                          name="flagLevel"
                          value={currentRecord.flagLevel}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="Low">Low</option>
                          <option value="Warning">Warning</option>
                          <option value="Good">Good</option>
                          <option value="Excellent">Excellent</option>
                        </FormSelect>
                      </FormGroup>
                    </>
                  ) : (
                    // Daily Attendance Form
                    <>
                      <FormGroup>
                        <FormLabel required>Student</FormLabel>
                        <FormSelect
                          id="studentId"
                          name="studentId"
                          value={currentRecord.studentId}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select a Student</option>
                          {students.map(student => (
                            <option key={student.studentId} value={student.studentId}>
                              {student.studentId} - {student.firstName} {student.lastName}
                            </option>
                          ))}
                        </FormSelect>
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel required>Class Schedule</FormLabel>
                        <FormSelect
                          id="classScheduleId"
                          name="classScheduleId"
                          value={currentRecord.classScheduleId}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select a Class Schedule</option>
                          {classSchedules.map(schedule => (
                            <option key={schedule.classScheduleId} value={schedule.classScheduleId}>
                              {schedule.classScheduleId}
                            </option>
                          ))}
                        </FormSelect>
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel required>Attendance Date</FormLabel>
                        <FormInput
                          type="date"
                          id="attendanceDate"
                          name="attendanceDate"
                          value={currentRecord.attendanceDate}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel required>Status</FormLabel>
                        <FormSelect
                          id="status"
                          name="status"
                          value={currentRecord.status}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Absent with permission">Absent with permission</option>
                          <option value="Late">Late</option>
                        </FormSelect>
                      </FormGroup>
                      
                      <FormRow>
                        <FormGroup>
                          <FormLabel>Check In Time</FormLabel>
                          <FormInput
                            type="time"
                            id="checkInTime"
                            name="checkInTime"
                            value={currentRecord.checkInTime}
                            onChange={handleInputChange}
                          />
                        </FormGroup>
                        
                        <FormGroup>
                          <FormLabel>Check Out Time</FormLabel>
                          <FormInput
                            type="time"
                            id="checkOutTime"
                            name="checkOutTime"
                            value={currentRecord.checkOutTime}
                            onChange={handleInputChange}
                          />
                        </FormGroup>
                      </FormRow>
                      
                      <FormGroup>
                        <FormLabel>Note</FormLabel>
                        <textarea
                          id="note"
                          name="note"
                          value={currentRecord.note}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows="3"
                        />
                      </FormGroup>
                    </>
                  )}

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                    <FormButton
                      type="button"
                      variant="secondary"
                      onClick={closeModal}
                    >
                      Cancel
                    </FormButton>
                    <FormButton
                      type="submit"
                      variant="success"
                    >
                      {isEditing ? 'Update' : 'Create'}
                    </FormButton>
                  </div>
                </ModernForm>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttendanceManager;