import React, { useState, useEffect } from 'react';
import { Plus, Save, Edit, X, Trash2 } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

const AdminTuitionPaymentManager = () => {
  const [tuitionPayments, setTuitionPayments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createData, setCreateData] = useState({
    studentId: '',
    scholarshipId: '',
    paymentStatus: 0, // 0 = Unpaid, 1 = Paid
    paymentMethod: 1, // 1 = Bank Transfer, 2 = Credit Card
    amountPaid: 0.0
  });

  useEffect(() => {
    fetchTuitionPayments();
  }, []);

  const fetchTuitionPayments = async () => {
    try {
      const response = await axiosInstance.get('/admin/tuition-payments');
      setTuitionPayments(response.data);
    } catch (error) {
      console.error('Failed to fetch tuition payments:', error);
    }
  };

  const createNewTuitionPayment = async () => {
    // Validation
    if (!createData.studentId) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await axiosInstance.post('/admin/tuition-payments', createData);
      
      alert('Tuition payment record created successfully!');
      
      // Reset form
      setCreateData({
        studentId: '',
        scholarshipId: '',
        paymentStatus: 0,
        paymentMethod: 1,
        amountPaid: 0.0
      });
      setShowCreateForm(false);
      fetchTuitionPayments(); // Refresh the list
    } catch (error) {
      console.error('Create error:', error);
      alert('Network error occurred while creating tuition payment record');
    }
  };

  const saveEdit = async () => {
    try {
      const response = await axiosInstance.put(`/admin/tuition-payments/${editingId}`, {
        ...editData
      });
      
      alert('Tuition payment record updated successfully!');
      setEditingId(null);
      fetchTuitionPayments(); // Refresh the list
    } catch (error) {
      console.error('Update error:', error);
      alert('Network error occurred while updating tuition payment record');
    }
  };

  const deleteTuitionPayment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tuition payment record?')) return;

    try {
      await axiosInstance.delete(`/admin/tuition-payments/${id}`);
      
      alert('Tuition payment record deleted successfully!');
      fetchTuitionPayments(); // Refresh the list
    } catch (error) {
      console.error('Delete error:', error);
      alert('Network error occurred while deleting tuition payment record');
    }
  };

  const getPaymentStatusText = (status) => {
    return status === 1 ? 'Paid' : 'Unpaid';
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 1: return 'Bank Transfer';
      case 2: return 'Credit Card';
      default: return 'Unknown';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Panel - Tuition Payment Management
            </h1>
            <p className="text-gray-600">
              Manage student tuition payments • Total: {tuitionPayments.length}
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
          >
            <Plus size={20} />
            {showCreateForm ? 'Cancel' : 'Create New Record'}
          </button>
        </div>

        {/* Create New Tuition Payment Form */}
        {showCreateForm && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Create New Tuition Payment Record</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Student ID *</label>
                  <input
                    type="text"
                    value={createData.studentId}
                    onChange={(e) => setCreateData({...createData, studentId: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., STU001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Scholarship ID</label>
                  <input
                    type="text"
                    value={createData.scholarshipId}
                    onChange={(e) => setCreateData({...createData, scholarshipId: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., SCH001"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Payment Status</label>
                  <select
                    value={createData.paymentStatus}
                    onChange={(e) => setCreateData({...createData, paymentStatus: parseInt(e.target.value)})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Unpaid</option>
                    <option value={1}>Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={createData.paymentMethod}
                    onChange={(e) => setCreateData({...createData, paymentMethod: parseInt(e.target.value)})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Bank Transfer</option>
                    <option value={2}>Credit Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Amount Paid</label>
                  <input
                    type="number"
                    step="0.01"
                    value={createData.amountPaid}
                    onChange={(e) => setCreateData({...createData, amountPaid: parseFloat(e.target.value) || 0.0})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1000.00"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                onClick={createNewTuitionPayment}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
              >
                <Save size={20} />
                Create Record
              </button>

              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setCreateData({
                    studentId: '',
                    scholarshipId: '',
                    paymentStatus: 0,
                    paymentMethod: 1,
                    amountPaid: 0.0
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

        {/* Existing Tuition Payments Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2">
            Existing Records ({tuitionPayments.length})
          </h2>

          {tuitionPayments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No tuition payment records yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Create New Record" to add your first record</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Student ID</th>
                    <th className="py-2 px-4 border-b text-left">Scholarship ID</th>
                    <th className="py-2 px-4 border-b text-left">Payment Status</th>
                    <th className="py-2 px-4 border-b text-left">Payment Method</th>
                    <th className="py-2 px-4 border-b text-left">Amount Paid</th>
                    <th className="py-2 px-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tuitionPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{payment.studentId}</td>
                      <td className="py-2 px-4 border-b">{payment.scholarshipId || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payment.paymentStatus === 1 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getPaymentStatusText(payment.paymentStatus)}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">{getPaymentMethodText(payment.paymentMethod)}</td>
                      <td className="py-2 px-4 border-b">${payment.amountPaid.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingId(payment.id);
                              setEditData({
                                studentId: payment.studentId,
                                scholarshipId: payment.scholarshipId,
                                paymentStatus: payment.paymentStatus,
                                paymentMethod: payment.paymentMethod,
                                amountPaid: payment.amountPaid
                              });
                            }}
                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => deleteTuitionPayment(payment.id)}
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
                    <h3 className="text-xl font-bold text-gray-800">Edit Tuition Payment Record</h3>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24}/>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
                      <input
                        type="text"
                        value={editData.studentId || ''}
                        onChange={(e) => setEditData({...editData, studentId: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship ID</label>
                      <input
                        type="text"
                        value={editData.scholarshipId || ''}
                        onChange={(e) => setEditData({...editData, scholarshipId: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                      <select
                        value={editData.paymentStatus !== undefined ? editData.paymentStatus : 0}
                        onChange={(e) => setEditData({...editData, paymentStatus: parseInt(e.target.value)})}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value={0}>Unpaid</option>
                        <option value={1}>Paid</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                      <select
                        value={editData.paymentMethod !== undefined ? editData.paymentMethod : 1}
                        onChange={(e) => setEditData({...editData, paymentMethod: parseInt(e.target.value)})}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value={1}>Bank Transfer</option>
                        <option value={2}>Credit Card</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editData.amountPaid || 0.0}
                        onChange={(e) => setEditData({...editData, amountPaid: parseFloat(e.target.value) || 0.0})}
                        className="w-full p-2 border rounded-lg"
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

export default AdminTuitionPaymentManager;