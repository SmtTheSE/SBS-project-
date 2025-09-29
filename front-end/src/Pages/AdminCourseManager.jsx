import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AdminCourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
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
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this course?');
      if (!confirmDelete) return;

      await axiosInstance.delete(`/academic/courses/${courseId}`);
      fetchCourses();
    } catch (error) {
      console.error('Failed to delete course:', error);
      setError('Failed to delete course: ' + (error.response?.data?.message || error.message));
    }
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
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Course Management</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showForm ? 'Cancel' : 'Add New'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold mb-4">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Course ID</label>
                <input
                  type="text"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                  disabled={editingCourse}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Course Name</label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Credit Score</label>
                <input
                  type="number"
                  name="creditScore"
                  value={formData.creditScore}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Lecturer</label>
                <select
                  name="lecturerId"
                  value={formData.lecturerId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a lecturer</option>
                  {lecturers.map((lecturer) => (
                    <option key={lecturer.lecturerId} value={lecturer.lecturerId}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editingCourse ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left">Course ID</th>
                <th className="py-3 px-4 border-b text-left">Course Name</th>
                <th className="py-3 px-4 border-b text-left">Credit Score</th>
                <th className="py-3 px-4 border-b text-left">Lecturer</th>
                <th className="py-3 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(courses) && courses.map((course) => (
                <tr key={course.courseId} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{course.courseId}</td>
                  <td className="py-3 px-4 border-b">{course.courseName}</td>
                  <td className="py-3 px-4 border-b">{course.creditScore}</td>
                  <td className="py-3 px-4 border-b">
                    {course.lecturer ? course.lecturer.name : 'N/A'}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course.courseId)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
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
      </div>
    </div>
  );
};

export default AdminCourseManager;