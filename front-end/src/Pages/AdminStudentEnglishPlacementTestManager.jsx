import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AdminStudentEnglishPlacementTestManager = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [formData, setFormData] = useState({
    testId: '',
    studentId: '',
    testDate: '',
    resultLevel: '',
    resultStatus: 0 // 0 = Fail, 1 = Pass
  });

  useEffect(() => {
    fetchStudentEnglishPlacementTests();
  }, []);

  const fetchStudentEnglishPlacementTests = async () => {
    try {
      const response = await axiosInstance.get('/academic/student-english-placement-tests');
      setTests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch student english placement tests:', error);
      setError('Failed to fetch student english placement tests');
      setLoading(false);
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
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this student english placement test?');
      if (!confirmDelete) return;

      await axiosInstance.delete(`/academic/student-english-placement-tests/${testId}`);
      fetchStudentEnglishPlacementTests();
    } catch (error) {
      console.error('Failed to delete student english placement test:', error);
      setError('Failed to delete student english placement test');
    }
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Student English Placement Test Management</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Student English Placement Test Management</h1>
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
              {editingTest ? 'Edit Student English Placement Test' : 'Add New Student English Placement Test'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Test ID</label>
                <input
                  type="text"
                  name="testId"
                  value={formData.testId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                  disabled={editingTest}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Test Date</label>
                <input
                  type="date"
                  name="testDate"
                  value={formData.testDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Result Level</label>
                <input
                  type="text"
                  name="resultLevel"
                  value={formData.resultLevel}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Result Status</label>
                <select
                  name="resultStatus"
                  value={formData.resultStatus}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value={0}>Fail</option>
                  <option value={1}>Pass</option>
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
                {editingTest ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left">Test ID</th>
                <th className="py-3 px-4 border-b text-left">Student ID</th>
                <th className="py-3 px-4 border-b text-left">Test Date</th>
                <th className="py-3 px-4 border-b text-left">Result Level</th>
                <th className="py-3 px-4 border-b text-left">Result Status</th>
                <th className="py-3 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.testId} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{test.testId}</td>
                  <td className="py-3 px-4 border-b">{test.studentId}</td>
                  <td className="py-3 px-4 border-b">{test.testDate}</td>
                  <td className="py-3 px-4 border-b">{test.resultLevel}</td>
                  <td className="py-3 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      test.resultStatus === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {getResultStatusText(test.resultStatus)}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(test)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(test.testId)}
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
          
          {tests.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No student english placement tests found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStudentEnglishPlacementTestManager;