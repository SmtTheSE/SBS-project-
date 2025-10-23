import React, { useState, useEffect, useMemo } from 'react';
import axios from '../api/axios';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';
import { Search, Filter } from 'lucide-react';

const AdminCourseResultManager = () => {
  const [courseResults, setCourseResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [studyPlanCourses, setStudyPlanCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseResult, setCurrentCourseResult] = useState({
    id: null,
    studentId: '',
    studyPlanCourseId: '',
    gradeName: '',
    creditsEarned: 0
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [courseResultIdToDelete, setCourseResultIdToDelete] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    student: '',
    studyPlanCourse: '',
    grade: ''
  });

  // 添加分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 获取学生姓名
  const getStudentName = (studentId) => {
    const student = students.find(s => s.studentId === studentId);
    return student ? `${student.firstName} ${student.lastName}` : studentId;
  };

  // Filtered course results based on search and filters
  const filteredCourseResults = useMemo(() => {
    return courseResults.filter(courseResult => {
      // Apply search term
      const matchesSearch = !searchTerm || 
        courseResult.id.toString().includes(searchTerm) ||
        courseResult.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStudentName(courseResult.studentId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseResult.studyPlanCourseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseResult.gradeName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply filters
      const matchesStudent = !filters.student || 
        courseResult.studentId.toLowerCase().includes(filters.student.toLowerCase()) ||
        getStudentName(courseResult.studentId).toLowerCase().includes(filters.student.toLowerCase());
      const matchesStudyPlanCourse = !filters.studyPlanCourse || 
        courseResult.studyPlanCourseId.toLowerCase().includes(filters.studyPlanCourse.toLowerCase());
      const matchesGrade = !filters.grade || 
        courseResult.gradeName.toLowerCase().includes(filters.grade.toLowerCase());
      
      return matchesSearch && matchesStudent && matchesStudyPlanCourse && matchesGrade;
    });
  }, [courseResults, searchTerm, filters, students]);

  // 获取当前页面的课程结果数据
  const getCurrentCourseResults = () => {
    const indexOfLastResult = currentPage * itemsPerPage;
    const indexOfFirstResult = indexOfLastResult - itemsPerPage;
    return Array.isArray(filteredCourseResults) ? filteredCourseResults.slice(indexOfFirstResult, indexOfLastResult) : [];
  };

  // 计算总页数
  const totalPages = Math.ceil((Array.isArray(filteredCourseResults) ? filteredCourseResults.length : 0) / itemsPerPage);

  // 获取当前页面的数据
  const currentCourseResults = getCurrentCourseResults();

  // 分页控制函数
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    const totalItems = Array.isArray(filteredCourseResults) ? filteredCourseResults.length : 0;
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

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      student: '',
      studyPlanCourse: '',
      grade: ''
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
    if (filters.grade) filtersList.push({ key: 'grade', label: `Grade: ${filters.grade}` });
    return filtersList;
  }, [searchTerm, filters]);

  const fetchCourseResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/academic/course-results');
      setCourseResults(response.data);
      setError('');
      // 添加新记录后返回第一页
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to fetch course results:', err);
      setError('Failed to fetch course results: ' + (err.response?.data?.message || err.message));
      setCourseResults([]);
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


  const fetchGrades = async () => {
    try {
      const response = await axios.get('/academic/grades');
      setGrades(response.data);
    } catch (err) {
      console.error('Failed to fetch grades:', err);
    }
  };

  useEffect(() => {
    fetchCourseResults();
    fetchStudents();
    fetchStudyPlanCourses();
    fetchGrades();
  }, []);

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCourseResult(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const openAddModal = () => {
    setIsEditing(false);
    setCurrentCourseResult({
      id: null,
      studentId: '',
      studyPlanCourseId: '',
      gradeName: '',
      creditsEarned: 0
    });
    setShowModal(true);
  };

  // 打开编辑模态框
  const openEditModal = (courseResult) => {
    setIsEditing(true);
    setCurrentCourseResult({
      id: courseResult.id,
      studentId: courseResult.studentId,
      studyPlanCourseId: courseResult.studyPlanCourseId,
      gradeName: courseResult.gradeName,
      creditsEarned: courseResult.creditsEarned
    });
    setShowModal(true);
  };


  const closeModal = () => {
    setShowModal(false);
  };

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseResultData = { ...currentCourseResult };

      if (isEditing) {
        // 更新课程成绩记录
        await axios.put(`/admin/academic/course-results/${currentCourseResult.id}`, courseResultData);
      } else {
        // 创建新的课程成绩记录
        await axios.post('/admin/academic/course-results', courseResultData);
      }
      closeModal();
      fetchCourseResults(); // 重新获取数据
      setError('');
    } catch (err) {
      console.error('Operation failed:', err);
      setError('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // 删除课程成绩记录
  const handleDelete = async (id) => {
    setCourseResultIdToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/admin/academic/course-results/${courseResultIdToDelete}`);
      fetchCourseResults(); // 重新获取数据
      setError('');
      // 删除记录后检查当前页是否为空
      const totalItems = filteredCourseResults.length - 1; // 删除后的总数
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Delete failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setShowConfirmDialog(false);
      setCourseResultIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setCourseResultIdToDelete(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Course Result Management</h1>
          <p className="text-gray-600 mb-6">
            Manage student course results and grades
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Course Result Management</h1>
            <p className="text-gray-600">
              Manage student course results and grades • Total: {filteredCourseResults.length}
            </p>
          </div>
          <FormButton
            variant="primary"
            onClick={openAddModal}
          >
            Add New Course Result
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
                placeholder="Search by ID, Student, Course or Grade..."
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
              <div>
                <input
                  type="text"
                  name="grade"
                  placeholder="Filter by Grade"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.grade}
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
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits Earned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(currentCourseResults) && currentCourseResults.length > 0 ? (
                currentCourseResults.map((courseResult) => (
                  <tr key={courseResult.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {courseResult.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {courseResult.studentId} - {getStudentName(courseResult.studentId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {courseResult.studyPlanCourseId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {courseResult.gradeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {courseResult.creditsEarned}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(courseResult)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(courseResult.id)}
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
                  <td colSpan="6" className="text-center py-12 bg-gray-50">
                    <p className="text-gray-500 text-lg">No course results found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {Array.isArray(filteredCourseResults) && filteredCourseResults.length === 0 && searchTerm && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No course results match your search criteria</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {Array.isArray(filteredCourseResults) && filteredCourseResults.length > itemsPerPage && (
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
                    {isEditing ? 'Edit Course Result' : 'Add New Course Result'}
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
                        value={currentCourseResult.id || ''}
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
                      value={currentCourseResult.studentId}
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
                      value={currentCourseResult.studyPlanCourseId}
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
                    <FormLabel required>Grade</FormLabel>
                    <FormSelect
                      id="gradeName"
                      name="gradeName"
                      value={currentCourseResult.gradeName}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a Grade</option>
                      {grades.map(grade => (
                        <option key={grade.gradeName} value={grade.gradeName}>
                          {grade.gradeName} - {grade.description}
                        </option>
                      ))}
                    </FormSelect>
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel required>Credits Earned</FormLabel>
                    <FormInput
                      type="number"
                      id="creditsEarned"
                      name="creditsEarned"
                      value={currentCourseResult.creditsEarned}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

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
          title="Delete Course Result"
          message="Are you sure you want to delete this course result? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default AdminCourseResultManager;