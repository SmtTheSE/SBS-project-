import React, { useState, useEffect } from 'react';
import { Plus, Save, Edit, X, Trash2 } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [paymentIdToDelete, setPaymentIdToDelete] = useState(null);

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
    setPaymentIdToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/admin/tuition-payments/${paymentIdToDelete}`);
      
      alert('Tuition payment record deleted successfully!');
      fetchTuitionPayments(); // Refresh the list
    } catch (error) {
      console.error('Delete error:', error);
      alert('Network error occurred while deleting tuition payment record');
    } finally {
      setShowConfirmDialog(false);
      setPaymentIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setPaymentIdToDelete(null);
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

          <FormButton
            variant="primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus size={20} />
            {showCreateForm ? 'Cancel' : 'Create New Record'}
          </FormButton>
        </div>

        {/* Create New Tuition Payment Form */}
        {showCreateForm && (
          <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-bold text-blue-800 mb-4">Create New Tuition Payment Record</h2>
            
            <ModernForm>
              <FormRow>
                <FormGroup>
                  <FormLabel required>Student ID</FormLabel>
                  <FormInput
                    type="text"
                    value={createData.studentId}
                    onChange={(e) => setCreateData({...createData, studentId: e.target.value})}
                    placeholder="e.g., STU001"
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Scholarship ID</FormLabel>
                  <FormInput
                    type="text"
                    value={createData.scholarshipId}
                    onChange={(e) => setCreateData({...createData, scholarshipId: e.target.value})}
                    placeholder="e.g., SCH001"
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <FormLabel>Payment Status</FormLabel>
                  <FormSelect
                    value={createData.paymentStatus}
                    onChange={(e) => setCreateData({...createData, paymentStatus: parseInt(e.target.value)})}
                  >
                    <option value={0}>Unpaid</option>
                    <option value={1}>Paid</option>
                  </FormSelect>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Payment Method</FormLabel>
                  <FormSelect
                    value={createData.paymentMethod}
                    onChange={(e) => setCreateData({...createData, paymentMethod: parseInt(e.target.value)})}
                  >
                    <option value={1}>Bank Transfer</option>
                    <option value={2}>Credit Card</option>
                  </FormSelect>
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <FormLabel>Amount Paid</FormLabel>
                <FormInput
                  type="number"
                  step="0.01"
                  value={createData.amountPaid}
                  onChange={(e) => setCreateData({...createData, amountPaid: parseFloat(e.target.value) || 0.0})}
                  placeholder="e.g., 1000.00"
                />
              </FormGroup>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                <FormButton
                  type="button"
                  variant="secondary"
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
                >
                  <X size={20} />
                  Cancel
                </FormButton>
                
                <FormButton
                  type="button"
                  variant="success"
                  onClick={createNewTuitionPayment}
                >
                  <Save size={20} />
                  Create Record
                </FormButton>
              </div>
            </ModernForm>
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
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scholarship ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tuitionPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.scholarshipId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.paymentStatus === 1 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getPaymentStatusText(payment.paymentStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getPaymentMethodText(payment.paymentMethod)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${payment.amountPaid.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          onClick={() => deleteTuitionPayment(payment.id)}
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
            </div>
          )}
          
          {/* Edit Modal */}
          {editingId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                  
                  <ModernForm>
                    <FormGroup>
                      <FormLabel required>Student ID</FormLabel>
                      <FormInput
                        type="text"
                        value={editData.studentId || ''}
                        onChange={(e) => setEditData({...editData, studentId: e.target.value})}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel>Scholarship ID</FormLabel>
                      <FormInput
                        type="text"
                        value={editData.scholarshipId || ''}
                        onChange={(e) => setEditData({...editData, scholarshipId: e.target.value})}
                      />
                    </FormGroup>
                    
                    <FormRow>
                      <FormGroup>
                        <FormLabel>Payment Status</FormLabel>
                        <FormSelect
                          value={editData.paymentStatus !== undefined ? editData.paymentStatus : 0}
                          onChange={(e) => setEditData({...editData, paymentStatus: parseInt(e.target.value)})}
                        >
                          <option value={0}>Unpaid</option>
                          <option value={1}>Paid</option>
                        </FormSelect>
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel>Payment Method</FormLabel>
                        <FormSelect
                          value={editData.paymentMethod !== undefined ? editData.paymentMethod : 1}
                          onChange={(e) => setEditData({...editData, paymentMethod: parseInt(e.target.value)})}
                        >
                          <option value={1}>Bank Transfer</option>
                          <option value={2}>Credit Card</option>
                        </FormSelect>
                      </FormGroup>
                    </FormRow>
                    
                    <FormGroup>
                      <FormLabel>Amount Paid</FormLabel>
                      <FormInput
                        type="number"
                        step="0.01"
                        value={editData.amountPaid || 0.0}
                        onChange={(e) => setEditData({...editData, amountPaid: parseFloat(e.target.value) || 0.0})}
                      />
                    </FormGroup>
                    
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                      <FormButton
                        type="button"
                        variant="secondary"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </FormButton>
                      
                      <FormButton
                        type="button"
                        variant="success"
                        onClick={saveEdit}
                      >
                        Save Changes
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
            title="Delete Tuition Payment Record"
            message="Are you sure you want to delete this tuition payment record? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminTuitionPaymentManager;