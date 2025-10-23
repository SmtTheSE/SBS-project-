import React, { useState, useEffect, useMemo } from 'react';
import axios from '../api/axios';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';
import { Search, Filter } from 'lucide-react';

const AdminEnrollmentManager = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [studyPlanCourses, setStudyPlanCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEnrollment, setCurrentEnrollment] = useState({
    id: null,
    studentId: '',
    studyPlanCourseId: '',
    enrollmentStatus: 1,
    completionStatus: 'In Progress',
    exemptionStatus: false
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [enrollmentIdToDelete, setEnrollmentIdToDelete] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    student: '',
    studyPlanCourse: '',
    enrollmentStatus: '',
    completionStatus: ''
  });

  // 添加分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 获取学生姓名
  const getStudentName = (studentId) => {
    const student = students.find(s => s.studentId === studentId);
    return student ? `${student.firstName} ${student.lastName}` : studentId;
  };

  // Filtered enrollments based on search and filters
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter(enrollment => {
      // Apply search term
      const matchesSearch = !searchTerm || 
        enrollment.id.toString().includes(searchTerm) ||
        enrollment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStudentName(enrollment.studentId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.studyPlanCourseId.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply filters
      const matchesStudent = !filters.student || 
        enrollment.studentId.toLowerCase().includes(filters.student.toLowerCase()) ||
        getStudentName(enrollment.studentId).toLowerCase().includes(filters.student.toLowerCase());
      const matchesStudyPlanCourse = !filters.studyPlanCourse || 
        enrollment.studyPlanCourseId.toLowerCase().includes(filters.studyPlanCourse.toLowerCase());
      const matchesEnrollmentStatus = !filters.enrollmentStatus || 
        enrollment.enrollmentStatus.toString() === filters.enrollmentStatus;
      const matchesCompletionStatus = !filters.completionStatus || 
        enrollment.completionStatus === filters.completionStatus;
      
      return matchesSearch && matchesStudent && matchesStudyPlanCourse && matchesEnrollmentStatus && matchesCompletionStatus;
    });
  }, [enrollments, searchTerm, filters, students]);

  // 获取当前页面的注册数据
  const getCurrentEnrollments = () => {
    const indexOfLastEnrollment = currentPage * itemsPerPage;
    const indexOfFirstEnrollment = indexOfLastEnrollment - itemsPerPage;
    return Array.isArray(filteredEnrollments) ? filteredEnrollments.slice(indexOfFirstEnrollment, indexOfLastEnrollment) : [];
  };

  // 分页控制函数
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    const totalItems = Array.isArray(filteredEnrollments) ? filteredEnrollments.length : 0;
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
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

  // 获取所有学生选课记录
  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/academic/student-enrollments');
      setEnrollments(response.data);
      setError('');
      // 添加新记录后返回第一页
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to fetch student enrollments:', err);
      setError('Failed to fetch student enrollments: ' + (err.response?.data?.message || err.message));
      setEnrollments([]);
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

  useEffect(() => {
    fetchEnrollments();
    fetchStudents();
    fetchStudyPlanCourses();
  }, []);

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentEnrollment(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 打开添加模态框
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentEnrollment({
      id: null,
      studentId: '',
      studyPlanCourseId: '',
      enrollmentStatus: 1,
      completionStatus: 'In Progress',
      exemptionStatus: false
    });
    setShowModal(true);
  };

  // 打开编辑模态框
  const openEditModal = (enrollment) => {
    setIsEditing(true);
    setCurrentEnrollment({
      id: enrollment.id,
      studentId: enrollment.studentId,
      studyPlanCourseId: enrollment.studyPlanCourseId,
      enrollmentStatus: enrollment.enrollmentStatus,
      completionStatus: enrollment.completionStatus,
      exemptionStatus: enrollment.exemptionStatus
    });
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
      const enrollmentData = { ...currentEnrollment };

      if (isEditing) {
        // 更新学生选课记录
        await axios.put(`/admin/academic/student-enrollments/${currentEnrollment.id}`, enrollmentData);
      } else {
        // 创建新的学生选课记录
        await axios.post('/admin/academic/student-enrollments', enrollmentData);
      }
      closeModal();
      fetchEnrollments(); // 重新获取数据
      setError('');
    } catch (err) {
      console.error('Operation failed:', err);
      setError('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // 删除学生选课记录
  const handleDelete = async (id) => {
    setEnrollmentIdToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/admin/academic/student-enrollments/${enrollmentIdToDelete}`);
      fetchEnrollments(); // 重新获取数据
      setError('');
      // 删除记录后检查当前页是否为空
      const totalItems = filteredEnrollments.length - 1; // 删除后的总数
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Delete failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setShowConfirmDialog(false);
      setEnrollmentIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setEnrollmentIdToDelete(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      student: '',
      studyPlanCourse: '',
      enrollmentStatus: '',
      completionStatus: ''
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
    if (filters.student) filtersList.push({ key: 'student', label: `Student: ${filters.student}` });
    if (filters.studyPlanCourse) filtersList.push({ key: 'studyPlanCourse', label: `Course: ${filters.studyPlanCourse}` });
    if (filters.enrollmentStatus) filtersList.push({ key: 'enrollmentStatus', label: `Enrollment: ${filters.enrollmentStatus === '1' ? 'Qualified' : 'Not Qualified'}` });
    if (filters.completionStatus) filtersList.push({ key: 'completionStatus', label: `Completion: ${filters.completionStatus}` });
    return filtersList;
  }, [searchTerm, filters]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Enrollment Management</h1>
          <p className="text-gray-600 mb-6">
            Manage student course enrollments
          </p>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // 获取当前页面的数据
  const currentEnrollments = getCurrentEnrollments();
  const totalPages = Math.ceil((Array.isArray(filteredEnrollments) ? filteredEnrollments.length : 0) / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Enrollment Management</h1>
            <p className="text-gray-600">
              Manage student course enrollments • Total: {filteredEnrollments.length}
            </p>
          </div>
          <FormButton
            variant="primary"
            onClick={openAddModal}
          >
            Add New Enrollment
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
                placeholder="Search by ID, Student or Course..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Filter Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="student"
                  placeholder="Filter by Student"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.student}
                  onChange={handleFilterChange}
                />
              </div>
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
            </div>

            {/* Status Filters */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <select
                  name="enrollmentStatus"
                  value={filters.enrollmentStatus}
                  onChange={handleFilterChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Enrollment Status</option>
                  <option value="1">Qualified</option>
                  <option value="0">Not Qualified</option>
                </select>
              </div>
              <div>
                <select
                  name="completionStatus"
                  value={filters.completionStatus}
                  onChange={handleFilterChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Completion Status</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Retake">Retake</option>
                </select>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 inline mr-1" />
              Clear Filters
            </button>
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

        {/* Table */}
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
                  Enrollment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exemption Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(currentEnrollments) && currentEnrollments.length > 0 ? (
                currentEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {enrollment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.studentId} - {getStudentName(enrollment.studentId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.studyPlanCourseId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.enrollmentStatus === 1 ? 'Qualified' : 'Not Qualified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.completionStatus}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.exemptionStatus ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(enrollment)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(enrollment.id)}
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
                  <td colSpan="7" className="text-center py-12 bg-gray-50">
                    <p className="text-gray-500 text-lg">No student enrollments found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {Array.isArray(filteredEnrollments) && filteredEnrollments.length === 0 && searchTerm && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No student enrollments match your search criteria</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {Array.isArray(filteredEnrollments) && filteredEnrollments.length > itemsPerPage && (
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
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {isEditing ? 'Edit Student Enrollment' : 'Add New Student Enrollment'}
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
                  {!isEditing && (
                    <FormGroup>
                      <FormLabel>ID</FormLabel>
                      <FormInput
                        type="text"
                        id="id"
                        name="id"
                        value={currentEnrollment.id || ''}
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
                      value={currentEnrollment.studentId}
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
                      value={currentEnrollment.studyPlanCourseId}
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
                    <FormLabel required>Enrollment Status</FormLabel>
                    <FormSelect
                      id="enrollmentStatus"
                      name="enrollmentStatus"
                      value={currentEnrollment.enrollmentStatus}
                      onChange={handleInputChange}
                      required
                    >
                      <option value={1}>Qualified</option>
                      <option value={0}>Not Qualified</option>
                    </FormSelect>
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel required>Completion Status</FormLabel>
                    <FormSelect
                      id="completionStatus"
                      name="completionStatus"
                      value={currentEnrollment.completionStatus}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Retake">Retake</option>
                    </FormSelect>
                  </FormGroup>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="exemptionStatus"
                      name="exemptionStatus"
                      checked={currentEnrollment.exemptionStatus}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="exemptionStatus" className="ml-2 block text-sm text-gray-700">
                      Exempt from course requirements
                    </label>
                  </div>

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
          title="Delete Student Enrollment"
          message="Are you sure you want to delete this student enrollment? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default AdminEnrollmentManager;