import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';

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
              {Array.isArray(courses) && courses.map((course) => (
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
        </div>

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