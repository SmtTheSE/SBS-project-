import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const AdminGradeManager = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGrade, setCurrentGrade] = useState({
    gradeName: '',
    description: ''
  });

  // 获取所有成绩等级
  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/academic/grades');
      console.log('Response data:', response.data); // 调试信息
      // 确保响应数据是数组
      if (Array.isArray(response.data)) {
        // 转换实体对象为Dto对象
        const gradeDtos = response.data.map(grade => ({
          gradeName: grade.gradeName,
          description: grade.description
        }));
        setGrades(gradeDtos);
      } else {
        console.error('Response data is not an array:', response.data);
        setGrades([]);
      }
      setError('');
    } catch (err) {
      console.error('Failed to fetch grades:', err);
      setError('Failed to fetch grades: ' + (err.response?.data?.message || err.message));
      setGrades([]); // 确保即使出错也设置为空数组
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentGrade(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 打开添加模态框
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentGrade({
      gradeName: '',
      description: ''
    });
    setShowModal(true);
  };

  // 打开编辑模态框
  const openEditModal = (grade) => {
    setIsEditing(true);
    setCurrentGrade({
      gradeName: grade.gradeName,
      description: grade.description
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
      const gradeEntity = {
        gradeName: currentGrade.gradeName,
        description: currentGrade.description
      };
      
      if (isEditing) {
        // 更新成绩等级
        await axios.put(`/academic/grades/${currentGrade.gradeName}`, gradeEntity);
      } else {
        // 创建新的成绩等级
        await axios.post('/academic/grades', gradeEntity);
      }
      closeModal();
      fetchGrades(); // 重新获取数据
      setError(''); // 清除错误
    } catch (err) {
      console.error('Operation failed:', err);
      setError('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // 删除成绩等级
  const handleDelete = async (gradeName) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await axios.delete(`/academic/grades/${gradeName}`);
        fetchGrades(); // 重新获取数据
        setError(''); // 清除错误
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Grade Management</h1>
          <p className="text-gray-600 mb-6">
            Manage grading system and grade definitions
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Grade Management</h1>
        <p className="text-gray-600 mb-6">
          Manage grading system and grade definitions
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
            Add New Grade
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Grade Name</th>
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(grades) && grades.length > 0 ? (
                grades.map((grade) => (
                  <tr key={grade.gradeName}>
                    <td className="py-2 px-4 border-b">{grade.gradeName}</td>
                    <td className="py-2 px-4 border-b">{grade.description}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => openEditModal(grade)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(grade.gradeName)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No grades found
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
                {isEditing ? 'Edit Grade' : 'Add New Grade'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gradeName">
                    Grade Name
                  </label>
                  <input
                    type="text"
                    id="gradeName"
                    name="gradeName"
                    value={currentGrade.gradeName}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    disabled={isEditing}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={currentGrade.description}
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

export default AdminGradeManager;