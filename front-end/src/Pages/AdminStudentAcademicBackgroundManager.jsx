import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AdminStudentAcademicBackgroundManager = () => {
  const [backgrounds, setBackgrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBackground, setEditingBackground] = useState(null);
  const [formData, setFormData] = useState({
    backgroundId: '',
    studentId: '',
    highestQualification: '',
    institutionName: '',
    englishQualification: '',
    englishScore: '',
    requiredForPlacementTest: false,
    documentUrl: ''
  });

  useEffect(() => {
    fetchStudentAcademicBackgrounds();
  }, []);

  const fetchStudentAcademicBackgrounds = async () => {
    try {
      const response = await axiosInstance.get('/academic/student-academic-backgrounds');
      setBackgrounds(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch student academic backgrounds:', error);
      setError('Failed to fetch student academic backgrounds');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBackground) {
        // Update existing record
        await axiosInstance.put(`/academic/student-academic-backgrounds/${formData.backgroundId}`, formData);
      } else {
        // Create new record
        await axiosInstance.post('/academic/student-academic-backgrounds', formData);
      }
      
      // Reset form and refresh data
      setFormData({
        backgroundId: '',
        studentId: '',
        highestQualification: '',
        institutionName: '',
        englishQualification: '',
        englishScore: '',
        requiredForPlacementTest: false,
        documentUrl: ''
      });
      setEditingBackground(null);
      setShowForm(false);
      fetchStudentAcademicBackgrounds();
    } catch (error) {
      console.error('Failed to save student academic background:', error);
      setError('Failed to save student academic background');
    }
  };

  const handleEdit = (background) => {
    setFormData({
      backgroundId: background.backgroundId,
      studentId: background.studentId || '',
      highestQualification: background.highestQualification,
      institutionName: background.institutionName,
      englishQualification: background.englishQualification || '',
      englishScore: background.englishScore || '',
      requiredForPlacementTest: background.requiredForPlacementTest,
      documentUrl: background.documentUrl || ''
    });
    setEditingBackground(background);
    setShowForm(true);
  };

  const handleDelete = async (backgroundId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this student academic background?');
      if (!confirmDelete) return;

      await axiosInstance.delete(`/academic/student-academic-backgrounds/${backgroundId}`);
      fetchStudentAcademicBackgrounds();
    } catch (error) {
      console.error('Failed to delete student academic background:', error);
      setError('Failed to delete student academic background');
    }
  };

  const handleCancel = () => {
    setFormData({
      backgroundId: '',
      studentId: '',
      highestQualification: '',
      institutionName: '',
      englishQualification: '',
      englishScore: '',
      requiredForPlacementTest: false,
      documentUrl: ''
    });
    setEditingBackground(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Academic Background Management</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Student Academic Background Management</h1>
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
              {editingBackground ? 'Edit Student Academic Background' : 'Add New Student Academic Background'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Background ID</label>
                <input
                  type="text"
                  name="backgroundId"
                  value={formData.backgroundId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                  disabled={editingBackground}
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
                <label className="block text-gray-700 mb-2">Highest Qualification</label>
                <input
                  type="text"
                  name="highestQualification"
                  value={formData.highestQualification}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Institution Name</label>
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">English Qualification</label>
                <input
                  type="text"
                  name="englishQualification"
                  value={formData.englishQualification}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">English Score</label>
                <input
                  type="number"
                  step="0.01"
                  name="englishScore"
                  value={formData.englishScore}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Document URL</label>
                <input
                  type="text"
                  name="documentUrl"
                  value={formData.documentUrl}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="requiredForPlacementTest"
                  checked={formData.requiredForPlacementTest}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-gray-700">Required for Placement Test</label>
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
                {editingBackground ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left">Background ID</th>
                <th className="py-3 px-4 border-b text-left">Student ID</th>
                <th className="py-3 px-4 border-b text-left">Highest Qualification</th>
                <th className="py-3 px-4 border-b text-left">Institution Name</th>
                <th className="py-3 px-4 border-b text-left">English Qualification</th>
                <th className="py-3 px-4 border-b text-left">English Score</th>
                <th className="py-3 px-4 border-b text-left">Required for Placement Test</th>
                <th className="py-3 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {backgrounds.map((background) => (
                <tr key={background.backgroundId} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{background.backgroundId}</td>
                  <td className="py-3 px-4 border-b">{background.studentId}</td>
                  <td className="py-3 px-4 border-b">{background.highestQualification}</td>
                  <td className="py-3 px-4 border-b">{background.institutionName}</td>
                  <td className="py-3 px-4 border-b">{background.englishQualification || 'N/A'}</td>
                  <td className="py-3 px-4 border-b">{background.englishScore || 'N/A'}</td>
                  <td className="py-3 px-4 border-b">
                    {background.requiredForPlacementTest ? 'Yes' : 'No'}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(background)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(background.backgroundId)}
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
          
          {backgrounds.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No student academic backgrounds found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStudentAcademicBackgroundManager;