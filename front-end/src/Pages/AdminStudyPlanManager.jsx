import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Edit, Trash2 } from 'lucide-react';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormButton } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';

const AdminStudyPlanManager = () => {
  const [studyPlans, setStudyPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [studyPlanToDelete, setStudyPlanToDelete] = useState(null);
  const [editingStudyPlan, setEditingStudyPlan] = useState(null);
  const [formData, setFormData] = useState({
    studyPlanId: '',
    pathwayName: '',
    totalCreditPoint: 0,
    majorName: ''
  });

  useEffect(() => {
    fetchStudyPlans();
  }, []);

  const fetchStudyPlans = async () => {
    try {
      const response = await axiosInstance.get('/academic/study-plans');
      setStudyPlans(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch study plans:', error);
      setError('Failed to fetch study plans');
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
      if (editingStudyPlan) {
        // Update existing record
        await axiosInstance.put(`/academic/study-plans/${formData.studyPlanId}`, formData);
      } else {
        // Create new record
        await axiosInstance.post('/academic/study-plans', formData);
      }

      // Reset form and refresh dataset
      setFormData({
        studyPlanId: '',
        pathwayName: '',
        totalCreditPoint: 0,
        majorName: ''
      });
      setEditingStudyPlan(null);
      closeModal();
      fetchStudyPlans();
    } catch (error) {
      console.error('Failed to save study plan:', error);
      setError('Failed to save study plan');
    }
  };

  const openAddModal = () => {
    setFormData({
      studyPlanId: '',
      pathwayName: '',
      totalCreditPoint: 0,
      majorName: ''
    });
    setEditingStudyPlan(null);
    setShowModal(true);
  };

  const openEditModal = (studyPlan) => {
    setFormData({
      studyPlanId: studyPlan.studyPlanId,
      pathwayName: studyPlan.pathwayName,
      totalCreditPoint: studyPlan.totalCreditPoint,
      majorName: studyPlan.majorName
    });
    setEditingStudyPlan(studyPlan);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (studyPlanId) => {
    setStudyPlanToDelete(studyPlanId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/academic/study-plans/${studyPlanToDelete}`);
      fetchStudyPlans();
    } catch (error) {
      console.error('Failed to delete study plan:', error);
      setError('Failed to delete study plan');
    } finally {
      setShowConfirmDialog(false);
      setStudyPlanToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setStudyPlanToDelete(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Study Plan Management</h1>
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
            <h1 className="text-3xl font-bold text-gray-800">Study Plan Management</h1>
            <p className="text-gray-600">
              Manage study plans and academic pathways
            </p>
          </div>
          <FormButton
            variant="primary"
            onClick={openAddModal}
          >
            Add New Study Plan
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
                  Study Plan ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pathway Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Credit Point
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Major Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studyPlans.map((studyPlan) => (
                <tr key={studyPlan.studyPlanId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {studyPlan.studyPlanId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {studyPlan.pathwayName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {studyPlan.totalCreditPoint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {studyPlan.majorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditModal(studyPlan)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(studyPlan.studyPlanId)}
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {studyPlans.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No study plans found</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {editingStudyPlan ? 'Edit Study Plan' : 'Add New Study Plan'}
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
                    <FormLabel required>Study Plan ID</FormLabel>
                    <FormInput
                      type="text"
                      name="studyPlanId"
                      value={formData.studyPlanId}
                      onChange={handleInputChange}
                      required
                      disabled={editingStudyPlan}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel required>Pathway Name</FormLabel>
                    <FormInput
                      type="text"
                      name="pathwayName"
                      value={formData.pathwayName}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel required>Total Credit Point</FormLabel>
                      <FormInput
                        type="number"
                        name="totalCreditPoint"
                        value={formData.totalCreditPoint}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>Major Name</FormLabel>
                      <FormInput
                        type="text"
                        name="majorName"
                        value={formData.majorName}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                  </FormRow>
                  
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
                      {editingStudyPlan ? 'Update' : 'Create'}
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
          title="Delete Study Plan"
          message="Are you sure you want to delete this study plan? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default AdminStudyPlanManager;