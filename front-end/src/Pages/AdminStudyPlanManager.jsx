import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AdminStudyPlanManager = () => {
  const [studyPlans, setStudyPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
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
      
      // Reset form and refresh data
      setFormData({
        studyPlanId: '',
        pathwayName: '',
        totalCreditPoint: 0,
        majorName: ''
      });
      setEditingStudyPlan(null);
      setShowForm(false);
      fetchStudyPlans();
    } catch (error) {
      console.error('Failed to save study plan:', error);
      setError('Failed to save study plan');
    }
  };

  const handleEdit = (studyPlan) => {
    setFormData({
      studyPlanId: studyPlan.studyPlanId,
      pathwayName: studyPlan.pathwayName,
      totalCreditPoint: studyPlan.totalCreditPoint,
      majorName: studyPlan.majorName
    });
    setEditingStudyPlan(studyPlan);
    setShowForm(true);
  };

  const handleDelete = async (studyPlanId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this study plan?');
      if (!confirmDelete) return;

      await axiosInstance.delete(`/academic/study-plans/${studyPlanId}`);
      fetchStudyPlans();
    } catch (error) {
      console.error('Failed to delete study plan:', error);
      setError('Failed to delete study plan');
    }
  };

  const handleCancel = () => {
    setFormData({
      studyPlanId: '',
      pathwayName: '',
      totalCreditPoint: 0,
      majorName: ''
    });
    setEditingStudyPlan(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Study Plan Management</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Study Plan Management</h1>
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
              {editingStudyPlan ? 'Edit Study Plan' : 'Add New Study Plan'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Study Plan ID</label>
                <input
                  type="text"
                  name="studyPlanId"
                  value={formData.studyPlanId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                  disabled={editingStudyPlan}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Pathway Name</label>
                <input
                  type="text"
                  name="pathwayName"
                  value={formData.pathwayName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Total Credit Point</label>
                <input
                  type="number"
                  name="totalCreditPoint"
                  value={formData.totalCreditPoint}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Major Name</label>
                <input
                  type="text"
                  name="majorName"
                  value={formData.majorName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
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
                {editingStudyPlan ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left">Study Plan ID</th>
                <th className="py-3 px-4 border-b text-left">Pathway Name</th>
                <th className="py-3 px-4 border-b text-left">Total Credit Point</th>
                <th className="py-3 px-4 border-b text-left">Major Name</th>
                <th className="py-3 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studyPlans.map((studyPlan) => (
                <tr key={studyPlan.studyPlanId} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{studyPlan.studyPlanId}</td>
                  <td className="py-3 px-4 border-b">{studyPlan.pathwayName}</td>
                  <td className="py-3 px-4 border-b">{studyPlan.totalCreditPoint}</td>
                  <td className="py-3 px-4 border-b">{studyPlan.majorName}</td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(studyPlan)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(studyPlan.studyPlanId)}
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
          
          {studyPlans.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No study plans found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStudyPlanManager;