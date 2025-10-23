import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';
import { Search, Filter } from 'lucide-react';

const AdminCourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [lecturers, setLecturers] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    creditScore: '',
    lecturerId: ''
  });
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    courseName: '',
    lecturer: ''
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filtered courses based on search and filters
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Apply search term
      const matchesSearch = !searchTerm || 
        course.courseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.lecturer && course.lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Apply filters
      const matchesCourseName = !filters.courseName || 
        course.courseName.toLowerCase().includes(filters.courseName.toLowerCase());
      const matchesLecturer = !filters.lecturer || 
        (course.lecturer && course.lecturer.name.toLowerCase().includes(filters.lecturer.toLowerCase()));
      
      return matchesSearch && matchesCourseName && matchesLecturer;
    });
  }, [courses, searchTerm, filters]);

  useEffect(() => {
    fetchCourses();
    fetchLecturers();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('/academic/courses');
      // Ensure we're working with an array
      if (Array.isArray(response.data)) {
        setCourses(response.data);
      } else {
        console.error('Unexpected response format for courses:', response.data);
        setCourses([]);
        setError('Unexpected data format received for courses');
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setError('Failed to fetch courses: ' + (error.response?.data?.message || error.message));
      setCourses([]);
      setLoading(false);
    }
  };

  // Get current courses for pagination
  const getCurrentCourses = () => {
    const indexOfLastCourse = currentPage * itemsPerPage;
    const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
    return filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Next page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredCourses.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const fetchLecturers = async () => {
    try {
      // Fixed the endpoint path from /lecturers to /admin/lecturers
      const response = await axiosInstance.get('/admin/lecturers');
      // Ensure we're working with an array
      if (Array.isArray(response.data)) {
        setLecturers(response.data);
      } else {
        console.error('Unexpected response format for lecturers:', response.data);
        setLecturers([]);
        setError('Unexpected data format received for lecturers');
      }
    } catch (error) {
      console.error('Failed to fetch lecturers:', error);
      setError('Failed to fetch lecturers: ' + (error.response?.data?.message || error.message));
      setLecturers([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        // Update existing course
        await axiosInstance.put(`/academic/courses/${formData.courseId}`, formData);
      } else {
        // Create new course
        await axiosInstance.post('/academic/courses', formData);
      }
      
      // Reset form and refresh data
      setFormData({
        courseId: '',
        courseName: '',
        creditScore: '',
        lecturerId: ''
      });
      setEditingCourse(null);
      setShowForm(false);
      setCurrentPage(1); // Reset to first page
      fetchCourses();
    } catch (error) {
      console.error('Failed to save course:', error);
      setError('Failed to save course: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (course) => {
    setFormData({
      courseId: course.courseId,
      courseName: course.courseName,
      creditScore: course.creditScore,
      // Fixed accessing lecturerId from the correct path
      lecturerId: course.lecturer?.lecturerId || ''
    });
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    setCourseToDelete(courseId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/academic/courses/${courseToDelete}`);
      // If we're on the last page and it becomes empty, go to previous page
      const updatedCourses = courses.filter(course => course.courseId !== courseToDelete);
      const totalPages = Math.ceil((updatedCourses.length) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
      fetchCourses();
    } catch (error) {
      console.error('Failed to delete course:', error);
      setError('Failed to delete course: ' + (error.response?.data?.message || error.message));
    } finally {
      setShowConfirmDialog(false);
      setCourseToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setCourseToDelete(null);
  };

  const handleCancel = () => {
    setFormData({
      courseId: '',
      courseName: '',
      creditScore: '',
      lecturerId: ''
    });
    setEditingCourse(null);
    setShowForm(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      courseName: '',
      lecturer: ''
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
    if (filters.courseName) filtersList.push({ key: 'courseName', label: `Course: ${filters.courseName}` });
    if (filters.lecturer) filtersList.push({ key: 'lecturer', label: `Lecturer: ${filters.lecturer}` });
    return filtersList;
  }, [searchTerm, filters]);

  // Get current courses
  const currentCourses = getCurrentCourses();
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Course Management</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
          <FormButton
            variant="primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add New'}
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
                placeholder="Search by ID, Course or Lecturer..."
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
                  name="courseName"
                  placeholder="Filter by Course..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.courseName}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="lecturer"
                  placeholder="Filter by Lecturer..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.lecturer}
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

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                  </h2>
                  <button 
                    onClick={handleCancel}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <ModernForm onSubmit={handleSubmit}>
                  <FormRow>
                    <FormGroup>
                      <FormLabel required>Course ID</FormLabel>
                      <FormInput
                        type="text"
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleInputChange}
                        required
                        disabled={editingCourse}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>Course Name</FormLabel>
                      <FormInput
                        type="text"
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel required>Credit Score</FormLabel>
                      <FormInput
                        type="number"
                        name="creditScore"
                        value={formData.creditScore}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>Lecturer</FormLabel>
                      <FormSelect
                        name="lecturerId"
                        value={formData.lecturerId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a lecturer</option>
                        {lecturers.map((lecturer) => (
                          <option key={lecturer.lecturerId} value={lecturer.lecturerId}>
                            {lecturer.name}
                          </option>
                        ))}
                      </FormSelect>
                    </FormGroup>
                  </FormRow>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                    <FormButton
                      type="button"
                      variant="secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </FormButton>
                    <FormButton
                      type="submit"
                      variant="success"
                    >
                      {editingCourse ? 'Update' : 'Create'}
                    </FormButton>
                  </div>
                </ModernForm>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lecturer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(currentCourses) && currentCourses.map((course) => (
                <tr key={course.courseId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {course.courseId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.courseName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.creditScore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.lecturer ? course.lecturer.name : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(course)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(course.courseId)}
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!Array.isArray(courses) || courses.length === 0) && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No courses found</p>
            </div>
          )}
          
          {Array.isArray(filteredCourses) && filteredCourses.length === 0 && searchTerm && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No courses match your search criteria</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-1 rounded-md ${
                  currentPage === 1 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="ml-1">Previous</span>
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
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
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-1 rounded-md ${
                  currentPage === totalPages 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">Next</span>
              </button>
            </nav>
          </div>
        )}

        {/* Custom Confirm Dialog */}
        <CustomConfirmDialog
          isOpen={showConfirmDialog}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Course"
          message="Are you sure you want to delete this course? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default AdminCourseManager;