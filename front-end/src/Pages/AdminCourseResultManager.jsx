import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

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

  // 获取所有课程成绩记录
  const fetchCourseResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/academic/course-results');
      setCourseResults(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch course results:', err);
      setError('Failed to fetch course results: ' + (err.response?.data?.message || err.message));
      setCourseResults([]);
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

  // 获取所有成绩等级（用于下拉列表）
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

  // 打开添加模态框
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

  // 关闭模态框
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
    if (window.confirm('Are you sure you want to delete this course result?')) {
      try {
        await axios.delete(`/admin/academic/course-results/${id}`);
        fetchCourseResults(); // 重新获取数据
        setError('');
      } catch (err) {
        console.error('Delete failed:', err);
        setError('Delete failed: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Course Result Management</h1>
        <p className="text-gray-600 mb-6">
          Manage student course results and grades
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end mb-4">
          <button
            onClick={openAddModal}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Course Result
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Student</th>
                <th className="py-2 px-4 border-b text-left">Study Plan Course</th>
                <th className="py-2 px-4 border-b text-left">Grade</th>
                <th className="py-2 px-4 border-b text-left">Credits Earned</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(courseResults) && courseResults.length > 0 ? (
                courseResults.map((courseResult) => (
                  <tr key={courseResult.id}>
                    <td className="py-2 px-4 border-b">{courseResult.id}</td>
                    <td className="py-2 px-4 border-b">{courseResult.studentId}</td>
                    <td className="py-2 px-4 border-b">{courseResult.studyPlanCourseId}</td>
                    <td className="py-2 px-4 border-b">{courseResult.gradeName}</td>
                    <td className="py-2 px-4 border-b">{courseResult.creditsEarned}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => openEditModal(courseResult)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(courseResult.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No course results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">
                {isEditing ? 'Edit Course Result' : 'Add New Course Result'}
              </h2>
              <form onSubmit={handleSubmit}>
                {!isEditing && (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id">
                      ID
                    </label>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      value={currentCourseResult.id || ''}
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
                    value={currentCourseResult.studentId}
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
                    value={currentCourseResult.studyPlanCourseId}
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gradeName">
                    Grade
                  </label>
                  <select
                    id="gradeName"
                    name="gradeName"
                    value={currentCourseResult.gradeName}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select a Grade</option>
                    {grades.map(grade => (
                      <option key={grade.gradeName} value={grade.gradeName}>
                        {grade.gradeName} - {grade.description}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="creditsEarned">
                    Credits Earned
                  </label>
                  <input
                    type="number"
                    id="creditsEarned"
                    name="creditsEarned"
                    value={currentCourseResult.creditsEarned}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

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

export default AdminCourseResultManager;