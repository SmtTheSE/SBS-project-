import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Edit, Trash2, Search, Filter } from 'lucide-react'; // Import icons
import CustomConfirmDialog from '../Components/CustomConfirmDialog';

const AdminStudentProgressSummaryManager = () => {
  const [studentProgressSummaries, setStudentProgressSummaries] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [summaryToDelete, setSummaryToDelete] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    studentId: "",
    studyPlanId: "",
    totalEnrolledCourse: 0,
    totalCompletedCourse: 0,
    totalCreditsEarned: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    student: '',
    studyPlan: ''
  });

  // 添加分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 获取学生姓名
  const getStudentName = (studentId) => {
    if (!studentId) return 'N/A';
    if (!students || students.length === 0) return studentId;
    
    const student = students.find(s => s.studentId === studentId);
    
    if (student) {
      if (student.firstName && student.lastName) {
        return `${student.firstName} ${student.lastName}`;
      } else if (student.firstName) {
        return student.firstName;
      } else if (student.lastName) {
        return student.lastName;
      } else {
        return studentId;
      }
    } else {
      return studentId;
    }
  };

  // Filtered student progress summaries based on search and filters
  const filteredSummaries = useMemo(() => {
    return studentProgressSummaries.filter(summary => {
      // Apply search term
      const matchesSearch = !searchTerm || 
        (summary.id && summary.id.toString().includes(searchTerm)) ||
        (summary.studentId && summary.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (getStudentName(summary.studentId).toLowerCase().includes(searchTerm.toLowerCase())) ||
        (summary.studyPlanId && summary.studyPlanId.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Apply filters
      const matchesStudent = !filters.student || 
        (summary.studentId && summary.studentId.toLowerCase().includes(filters.student.toLowerCase())) ||
        (getStudentName(summary.studentId).toLowerCase().includes(filters.student.toLowerCase()));
      
      const matchesStudyPlan = !filters.studyPlan || 
        (summary.studyPlanId && summary.studyPlanId.toLowerCase().includes(filters.studyPlan.toLowerCase()));
      
      return matchesSearch && matchesStudent && matchesStudyPlan;
    });
  }, [studentProgressSummaries, searchTerm, filters, students]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [
        studentProgressSummariesRes,
        studentsRes
      ] = await Promise.all([
        axiosInstance.get("/admin/academic/student-progress-summaries"),
        axiosInstance.get("/admin/students")
      ]);

      setStudentProgressSummaries(studentProgressSummariesRes.data);
      setStudents(studentsRes.data);
      // 添加新记录后返回第一页
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // 获取当前页面的数据
  const getCurrentSummaries = () => {
    const indexOfLastSummary = currentPage * itemsPerPage;
    const indexOfFirstSummary = indexOfLastSummary - itemsPerPage;
    return filteredSummaries.slice(indexOfFirstSummary, indexOfLastSummary);
  };

  // 计算总页数
  const totalPages = Math.ceil(filteredSummaries.length / itemsPerPage);

  // 获取当前页面的数据
  const currentSummaries = getCurrentSummaries();

  // 分页控制函数
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredSummaries.length / itemsPerPage)) {
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
      studyPlan: ''
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
    if (filters.studyPlan) filtersList.push({ key: 'studyPlan', label: `Study Plan: ${filters.studyPlan}` });
    return filtersList;
  }, [searchTerm, filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes("total") ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate that selected values exist
      if (!formData.studentId) {
        setError("Please select a student");
        return;
      }
      
      if (!formData.studyPlanId) {
        setError("Please enter a study plan ID");
        return;
      }
      
      if (isEditing) {
        await axiosInstance.put(`/admin/academic/student-progress-summaries/${formData.id}`, formData);
      } else {
        await axiosInstance.post("/admin/academic/student-progress-summaries", formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving student progress summary:", error);
      setError("Failed to save student progress summary: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (studentProgressSummary) => {
    setFormData(studentProgressSummary);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    setSummaryToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/admin/academic/student-progress-summaries/${summaryToDelete}`);
      fetchData();
      // 删除记录后检查当前页是否为空
      const totalItems = filteredSummaries.length - 1; // 删除后的总数
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    } catch (error) {
      console.error("Error deleting student progress summary:", error);
      setError("Failed to delete student progress summary: " + (error.response?.data?.message || error.message));
    } finally {
      setShowConfirmDialog(false);
      setSummaryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setSummaryToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      studentId: "",
      studyPlanId: "",
      totalEnrolledCourse: 0,
      totalCompletedCourse: 0,
      totalCreditsEarned: 0
    });
    setIsEditing(false);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Student Progress Summary Management</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Progress Summary Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add New Student Progress Summary
        </button>
      </div>
      
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
              placeholder="Search by ID, Student, or Study Plan..."
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
                name="studyPlan"
                placeholder="Filter by Study Plan"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={filters.studyPlan}
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Table to display student progress summaries */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Student Progress Summaries • Total: {filteredSummaries.length}</h2>
        <div className="overflow-x-auto">
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
                  Study Plan ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Enrolled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Completed
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
              {currentSummaries.length > 0 ? (
                currentSummaries.map((summary) => (
                  <tr key={summary.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {summary.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {summary.studentId ? `${summary.studentId} - ${getStudentName(summary.studentId)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {summary.studyPlanId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {summary.totalEnrolledCourse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {summary.totalCompletedCourse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {summary.totalCreditsEarned}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setFormData(summary);
                          setIsEditing(true);
                          setShowForm(true);
                        }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(summary.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12 bg-gray-50">
                    <p className="text-gray-500 text-lg">
                      {searchTerm || filters.student || filters.studyPlan
                        ? 'No student progress summaries match your search criteria'
                        : 'No student progress summaries found'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {filteredSummaries.length > itemsPerPage && (
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
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditing ? "Edit Student Progress Summary" : "Add New Student Progress Summary"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student
                  </label>
                  <select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.studentId} value={student.studentId}>
                        {student.firstName} {student.lastName} ({student.studentId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Study Plan ID
                  </label>
                  <input
                    type="text"
                    name="studyPlanId"
                    value={formData.studyPlanId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Enrolled Courses
                  </label>
                  <input
                    type="number"
                    name="totalEnrolledCourse"
                    value={formData.totalEnrolledCourse}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Completed Courses
                  </label>
                  <input
                    type="number"
                    name="totalCompletedCourse"
                    value={formData.totalCompletedCourse}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Credits Earned
                  </label>
                  <input
                    type="number"
                    name="totalCreditsEarned"
                    value={formData.totalCreditsEarned}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                    required
                  />
                </div>

                <div className="flex items-end space-x-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    {isEditing ? "Update" : "Create"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirm Dialog */}
      <CustomConfirmDialog
        isOpen={showConfirmDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Student Progress Summary"
        message="Are you sure you want to delete this student progress summary? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AdminStudentProgressSummaryManager;