import React, { useState, useEffect, useMemo } from 'react';
import axios from '../api/axios';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';
import { Search, Filter } from 'lucide-react';

const AdminClassScheduleManager = () => {
  const [classSchedules, setClassSchedules] = useState([]);
  const [studyPlanCourses, setStudyPlanCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClassSchedule, setCurrentClassSchedule] = useState({
    classScheduleId: '',
    studyPlanCourseId: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    durationMinutes: '',
    room: ''
  });
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    studyPlanCourse: '',
    dayOfWeek: '',
    room: ''
  });

  // 添加分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filtered class schedules based on search and filters
  const filteredClassSchedules = useMemo(() => {
    return classSchedules.filter(classSchedule => {
      // Apply search term
      const matchesSearch = !searchTerm || 
        (classSchedule.classScheduleId && classSchedule.classScheduleId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (classSchedule.studyPlanCourseId && classSchedule.studyPlanCourseId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (classSchedule.room && classSchedule.room.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Apply filters
      const matchesStudyPlanCourse = !filters.studyPlanCourse || 
        (classSchedule.studyPlanCourseId && classSchedule.studyPlanCourseId.toLowerCase().includes(filters.studyPlanCourse.toLowerCase()));
      
      const matchesDayOfWeek = !filters.dayOfWeek || 
        (classSchedule.dayOfWeek && classSchedule.dayOfWeek.toLowerCase().includes(filters.dayOfWeek.toLowerCase()));
      
      const matchesRoom = !filters.room || 
        (classSchedule.room && classSchedule.room.toLowerCase().includes(filters.room.toLowerCase()));
      
      return matchesSearch && matchesStudyPlanCourse && matchesDayOfWeek && matchesRoom;
    });
  }, [classSchedules, searchTerm, filters]);

  const fetchClassSchedules = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/academic/class-schedules');
      setClassSchedules(response.data);
      setError('');
      // 添加新记录后返回第一页
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to fetch class schedules:', err);
      setError('Failed to fetch class schedules: ' + (err.response?.data?.message || err.message));
      setClassSchedules([]);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    fetchClassSchedules();
    fetchStudyPlanCourses();
  }, []);

  // 获取当前页面的数据
  const getCurrentSchedules = () => {
    const indexOfLastSchedule = currentPage * itemsPerPage;
    const indexOfFirstSchedule = indexOfLastSchedule - itemsPerPage;
    return filteredClassSchedules.slice(indexOfFirstSchedule, indexOfLastSchedule);
  };

  // 计算总页数
  const totalPages = Math.ceil(filteredClassSchedules.length / itemsPerPage);

  // 获取当前页面的数据
  const currentSchedules = getCurrentSchedules();

  // 分页控制函数
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredClassSchedules.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      studyPlanCourse: '',
      dayOfWeek: '',
      room: ''
    });
    setCurrentPage(1);
  };

  const removeFilter = (filterKey) => {
    if (filterKey === 'search') {
      setSearchTerm('');
    } else {
      setFilters(prev => ({
        ...prev,
        [filterKey]: ''
      }));
    }
    setCurrentPage(1);
  };

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const filtersList = [];
    if (searchTerm) filtersList.push({ key: 'search', label: `Search: ${searchTerm}` });
    if (filters.studyPlanCourse) filtersList.push({ key: 'studyPlanCourse', label: `Course: ${filters.studyPlanCourse}` });
    if (filters.dayOfWeek) filtersList.push({ key: 'dayOfWeek', label: `Day: ${filters.dayOfWeek}` });
    if (filters.room) filtersList.push({ key: 'room', label: `Room: ${filters.room}` });
    return filtersList;
  }, [searchTerm, filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentClassSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentClassSchedule({
      classScheduleId: '',
      studyPlanCourseId: '',
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      durationMinutes: '',
      room: ''
    });
    setShowModal(true);
  };

  const openEditModal = (classSchedule) => {
    setIsEditing(true);
    setCurrentClassSchedule({
      classScheduleId: classSchedule.classScheduleId,
      studyPlanCourseId: classSchedule.studyPlanCourseId,
      dayOfWeek: classSchedule.dayOfWeek,
      startTime: classSchedule.startTime,
      endTime: classSchedule.endTime,
      durationMinutes: classSchedule.durationMinutes,
      room: classSchedule.room
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const classScheduleData = {
        ...currentClassSchedule,
        durationMinutes: parseInt(currentClassSchedule.durationMinutes) || 0
      };

      if (isEditing) {
        await axios.put(`/admin/academic/class-schedules/${currentClassSchedule.classScheduleId}`, classScheduleData);
      } else {
        await axios.post('/admin/academic/class-schedules', classScheduleData);
      }
      closeModal();
      fetchClassSchedules();
      setError('');
    } catch (err) {
      console.error('Operation failed:', err);
      setError('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (classScheduleId) => {
    setScheduleToDelete(classScheduleId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/admin/academic/class-schedules/${scheduleToDelete}`);
      fetchClassSchedules();
      // 删除记录后检查当前页是否为空
      const totalItems = filteredClassSchedules.length - 1; // 删除后的总数
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
      setError('');
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Delete failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setShowConfirmDialog(false);
      setScheduleToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setScheduleToDelete(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Class Schedule Management</h1>
          <p className="text-gray-600 mb-6">
            Manage class schedule definitions
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
            <h1 className="text-3xl font-bold text-gray-800">Class Schedule Management</h1>
            <p className="text-gray-600">
              Manage class schedule definitions • Total: {filteredClassSchedules.length}
            </p>
          </div>
          <FormButton
            variant="primary"
            onClick={openAddModal}
          >
            Add New Class Schedule
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
                placeholder="Search by ID, Course, or Room..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Filter Inputs */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  name="studyPlanCourse"
                  placeholder="Filter by Course"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.studyPlanCourse}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <select
                  name="dayOfWeek"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.dayOfWeek}
                  onChange={handleFilterChange}
                >
                  <option value="">All Days</option>
                  <option value="Mon">Monday</option>
                  <option value="Tue">Tuesday</option>
                  <option value="Wed">Wednesday</option>
                  <option value="Thu">Thursday</option>
                  <option value="Fri">Friday</option>
                  <option value="Sat">Saturday</option>
                  <option value="Sun">Sunday</option>
                </select>
              </div>
              <div>
                <input
                  type="text"
                  name="room"
                  placeholder="Filter by Room"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.room}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

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

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Study Plan Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day of Week
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration (min)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(currentSchedules) && currentSchedules.length > 0 ? (
                currentSchedules.map((classSchedule) => (
                  <tr key={classSchedule.classScheduleId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {classSchedule.classScheduleId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classSchedule.studyPlanCourseId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classSchedule.dayOfWeek}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classSchedule.startTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classSchedule.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classSchedule.durationMinutes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classSchedule.room}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(classSchedule)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(classSchedule.classScheduleId)}
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
                    <p className="text-gray-500 text-lg">
                      {searchTerm || filters.studyPlanCourse || filters.dayOfWeek || filters.room
                        ? 'No class schedules match your search criteria'
                        : 'No class schedules found'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredClassSchedules.length > itemsPerPage && (
          <div className="flex justify-center items-center space-x-2 my-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages 
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
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {isEditing ? 'Edit Class Schedule' : 'Add New Class Schedule'}
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
                  <FormGroup>
                    <FormLabel required>Schedule ID</FormLabel>
                    <FormInput
                      type="text"
                      id="classScheduleId"
                      name="classScheduleId"
                      value={currentClassSchedule.classScheduleId}
                      onChange={handleInputChange}
                      required
                      disabled={isEditing}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel required>Study Plan Course</FormLabel>
                    <FormSelect
                      id="studyPlanCourseId"
                      name="studyPlanCourseId"
                      value={currentClassSchedule.studyPlanCourseId}
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
                  
                  <FormGroup>
                    <FormLabel required>Day of Week</FormLabel>
                    <FormSelect
                      id="dayOfWeek"
                      name="dayOfWeek"
                      value={currentClassSchedule.dayOfWeek}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a Day</option>
                      <option value="Mon">Monday</option>
                      <option value="Tue">Tuesday</option>
                      <option value="Wed">Wednesday</option>
                      <option value="Thu">Thursday</option>
                      <option value="Fri">Friday</option>
                      <option value="Sat">Saturday</option>
                      <option value="Sun">Sunday</option>
                    </FormSelect>
                  </FormGroup>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel required>Start Time</FormLabel>
                      <FormInput
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={currentClassSchedule.startTime}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>End Time</FormLabel>
                      <FormInput
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={currentClassSchedule.endTime}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel required>Duration (Minutes)</FormLabel>
                      <FormInput
                        type="number"
                        id="durationMinutes"
                        name="durationMinutes"
                        value={currentClassSchedule.durationMinutes}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>Room</FormLabel>
                      <FormInput
                        type="text"
                        id="room"
                        name="room"
                        value={currentClassSchedule.room}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                  </FormRow>

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
          title="Delete Class Schedule"
          message="Are you sure you want to delete this class schedule? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default AdminClassScheduleManager;