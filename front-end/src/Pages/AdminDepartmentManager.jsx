import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AdminDepartmentManager = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    departmentId: '',
    departmentName: '',
    headOfDepartment: '',
    email: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axiosInstance.get('/academic/departments');
      // Ensure we're working with an array
      if (Array.isArray(response.data)) {
        setDepartments(response.data);
      } else {
        console.error('Unexpected response format for departments:', response.data);
        setDepartments([]);
        setError('Unexpected data format received for departments');
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      setError('Failed to fetch departments: ' + (error.response?.data?.message || error.message));
      setDepartments([]);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e)=> {
    e.preventDefault();
    try {
      if (editingDepartment) {
        // Update existing department
        await axiosInstance.put(`/academic/departments/${formData.departmentId}`, formData);
      } else {
        // Create new department
        await axiosInstance.post('/academic/departments', formData);
      }
      
// Reset form and refresh data
      setFormData({
        departmentId: '',
        departmentName: '',
        headOfDepartment: '',
        email: ''
      });
      setEditingDepartment(null);
      setShowForm(false);
      fetchDepartments();
    } catch (error) {
      console.error('Failed to save department:', error);
      setError('Failed to save department: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (department) => {
    setFormData({
      departmentId: department.departmentId,
      departmentName: department.departmentName,
      headOfDepartment: department.headOfDepartment || '',
      email: department.email || ''
    });
    setEditingDepartment(department);
    setShowForm(true);
  };

  const handleDelete = async (departmentId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this department?');
      if (!confirmDelete) return;

      await axiosInstance.delete(`/academic/departments/${departmentId}`);
      fetchDepartments();
    } catch (error) {
      console.error('Failed to delete department:', error);
      setError('Failed to delete department: ' + (error.response?.data?.message || error.message));
    }
 };

  const handleCancel= () => {
    setFormData({
      departmentId: '',
      departmentName: '',
      headOfDepartment: '',
      email: ''
    });
    setEditingDepartment(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Department Management</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Department Management</h1>
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
          <form onSubmit={handleSubmit} className="mb-8 p-4border rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold mb-4">
              {editingDepartment ? 'Edit Department' : 'Add New Department'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Department ID</label>
                <input
                  type="text"
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                  disabled={editingDepartment}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Department Name</label>
                <input
                  type="text"
                  name="departmentName"
                  value={formData.departmentName}
                 onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Head of Department</label>
                <input
                  type="text"
                  name="headOfDepartment"
                  value={formData.headOfDepartment}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
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
                {editingDepartment ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Head of Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(departments) && departments.map((department) => (
               <tr key={department.departmentId}>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {department.departmentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {department.departmentName}
                 </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {department.headOfDepartment || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {department.email|| 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(department)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
Edit
                    </button>
                    <button
                      onClick={() => handleDelete(department.departmentId)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!Array.isArray(departments) || departments.length === 0) && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No departments found</p>
            </div>
          )}
</div>
      </div>
    </div>
  );
};

export default AdminDepartmentManager;