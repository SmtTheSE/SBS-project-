import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AdminSemesterManager = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [formData, setFormData] = useState({
    semesterId: '',
    year: '',
    intakeMonth: '',
    term: ''
  });

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await axiosInstance.get('/academic/semesters');
      // Ensure we're working with an array
      if (Array.isArray(response.data)) {
        setSemesters(response.data);
      } else {
        console.error('Unexpected response format for semesters:', response.data);
        setSemesters([]);
        setError('Unexpected data format received for semesters');
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch semesters:', error);
      setError('Failed to fetch semesters: ' + (error.response?.data?.message || error.message));
      setSemesters([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const semesterData = {
        ...formData,
        year: formData.year ? new Date(formData.year).toISOString().split('T')[0] : null
      };

      if (editingSemester) {
        // Update existing semester
        await axiosInstance.put(`/academic/semesters/${formData.semesterId}`, semesterData);
      } else {
        // Create new semester
        await axiosInstance.post('/academic/semesters', semesterData);
      }
      
      // Reset form and refresh data
      setFormData({
        semesterId: '',
        year: '',
        intakeMonth: '',
        term: ''
      });
      setEditingSemester(null);
      setShowForm(false);
      fetchSemesters();
    } catch (error) {
      console.error('Failed to save semester:', error);
      setError('Failed to save semester: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (semester) => {
    setFormData({
      semesterId: semester.semesterId,
      year: semester.year || '',
      intakeMonth: semester.intakeMonth,
      term: semester.term
    });
    setEditingSemester(semester);
    setShowForm(true);
  };

  const handleDelete = async (semesterId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this semester?');
      if (!confirmDelete) return;

      await axiosInstance.delete(`/academic/semesters/${semesterId}`);
      fetchSemesters();
    } catch (error) {
      console.error('Failed to delete semester:', error);
      setError('Failed to delete semester: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    setFormData({
      semesterId: '',
      year: '',
      intakeMonth: '',
      term: ''
    });
    setEditingSemester(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Semester Management</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Semester Management</h1>
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
              {editingSemester ? 'Edit Semester' : 'Add New Semester'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Semester ID</label>
                <input
                  type="text"
                  name="semesterId"
                  value={formData.semesterId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                  disabled={editingSemester}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Year</label>
                <input
                  type="date"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Intake Month</label>
                <input
                  type="text"
                  name="intakeMonth"
                  value={formData.intakeMonth}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Term</label>
                <input
                  type="text"
                  name="term"
                  value={formData.term}
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
                {editingSemester ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left">Semester ID</th>
                <th className="py-3 px-4 border-b text-left">Year</th>
                <th className="py-3 px-4 border-b text-left">Intake Month</th>
                <th className="py-3 px-4 border-b text-left">Term</th>
                <th className="py-3 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(semesters) && semesters.map((semester) => (
                <tr key={semester.semesterId} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{semester.semesterId}</td>
                  <td className="py-3 px-4 border-b">{semester.year}</td>
                  <td className="py-3 px-4 border-b">{semester.intakeMonth}</td>
                  <td className="py-3 px-4 border-b">{semester.term}</td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(semester)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(semester.semesterId)}
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
          
          {(!Array.isArray(semesters) || semesters.length === 0) && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No semesters found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSemesterManager;