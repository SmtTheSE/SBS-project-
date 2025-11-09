import React, { useState, useEffect, useMemo } from 'react';
import axios from '../api/axios';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';
import { Search, Filter } from 'lucide-react';

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(''); // 'summary' or 'daily'
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [summaryFilters, setSummaryFilters] = useState({
    student: '',
    studyPlanCourse: '',
    flagLevel: ''
  });
  const [dailyFilters, setDailyFilters] = useState({
    student: '',
    classSchedule: '',
    status: ''
  });

  // 添加分页状态
  const [currentPageSummary, setCurrentPageSummary] = useState(1);
  const [currentPageDaily, setCurrentPageDaily] = useState(1);
  const [itemsPerPage] = useState(10);

  // 获取学生姓名
  const getStudentName = (studentId) => {
    const student = students.find(s => s.studentId === studentId);
    return student ? `${student.firstName} ${student.lastName}` : studentId;
  };

  // Filtered data based on search and filters
  const filteredAttendanceSummaries = useMemo(() => {
    return attendanceSummaries.filter(summary => {
      // Apply search term
      const matchesSearch = !searchTerm || 
        summary.id.toString().includes(searchTerm) ||
        summary.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStudentName(summary.studentId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        summary.studyPlanCourseId.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply filters
      const matchesStudent = !summaryFilters.student || 
        summary.studentId.toLowerCase().includes(summaryFilters.student.toLowerCase()) ||
        getStudentName(summary.studentId).toLowerCase().includes(summaryFilters.student.toLowerCase());
      const matchesStudyPlanCourse = !summaryFilters.studyPlanCourse || 
        summary.studyPlanCourseId.toLowerCase().includes(summaryFilters.studyPlanCourse.toLowerCase());
      const matchesFlagLevel = !summaryFilters.flagLevel || 
        summary.flagLevel === summaryFilters.flagLevel;
      
      return matchesSearch && matchesStudent && matchesStudyPlanCourse && matchesFlagLevel;
    });
  }, [attendanceSummaries, searchTerm, summaryFilters, students]);

  const filteredDailyAttendances = useMemo(() => {
    return dailyAttendances.filter(attendance => {
      // Apply search term
      const matchesSearch = !searchTerm || 
        attendance.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStudentName(attendance.studentId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendance.classScheduleId.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply filters
      const matchesStudent = !dailyFilters.student || 
        attendance.studentId.toLowerCase().includes(dailyFilters.student.toLowerCase()) ||
        getStudentName(attendance.studentId).toLowerCase().includes(dailyFilters.student.toLowerCase());
      const matchesClassSchedule = !dailyFilters.classSchedule || 
        attendance.classScheduleId.toLowerCase().includes(dailyFilters.classSchedule.toLowerCase());
      const matchesStatus = !dailyFilters.status || 
        attendance.status === dailyFilters.status;
      
      return matchesSearch && matchesStudent && matchesClassSchedule && matchesStatus;
    });
  }, [dailyAttendances, searchTerm, dailyFilters, students]);

  // 获取当前页面的考勤汇总数据
  const getCurrentAttendanceSummaries = () => {
    const indexOfLastRecord = currentPageSummary * itemsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
    return Array.isArray(filteredAttendanceSummaries) ? filteredAttendanceSummaries.slice(indexOfFirstRecord, indexOfLastRecord) : [];
  };

  // 获取当前页面的日常考勤数据
  const getCurrentDailyAttendances = () => {
    const indexOfLastRecord = currentPageDaily * itemsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
    return Array.isArray(filteredDailyAttendances) ? filteredDailyAttendances.slice(indexOfFirstRecord, indexOfLastRecord) : [];
  };

  // 考勤汇总分页控制函数
  const paginateSummary = (pageNumber) => setCurrentPageSummary(pageNumber);

  const prevPageSummary = () => {
    if (currentPageSummary > 1) setCurrentPageSummary(currentPageSummary - 1);
  };

  const nextPageSummary = () => {
    const totalItems = Array.isArray(filteredAttendanceSummaries) ? filteredAttendanceSummaries.length : 0;
    if (currentPageSummary < Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPageSummary(currentPageSummary + 1);
    }
  };

  // 日常考勤分页控制函数
  const paginateDaily = (pageNumber) => setCurrentPageDaily(pageNumber);

  const prevPageDaily = () => {
    if (currentPageDaily > 1) setCurrentPageDaily(currentPageDaily - 1);
  };

  const nextPageDaily = () => {
    const totalItems = Array.isArray(filteredDailyAttendances) ? filteredDailyAttendances.length : 0;
    if (currentPageDaily < Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPageDaily(currentPageDaily + 1);
    }
  };

  const handleSummaryFilterChange = (e) => {
    const { name, value } = e.target;
    setSummaryFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPageSummary(1);
  };

  const handleDailyFilterChange = (e) => {
    const { name, value } = e.target;
    setDailyFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPageDaily(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    if (activeTab === 'summary') {
      setSummaryFilters({
        student: '',
        studyPlanCourse: '',
        flagLevel: ''
      });
      setCurrentPageSummary(1);
    } else {
      setDailyFilters({
        student: '',
        classSchedule: '',
        status: ''
      });
      setCurrentPageDaily(1);
    }
  };

  const removeFilter = (filterKey) => {
    if (filterKey === 'search') {
      setSearchTerm('');
    } else if (activeTab === 'summary') {
      setSummaryFilters(prev => ({
        ...prev,
        [filterKey]: ''
      }));
      setCurrentPageSummary(1);
    } else {
      setDailyFilters(prev => ({
        ...prev,
        [filterKey]: ''
      }));
      setCurrentPageDaily(1);
    }
  };

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const filtersList = [];
    if (searchTerm) filtersList.push({ key: 'search', label: `Search: ${searchTerm}` });
    
    if (activeTab === 'summary') {
      if (summaryFilters.student) filtersList.push({ key: 'student', label: `Student: ${summaryFilters.student}` });
      if (summaryFilters.studyPlanCourse) filtersList.push({ key: 'studyPlanCourse', label: `Course: ${summaryFilters.studyPlanCourse}` });
      if (summaryFilters.flagLevel) filtersList.push({ key: 'flagLevel', label: `Flag: ${summaryFilters.flagLevel}` });
    } else {
      if (dailyFilters.student) filtersList.push({ key: 'student', label: `Student: ${dailyFilters.student}` });
      if (dailyFilters.classSchedule) filtersList.push({ key: 'classSchedule', label: `Schedule: ${dailyFilters.classSchedule}` });
      if (dailyFilters.status) filtersList.push({ key: 'status', label: `Status: ${dailyFilters.status}` });
    }
    
    return filtersList;
  }, [searchTerm, summaryFilters, dailyFilters, activeTab]);

  const fetchAttendanceSummaries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/academic/attendance-summaries');
      setAttendanceSummaries(response.data);
      setError('');
      // 添加新记录后返回第一页
      setCurrentPageSummary(1);
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
      // 添加新记录后返回第一页
      setCurrentPageDaily(1);
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

  // 在组件挂载时获取所有数据
  useEffect(() => {
    Promise.all([
      fetchAttendanceSummaries(),
      fetchDailyAttendances(),
      fetchStudents(),
      fetchStudyPlanCourses(),
      fetchClassSchedules()
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

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
      setRecordToDelete(record);
      setDeleteType('summary');
      setShowConfirmDialog(true);
    } else {
      setRecordToDelete(record);
      setDeleteType('daily');
      setShowConfirmDialog(true);
    }
  };

  const confirmDelete = async () => {
    try {
      if (deleteType === 'summary') {
        await axios.delete(`/admin/academic/attendance-summaries/${recordToDelete.id}`);
        fetchAttendanceSummaries();
        // 删除记录后检查当前页是否为空
        const totalItems = filteredAttendanceSummaries.length - 1; // 删除后的总数
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (currentPageSummary > totalPages && totalPages > 0) {
          setCurrentPageSummary(totalPages);
        }
      } else {
        await axios.delete(`/admin/academic/daily-attendances/${recordToDelete.studentId}/${recordToDelete.classScheduleId}`);
        fetchDailyAttendances();
        // 删除记录后检查当前页是否为空
        const totalItems = filteredDailyAttendances.length - 1; // 删除后的总数
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (currentPageDaily > totalPages && totalPages > 0) {
          setCurrentPageDaily(totalPages);
        }
      }
      setError('');
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Delete failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setShowConfirmDialog(false);
      setRecordToDelete(null);
      setDeleteType('');
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setRecordToDelete(null);
    setDeleteType('');
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

  // 获取当前页面的数据
  const currentAttendanceSummaries = getCurrentAttendanceSummaries();
  const totalSummaryPages = Math.ceil((Array.isArray(filteredAttendanceSummaries) ? filteredAttendanceSummaries.length : 0) / itemsPerPage);
  
  const currentDailyAttendances = getCurrentDailyAttendances();
  const totalDailyPages = Math.ceil((Array.isArray(filteredDailyAttendances) ? filteredDailyAttendances.length : 0) / itemsPerPage);

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

        {/* Search and Filter Section */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={activeTab === 'summary' ? "Search by ID, Student or Course..." : "Search by Student or Schedule..."}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Inputs based on active tab */}
            {activeTab === 'summary' ? (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    name="student"
                    placeholder="Filter by Student"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={summaryFilters.student}
                    onChange={handleSummaryFilterChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="studyPlanCourse"
                    placeholder="Filter by Course"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={summaryFilters.studyPlanCourse}
                    onChange={handleSummaryFilterChange}
                  />
                </div>
                <div>
                  <select
                    name="flagLevel"
                    value={summaryFilters.flagLevel}
                    onChange={handleSummaryFilterChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Flag Levels</option>
                    <option value="Low">Low</option>
                    <option value="Warning">Warning</option>
                    <option value="Good">Good</option>
                    <option value="Excellent">Excellent</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    name="student"
                    placeholder="Filter by Student"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={dailyFilters.student}
                    onChange={handleDailyFilterChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="classSchedule"
                    placeholder="Filter by Schedule"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={dailyFilters.classSchedule}
                    onChange={handleDailyFilterChange}
                  />
                </div>
                <div>
                  <select
                    name="status"
                    value={dailyFilters.status}
                    onChange={handleDailyFilterChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Absent with permission">Absent with permission</option>
                    <option value="Late">Late</option>
                  </select>
                </div>
              </div>
            )}

            {/* Clear Filters Button */}
            <div className="flex items-center">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="h-4 w-4 inline mr-1" />
                Clear Filters
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
              {activeFilters.map((filter) => (
                <span 
                  key={filter.key} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {filter.label}
                  <button
                    type="button"
                    className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                    onClick={() => removeFilter(filter.key)}
                  >
                    <span className="sr-only">Remove filter</span>
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'summary' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('summary')}
          >
            Attendance Summary ({filteredAttendanceSummaries.length})
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'daily' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('daily')}
          >
            Daily Attendance ({filteredDailyAttendances.length})
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
                {Array.isArray(currentAttendanceSummaries) && currentAttendanceSummaries.length > 0 ? (
                  currentAttendanceSummaries.map((summary) => (
                    <tr key={summary.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {summary.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {summary.studentId} - {getStudentName(summary.studentId)}
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
            
            {Array.isArray(filteredAttendanceSummaries) && filteredAttendanceSummaries.length === 0 && searchTerm && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">No attendance summaries match your search criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Attendance Summary Pagination Controls */}
        {activeTab === 'summary' && Array.isArray(filteredAttendanceSummaries) && filteredAttendanceSummaries.length > itemsPerPage && (
          <div className="flex justify-center items-center space-x-2 my-4">
            <button
              onClick={prevPageSummary}
              disabled={currentPageSummary === 1}
              className={`px-4 py-2 rounded-md ${
                currentPageSummary === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {[...Array(totalSummaryPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginateSummary(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPageSummary === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={nextPageSummary}
              disabled={currentPageSummary === totalSummaryPages}
              className={`px-4 py-2 rounded-md ${
                currentPageSummary === totalSummaryPages 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Next
            </button>
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
                {Array.isArray(currentDailyAttendances) && currentDailyAttendances.length > 0 ? (
                  currentDailyAttendances.map((attendance, index) => (
                    <tr key={`${attendance.studentId}-${attendance.classScheduleId}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {attendance.studentId} - {getStudentName(attendance.studentId)}
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
            
            {Array.isArray(filteredDailyAttendances) && filteredDailyAttendances.length === 0 && searchTerm && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">No daily attendance records match your search criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Daily Attendance Pagination Controls */}
        {activeTab === 'daily' && Array.isArray(filteredDailyAttendances) && filteredDailyAttendances.length > itemsPerPage && (
          <div className="flex justify-center items-center space-x-2 my-4">
            <button
              onClick={prevPageDaily}
              disabled={currentPageDaily === 1}
              className={`px-4 py-2 rounded-md ${
                currentPageDaily === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {[...Array(totalDailyPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginateDaily(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPageDaily === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={nextPageDaily}
              disabled={currentPageDaily === totalDailyPages}
              className={`px-4 py-2 rounded-md ${
                currentPageDaily === totalDailyPages 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Next
            </button>
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

        {/* Custom Confirm Dialog */}
        <CustomConfirmDialog
          isOpen={showConfirmDialog}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Attendance Record"
          message={`Are you sure you want to delete this ${deleteType === 'summary' ? 'attendance summary' : 'daily attendance record'}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default AdminAttendanceManager;