import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Plus, Save, X, Edit, Trash2, Users } from 'lucide-react';

const AdminScholarshipManager = () => {
  const [scholarships, setScholarships] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentScholarships, setStudentScholarships] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignData, setAssignData] = useState({
    studentId: '',
    scholarshipId: '',
    scholarshipPercentage: 0
  });
  const [createData, setCreateData] = useState({
    scholarshipId: '',
    scholarshipType: '',
    amount: 0.0,
    description: ''
  });

  useEffect(() => {
    fetchScholarships();
    fetchStudents();
    fetchStudentScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await axiosInstance.get('/admin/scholarships');
      setScholarships(response.data);
    } catch (error) {
      console.error('Failed to fetch scholarships:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get('/admin/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const fetchStudentScholarships = async () => {
    try {
      const response = await axiosInstance.get('/admin/student-scholarships');
      setStudentScholarships(response.data);
    } catch (error) {
      console.error('Failed to fetch student scholarships:', error);
    }
  };

  const createNewScholarship = async () => {
    // Validation
    if (!createData.scholarshipId || !createData.scholarshipType) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await axiosInstance.post('/admin/scholarships', createData);
      
      alert('Scholarship created successfully!');
      
      // Reset form
      setCreateData({
        scholarshipId: '',
        scholarshipType: '',
        amount: 0.0,
        description: ''
      });
      setShowCreateForm(false);
      fetchScholarships(); // Refresh the list
    } catch (error) {
      console.error('Create error:', error);
      alert('Network error occurred while creating scholarship');
    }
  };

  const assignScholarshipToStudent = async () => {
    // Validation
    if (!assignData.studentId || !assignData.scholarshipId) {
      alert('Please select both student and scholarship');
      return;
    }

    if (assignData.scholarshipPercentage < 0 || assignData.scholarshipPercentage > 100) {
      alert('Scholarship percentage must be between 0 and 100');
      return;
    }

    try {
      const response = await axiosInstance.post('/admin/student-scholarships', assignData);
      
      alert('Scholarship assigned to student successfully!');
      
      // Reset form
      setAssignData({
        studentId: '',
        scholarshipId: '',
        scholarshipPercentage: 0
      });
      setShowAssignForm(false);
      fetchStudentScholarships(); // Refresh the list
    } catch (error) {
      console.error('Assign error:', error);
      alert('Network error occurred while assigning scholarship');
    }
  };

  const saveEdit = async () => {
    try {
      const response = await axiosInstance.put(`/admin/scholarships/${editingId}`, {
        ...editData,
        scholarshipId: editingId
      });
      
      alert('Scholarship updated successfully!');
      setEditingId(null);
      fetchScholarships(); // Refresh the list
    } catch (error) {
      console.error('Update error:', error);
      alert('Network error occurred while updating scholarship');
    }
  };

  const deleteScholarship = async (scholarshipId) => {
    if (!window.confirm('Are you sure you want to delete this scholarship?')) return;

    try {
      await axiosInstance.delete(`/admin/scholarships/${scholarshipId}`);
      
      alert('Scholarship deleted successfully!');
      fetchScholarships(); // Refresh the list
    } catch (error) {
      console.error('Delete error:', error);
      alert('Network error occurred while deleting scholarship');
    }
  };

  const deleteStudentScholarship = async (id) => {
    if (!window.confirm('Are you sure you want to remove this scholarship assignment?')) return;

    try {
      await axiosInstance.delete(`/admin/student-scholarships/${id}`);
      
      alert('Scholarship assignment removed successfully!');
      fetchStudentScholarships(); // Refresh the list
    } catch (error) {
      console.error('Delete error:', error);
      alert('Network error occurred while removing scholarship assignment');
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.studentId === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  };

  const getScholarshipType = (scholarshipId) => {
    const scholarship = scholarships.find(s => s.scholarshipId === scholarshipId);
    return scholarship ? scholarship.scholarshipType : 'Unknown Scholarship';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Panel - Scholarship Management
            </h1>
            <p className="text-gray-600">
              Manage student scholarships • Total: {scholarships.length}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowAssignForm(!showAssignForm)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md"
            >
              <Users size={20} />
              {showAssignForm ? 'Cancel Assign' : 'Assign to Student'}
            </button>
            
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
            >
              <Plus size={20} />
              {showCreateForm ? 'Cancel' : 'Create New'}
            </button>
          </div>
        </div>

        {/* Assign Scholarship to Student Form */}
        {showAssignForm && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">Assign Scholarship to Student</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Student *</label>
                <select
                  value={assignData.studentId}
                  onChange={(e) => setAssignData({...assignData, studentId: e.target.value})}
                  className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Choose a student</option>
                  {students.map(student => (
                    <option key={student.studentId} value={student.studentId}>
                      {student.studentId} - {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Scholarship *</label>
                <select
                  value={assignData.scholarshipId}
                  onChange={(e) => setAssignData({...assignData, scholarshipId: e.target.value})}
                  className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Choose a scholarship</option>
                  {scholarships.map(scholarship => (
                    <option key={scholarship.scholarshipId} value={scholarship.scholarshipId}>
                      {scholarship.scholarshipId} - {scholarship.scholarshipType}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Percentage (0-100)%</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={assignData.scholarshipPercentage}
                  onChange={(e) => setAssignData({...assignData, scholarshipPercentage: parseInt(e.target.value) || 0})}
                  className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                onClick={assignScholarshipToStudent}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
              >
                <Save size={20} />
                Assign Scholarship
              </button>

              <button
                onClick={() => {
                  setShowAssignForm(false);
                  setAssignData({
                    studentId: '',
                    scholarshipId: '',
                    scholarshipPercentage: 0
                  });
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Create New Scholarship Form */}
        {showCreateForm && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Create New Scholarship</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Scholarship ID *</label>
                  <input
                    type="text"
                    value={createData.scholarshipId}
                    onChange={(e) => setCreateData({...createData, scholarshipId: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., SCH001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Scholarship Type *</label>
                  <input
                    type="text"
                    value={createData.scholarshipType}
                    onChange={(e) => setCreateData({...createData, scholarshipType: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Merit-based"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={createData.amount}
                    onChange={(e) => setCreateData({...createData, amount: parseFloat(e.target.value) || 0.0})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1000.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={createData.description}
                    onChange={(e) => setCreateData({...createData, description: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Scholarship description"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                onClick={createNewScholarship}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
              >
                <Save size={20} />
                Create Scholarship
              </button>

              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setCreateData({
                    scholarshipId: '',
                    scholarshipType: '',
                    amount: 0.0,
                    description: ''
                  });
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Student Scholarship Assignments */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2">
            Student Scholarship Assignments ({studentScholarships.length})
          </h2>

          {studentScholarships.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No scholarships assigned to students yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Assign to Student" to assign scholarships to students</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Student</th>
                    <th className="py-2 px-4 border-b text-left">Scholarship</th>
                    <th className="py-2 px-4 border-b text-left">Percentage</th>
                    <th className="py-2 px-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentScholarships.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">
                        {getStudentName(assignment.studentId)} ({assignment.studentId})
                      </td>
                      <td className="py-2 px-4 border-b">
                        {getScholarshipType(assignment.scholarshipId)} ({assignment.scholarshipId})
                      </td>
                      <td className="py-2 px-4 border-b">{assignment.scholarshipPercentage}%</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => deleteStudentScholarship(assignment.id)}
                          className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                          title="Remove Assignment"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Existing Scholarships Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2">
            Existing Scholarships ({scholarships.length})
          </h2>

          {scholarships.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No scholarships yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Create New Scholarship" to add your first scholarship</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Scholarship ID</th>
                    <th className="py-2 px-4 border-b text-left">Type</th>
                    <th className="py-2 px-4 border-b text-left">Amount</th>
                    <th className="py-2 px-4 border-b text-left">Description</th>
                    <th className="py-2 px-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scholarships.map((scholarship) => (
                    <tr key={scholarship.scholarshipId} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{scholarship.scholarshipId}</td>
                      <td className="py-2 px-4 border-b">{scholarship.scholarshipType}</td>
                      <td className="py-2 px-4 border-b">${scholarship.amount.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{scholarship.description}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingId(scholarship.scholarshipId);
                              setEditData({
                                scholarshipType: scholarship.scholarshipType,
                                amount: scholarship.amount,
                                description: scholarship.description
                              });
                            }}
                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => deleteScholarship(scholarship.scholarshipId)}
                            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Edit Modal */}
          {editingId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Edit Scholarship</h3>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24}/>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Type *</label>
                      <input
                        type="text"
                        value={editData.scholarshipType || ''}
                        onChange={(e) => setEditData({...editData, scholarshipType: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editData.amount || 0.0}
                        onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value) || 0.0})}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editData.description || ''}
                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                        rows="3"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminScholarshipManager;