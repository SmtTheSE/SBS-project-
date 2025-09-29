import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

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

  // 获取所有学生选课记录
  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/academic/student-enrollments');
      setEnrollments(response.data);
      setError('');
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
    if (window.confirm('Are you sure you want to delete this student enrollment?')) {
      try {
        await axios.delete(`/admin/academic/student-enrollments/${id}`);
        fetchEnrollments(); // 重新获取数据
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Enrollment Management</h1>
        <p className="text-gray-600 mb-6">
          Manage student course enrollments
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
            Add New Enrollment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Student</th>
                <th className="py-2 px-4 border-b text-left">Study Plan Course</th>
                <th className="py-2 px-4 border-b text-left">Enrollment Status</th>
                <th className="py-2 px-4 border-b text-left">Completion Status</th>
                <th className="py-2 px-4 border-b text-left">Exemption Status</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(enrollments) && enrollments.length > 0 ? (
                enrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td className="py-2 px-4 border-b">{enrollment.id}</td>
                    <td className="py-2 px-4 border-b">{enrollment.studentId}</td>
                    <td className="py-2 px-4 border-b">{enrollment.studyPlanCourseId}</td>
                    <td className="py-2 px-4 border-b">
                      {enrollment.enrollmentStatus === 1 ? 'Qualified' : 'Not Qualified'}
                    </td>
                    <td className="py-2 px-4 border-b">{enrollment.completionStatus}</td>
                    <td className="py-2 px-4 border-b">
                      {enrollment.exemptionStatus ? 'Yes' : 'No'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => openEditModal(enrollment)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(enrollment.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No student enrollments found
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
                {isEditing ? 'Edit Student Enrollment' : 'Add New Student Enrollment'}
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
                      value={currentEnrollment.id || ''}
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
                    value={currentEnrollment.studentId}
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
                    value={currentEnrollment.studyPlanCourseId}
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="enrollmentStatus">
                    Enrollment Status
                  </label>
                  <select
                    id="enrollmentStatus"
                    name="enrollmentStatus"
                    value={currentEnrollment.enrollmentStatus}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value={1}>Qualified</option>
                    <option value={0}>Not Qualified</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="completionStatus">
                    Completion Status
                  </label>
                  <select
                    id="completionStatus"
                    name="completionStatus"
                    value={currentEnrollment.completionStatus}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Retake">Retake</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="exemptionStatus">
                    Exemption Status
                  </label>
                  <input
                    type="checkbox"
                    id="exemptionStatus"
                    name="exemptionStatus"
                    checked={currentEnrollment.exemptionStatus}
                    onChange={handleInputChange}
                    className="mr-2 leading-tight"
                  />
                  <span>Exempt from course requirements</span>
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

export default AdminEnrollmentManager;