import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormButton } from '../Components/ModernForm';

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
      const response = await axiosInstance.get('/admin/academic/student-academic-backgrounds');
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
        console.log('Updating with data:', formData);
        console.log('Background ID for update:', formData.backgroundId);
        // Trim all form data to remove any whitespace characters
        const trimmedFormData = {
          backgroundId: formData.backgroundId?.trim(),
          studentId: formData.studentId?.trim(),
          highestQualification: formData.highestQualification?.trim(),
          institutionName: formData.institutionName?.trim(),
          englishQualification: formData.englishQualification?.trim(),
          englishScore: formData.englishScore,
          requiredForPlacementTest: formData.requiredForPlacementTest,
          documentUrl: formData.documentUrl?.trim()
        };
        console.log('Trimmed background ID:', trimmedFormData.backgroundId);
        console.log('Trimmed background ID length:', trimmedFormData.backgroundId.length);
        console.log('Sending PUT request to:', `/admin/academic/student-academic-backgrounds/${trimmedFormData.backgroundId}`);
        
        // Log the actual request being sent
        console.log('Request payload:', trimmedFormData);
        
        const response = await axiosInstance.put(`/admin/academic/student-academic-backgrounds/${trimmedFormData.backgroundId}`, trimmedFormData);
        console.log('Update response:', response);
      } else {
        // Create new record
        await axiosInstance.post('/admin/academic/student-academic-backgrounds', formData);
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
      console.error('Request data:', formData);
      setError('Failed to save student academic background: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (background) => {
    setFormData({
      backgroundId: background.backgroundId?.trim(),
      studentId: background.studentId?.trim() || '',
      highestQualification: background.highestQualification?.trim(),
      institutionName: background.institutionName?.trim(),
      englishQualification: background.englishQualification?.trim() || '',
      englishScore: background.englishScore || '',
      requiredForPlacementTest: background.requiredForPlacementTest,
      documentUrl: background.documentUrl?.trim() || ''
    });
    setEditingBackground(background);
    setShowForm(true);
  };

  const handleDelete = async (backgroundId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this student academic background?');
      if (!confirmDelete) return;

      await axiosInstance.delete(`/admin/academic/student-academic-backgrounds/${backgroundId}`);
      fetchStudentAcademicBackgrounds();
    } catch (error) {
      console.error('Failed to delete student academic background:', error);
      setError('Failed to delete student academic background: ' + (error.response?.data?.message || error.message));
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
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Academic Background Management</h1>
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
            <h1 className="text-3xl font-bold text-gray-800">Student Academic Background Management</h1>
            <p className="text-gray-600">
              Manage student academic backgrounds • Total: {backgrounds.length}
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

        {showForm && (
          <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-bold text-blue-800 mb-4">
              {editingBackground ? 'Edit Student Academic Background' : 'Add New Student Academic Background'}
            </h2>
            
            <ModernForm onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <FormLabel required>Background ID</FormLabel>
                  <FormInput
                    type="text"
                    name="backgroundId"
                    value={formData.backgroundId}
                    onChange={handleInputChange}
                    required
                    disabled={!!editingBackground}
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
                  <FormLabel required>Highest Qualification</FormLabel>
                  <FormInput
                    type="text"
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel required>Institution Name</FormLabel>
                  <FormInput
                    type="text"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <FormLabel>English Qualification</FormLabel>
                  <FormInput
                    type="text"
                    name="englishQualification"
                    value={formData.englishQualification}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>English Score</FormLabel>
                  <FormInput
                    type="number"
                    step="0.01"
                    name="englishScore"
                    value={formData.englishScore}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <FormLabel>Document URL</FormLabel>
                <FormInput
                  type="text"
                  name="documentUrl"
                  value={formData.documentUrl}
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="requiredForPlacementTest"
                  checked={formData.requiredForPlacementTest}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Required for Placement Test
                </label>
              </div>
              
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
                  {editingBackground ? 'Update' : 'Create'}
                </FormButton>
              </div>
            </ModernForm>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Background ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Highest Qualification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institution Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  English Qualification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  English Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required for Placement Test
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backgrounds.map((background) => (
                <tr key={background.backgroundId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {background.backgroundId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {background.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {background.highestQualification}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {background.institutionName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {background.englishQualification || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {background.englishScore || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {background.requiredForPlacementTest ? 'Yes' : 'No'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(background)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(background.backgroundId)}
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