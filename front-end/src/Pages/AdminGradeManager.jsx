import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormButton } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';

const AdminGradeManager = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState(null);
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
    setGradeToDelete(gradeName);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/academic/grades/${gradeToDelete}`);
      fetchGrades(); // 重新获取数据
      setError(''); // 清除错误
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Delete failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setShowConfirmDialog(false);
      setGradeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setGradeToDelete(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
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
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Grade Management</h1>
            <p className="text-gray-600">
              Manage grading system and grade definitions
            </p>
          </div>
          <FormButton
            variant="primary"
            onClick={openAddModal}
          >
            Add New Grade
          </FormButton>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(grades) && grades.length > 0 ? (
                grades.map((grade) => (
                  <tr key={grade.gradeName} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {grade.gradeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {grade.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(grade)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(grade.gradeName)}
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
                  <td colSpan="3" className="text-center py-12 bg-gray-50">
                    <p className="text-gray-500 text-lg">No grades found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {isEditing ? 'Edit Grade' : 'Add New Grade'}
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
                  <FormGroup>
                    <FormLabel required>Grade Name</FormLabel>
                    <FormInput
                      type="text"
                      id="gradeName"
                      name="gradeName"
                      value={currentGrade.gradeName}
                      onChange={handleInputChange}
                      required
                      disabled={isEditing}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel required>Description</FormLabel>
                    <FormInput
                      type="text"
                      id="description"
                      name="description"
                      value={currentGrade.description}
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
          title="Delete Grade"
          message="Are you sure you want to delete this grade? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default AdminGradeManager;