import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';

const AdminStudentEnglishPlacementTestManager = () => {
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]); // 添加学生数据状态
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null);
  const [editingTest, setEditingTest] = useState(null);
  const [formData, setFormData] = useState({
    testId: '',
    studentId: '',
    testDate: '',
    resultLevel: '',
    resultStatus: 0 // 0 = Fail, 1 = Pass
  });
  // 添加分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchStudentEnglishPlacementTests();
    fetchStudents(); // 获取学生数据
  }, []);

  const fetchStudentEnglishPlacementTests = async () => {
    try {
      const response = await axiosInstance.get('/academic/student-english-placement-tests');
      setTests(response.data);
      setLoading(false);
      // 添加新记录后返回第一页
      setCurrentPage(1);
    } catch (error) {
      console.error('Failed to fetch student english placement tests:', error);
      setError('Failed to fetch student english placement tests');
      setLoading(false);
    }
  };

  // 获取学生数据
  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get('/admin/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  // 获取学生姓名
  const getStudentName = (studentId) => {
    // 检查参数和学生列表是否有效
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

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTest) {
        // Update existing record
        await axiosInstance.put(`/academic/student-english-placement-tests/${formData.testId}`, formData);
      } else {
        // Create new record
        await axiosInstance.post('/academic/student-english-placement-tests', formData);
      }
      
      // Reset form and refresh data
      setFormData({
        testId: '',
        studentId: '',
        testDate: '',
        resultLevel: '',
        resultStatus: 0
      });
      setEditingTest(null);
      setShowForm(false);
      fetchStudentEnglishPlacementTests();
    } catch (error) {
      console.error('Failed to save student english placement test:', error);
      setError('Failed to save student english placement test');
    }
  };

  const handleEdit = (test) => {
    setFormData({
      testId: test.testId,
      studentId: test.studentId || '',
      testDate: test.testDate,
      resultLevel: test.resultLevel,
      resultStatus: test.resultStatus
    });
    setEditingTest(test);
    setShowForm(true);
  };

  const handleDelete = async (testId) => {
    setTestToDelete(testId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/academic/student-english-placement-tests/${testToDelete}`);
      fetchStudentEnglishPlacementTests();
      // 删除记录后检查当前页是否为空
      const totalItems = tests.length - 1; // 删除后的总数
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    } catch (error) {
      console.error('Failed to delete student english placement test:', error);
      setError('Failed to delete student english placement test');
    } finally {
      setShowConfirmDialog(false);
      setTestToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setTestToDelete(null);
  };

  const handleCancel = () => {
    setFormData({
      testId: '',
      studentId: '',
      testDate: '',
      resultLevel: '',
      resultStatus: 0
    });
    setEditingTest(null);
    setShowForm(false);
  };

  const getResultStatusText = (status) => {
    return status === 1 ? 'Pass' : 'Fail';
  };

  // 获取当前页面的测试数据
  const getCurrentTests = () => {
    const indexOfLastTest = currentPage * itemsPerPage;
    const indexOfFirstTest = indexOfLastTest - itemsPerPage;
    return tests.slice(indexOfFirstTest, indexOfLastTest);
  };

  // 计算总页数
  const totalPages = Math.ceil(tests.length / itemsPerPage);

  // 获取当前页面的数据
  const currentTests = getCurrentTests();

  // 分页控制函数
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(tests.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Student English Placement Test Management</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student English Placement Test Management</h1>
            <p className="text-gray-600">
              Manage student english placement tests • Total: {tests.length}
            </p>
          </div>
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
                    {editingTest ? 'Edit Student English Placement Test' : 'Add New Student English Placement Test'}
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
                      <FormLabel required>Test ID</FormLabel>
                      <FormInput
                        type="text"
                        name="testId"
                        value={formData.testId}
                        onChange={handleInputChange}
                        required
                        disabled={editingTest}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>Student ID</FormLabel>
                      <FormInput
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel required>Test Date</FormLabel>
                      <FormInput
                        type="date"
                        name="testDate"
                        value={formData.testDate}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>Result Level</FormLabel>
                      <FormInput
                        type="text"
                        name="resultLevel"
                        value={formData.resultLevel}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <FormGroup>
                    <FormLabel required>Result Status</FormLabel>
                    <FormSelect
                      name="resultStatus"
                      value={formData.resultStatus}
                      onChange={handleInputChange}
                      required
                    >
                      <option value={0}>Fail</option>
                      <option value={1}>Pass</option>
                    </FormSelect>
                  </FormGroup>
                  
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
                      {editingTest ? 'Update' : 'Create'}
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
                  Test ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTests.map((test) => (
                <tr key={test.testId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {test.testId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {test.studentId ? `${test.studentId} - ${getStudentName(test.studentId)}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {test.testDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {test.resultLevel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      test.resultStatus === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {getResultStatusText(test.resultStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(test)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(test.testId)}
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
          
          {tests.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No student english placement tests found</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {tests.length > itemsPerPage && (
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

        {/* Custom Confirm Dialog */}
        <CustomConfirmDialog
          isOpen={showConfirmDialog}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Placement Test"
          message="Are you sure you want to delete this student english placement test? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default AdminStudentEnglishPlacementTestManager;