import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const AdminClassScheduleManager = () => {
  const [classSchedules, setClassSchedules] = useState([]);
  const [studyPlanCourses, setStudyPlanCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
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

  // 获取所有课程时间表
  const fetchClassSchedules = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/academic/class-schedules');
      setClassSchedules(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch class schedules:', err);
      setError('Failed to fetch class schedules: ' + (err.response?.data?.message || err.message));
      setClassSchedules([]);
    } finally {
      setLoading(false);
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
    fetchClassSchedules();
    fetchStudyPlanCourses();
  }, []);

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentClassSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 打开添加模态框
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

  // 打开编辑模态框
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

  // 关闭模态框
  const closeModal = () => {
    setShowModal(false);
  };

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 确保durationMinutes是整数
      const classScheduleData = {
        ...currentClassSchedule,
        durationMinutes: parseInt(currentClassSchedule.durationMinutes) || 0
      };

      if (isEditing) {
        // 更新课程时间表
        await axios.put(`/admin/academic/class-schedules/${currentClassSchedule.classScheduleId}`, classScheduleData);
      } else {
        // 创建新的课程时间表
        await axios.post('/admin/academic/class-schedules', classScheduleData);
      }
      closeModal();
      fetchClassSchedules(); // 重新获取数据
      setError('');
    } catch (err) {
      console.error('Operation failed:', err);
      setError('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // 删除课程时间表
  const handleDelete = async (classScheduleId) => {
    if (window.confirm('Are you sure you want to delete this class schedule?')) {
      try {
        await axios.delete(`/admin/academic/class-schedules/${classScheduleId}`);
        fetchClassSchedules(); // 重新获取数据
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Class Schedule Management</h1>
        <p className="text-gray-600 mb-6">
          Manage class schedule definitions
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
            Add New Class Schedule
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Schedule ID</th>
                <th className="py-2 px-4 border-b text-left">Study Plan Course</th>
                <th className="py-2 px-4 border-b text-left">Day of Week</th>
                <th className="py-2 px-4 border-b text-left">Start Time</th>
                <th className="py-2 px-4 border-b text-left">End Time</th>
                <th className="py-2 px-4 border-b text-left">Duration (min)</th>
                <th className="py-2 px-4 border-b text-left">Room</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(classSchedules) && classSchedules.length > 0 ? (
                classSchedules.map((classSchedule) => (
                  <tr key={classSchedule.classScheduleId}>
                    <td className="py-2 px-4 border-b">{classSchedule.classScheduleId}</td>
                    <td className="py-2 px-4 border-b">{classSchedule.studyPlanCourseId}</td>
                    <td className="py-2 px-4 border-b">{classSchedule.dayOfWeek}</td>
                    <td className="py-2 px-4 border-b">{classSchedule.startTime}</td>
                    <td className="py-2 px-4 border-b">{classSchedule.endTime}</td>
                    <td className="py-2 px-4 border-b">{classSchedule.durationMinutes}</td>
                    <td className="py-2 px-4 border-b">{classSchedule.room}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => openEditModal(classSchedule)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(classSchedule.classScheduleId)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No class schedules found
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
                {isEditing ? 'Edit Class Schedule' : 'Add New Class Schedule'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="classScheduleId">
                    Schedule ID
                  </label>
                  <input
                    type="text"
                    id="classScheduleId"
                    name="classScheduleId"
                    value={currentClassSchedule.classScheduleId}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    disabled={isEditing}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studyPlanCourseId">
                    Study Plan Course
                  </label>
                  <select
                    id="studyPlanCourseId"
                    name="studyPlanCourseId"
                    value={currentClassSchedule.studyPlanCourseId}
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dayOfWeek">
                    Day of Week
                  </label>
                  <select
                    id="dayOfWeek"
                    name="dayOfWeek"
                    value={currentClassSchedule.dayOfWeek}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={currentClassSchedule.startTime}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={currentClassSchedule.endTime}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="durationMinutes">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    id="durationMinutes"
                    name="durationMinutes"
                    value={currentClassSchedule.durationMinutes}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="room">
                    Room
                  </label>
                  <input
                    type="text"
                    id="room"
                    name="room"
                    value={currentClassSchedule.room}
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

export default AdminClassScheduleManager;