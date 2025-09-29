import React, { useState, useEffect } from 'react';
import { Plus, Save, Edit, X, Eye, EyeOff, Trash2 } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

const AdminVisaPassportManager = () => {
  const [visaPassports, setVisaPassports] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createData, setCreateData] = useState({
    visaPassportId: '',
    studentId: '',
    visaId: '',
    visaIssuedDate: '',
    visaExpiredDate: '',
    visaType: 0, // 0 = Single Entry, 1 = Multiple Entry
    passportNumber: '',
    passportIssuedDate: '',
    passportExpiredDate: ''
 });

  useEffect(() => {
    fetchVisaPassports();
  }, []);

  const fetchVisaPassports = async () => {
    try {
      const response = await axiosInstance.get('/admin/visa-passports');
      setVisaPassports(response.data);
    } catch (error) {
      console.error('Failed to fetch visa passports:', error);
      // Log more details about the error
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
  };

  const createNewVisaPassport = async () => {
    // Validation
    if (!createData.visaPassportId || !createData.studentId || !createData.visaId || 
        !createData.visaIssuedDate || !createData.visaExpiredDate || !createData.passportNumber ||
        !createData.passportIssuedDate || !createData.passportExpiredDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await axiosInstance.post('/admin/visa-passports', createData);
      
      alert('Visa/Passport record created successfully!');
      
      // Reset form
      setCreateData({
        visaPassportId: '',
        studentId: '',
        visaId: '',
        visaIssuedDate: '',
        visaExpiredDate: '',
        visaType: 0,
        passportNumber: '',
        passportIssuedDate: '',
        passportExpiredDate: ''
      });
      setShowCreateForm(false);
      fetchVisaPassports(); // Refresh the list
    } catch (error) {
      console.error('Create error:', error);
      // Log more details about the error
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      alert('Network error occurred while creating visa/passport record: ' + (error.response?.data?.message || error.message));
    }
  };

  const saveEdit = async () => {
    try {
      const response = await axiosInstance.put(`/admin/visa-passports/${editingId}`, {
        ...editData,
        visaPassportId: editingId
      });
      
      alert('Visa/Passport record updated successfully!');
      setEditingId(null);
      fetchVisaPassports(); // Refresh the list
    } catch (error) {
      console.error('Update error:', error);
      // Log more details about the error
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      alert('Network error occurred while updating visa/passport record: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteVisaPassport = async (visaPassportId) => {
    if (!window.confirm('Are you sure you want to delete this visa/passport record?')) return;

    try {
      await axiosInstance.delete(`/admin/visa-passports/${visaPassportId}`);
      
      alert('Visa/Passport record deleted successfully!');
      fetchVisaPassports(); // Refresh the list
    } catch (error) {
      console.error('Delete error:', error);
      // Log more details about the error
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      alert('Network error occurred while deleting visa/passport record: ' + (error.response?.data?.message || error.message));
    }
  };

  const getVisaTypeText = (visaType) => {
    return visaType === 1 ? 'Multiple Entry' : 'Single Entry';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Panel - Visa/Passport Management
            </h1>
            <p className="text-gray-600">
              Manage student visa and passport information • Total: {visaPassports.length}
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

        {/* Create New Visa/Passport Form */}
        {showCreateForm && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Create New Visa/Passport Record</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visa Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Visa Information</h4>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Visa Passport ID *</label>
                  <input
                    type="text"
                    value={createData.visaPassportId}
                    onChange={(e) => setCreateData({...createData, visaPassportId: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., VP001"
                  />
                </div>

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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Visa ID *</label>
                  <input
                    type="text"
                    value={createData.visaId}
                    onChange={(e) => setCreateData({...createData, visaId: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., VISA123"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Visa Issued Date *</label>
                    <input
                      type="date"
                      value={createData.visaIssuedDate}
                      onChange={(e) => setCreateData({...createData, visaIssuedDate: e.target.value})}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Visa Expired Date *</label>
                    <input
                      type="date"
                      value={createData.visaExpiredDate}
                      onChange={(e) => setCreateData({...createData, visaExpiredDate: e.target.value})}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Visa Type *</label>
                  <select
                    value={createData.visaType}
                    onChange={(e) => setCreateData({...createData, visaType: parseInt(e.target.value)})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Single Entry</option>
                    <option value={1}>Multiple Entry</option>
                  </select>
                </div>
              </div>

              {/* Passport Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Passport Information</h4>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Passport Number *</label>
                  <input
                    type="text"
                    value={createData.passportNumber}
                    onChange={(e) => setCreateData({...createData, passportNumber: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., P12345678"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Passport Issued Date *</label>
                    <input
                      type="date"
                      value={createData.passportIssuedDate}
                      onChange={(e) => setCreateData({...createData, passportIssuedDate: e.target.value})}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Passport Expired Date *</label>
                    <input
                      type="date"
                      value={createData.passportExpiredDate}
                      onChange={(e) => setCreateData({...createData, passportExpiredDate: e.target.value})}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                onClick={createNewVisaPassport}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
              >
                <Save size={20} />
                Create Record
              </button>

              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setCreateData({
                    visaPassportId: '',
                    studentId: '',
                    visaId: '',
                    visaIssuedDate: '',
                    visaExpiredDate: '',
                    visaType: 0,
                    passportNumber: '',
                    passportIssuedDate: '',
                    passportExpiredDate: ''
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

        {/* Existing Visa/Passport Records Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2">
            Existing Records ({visaPassports.length})
          </h2>

          {visaPassports.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No visa/passport records yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Create New Record" to add your first record</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Visa Passport ID</th>
                    <th className="py-2 px-4 border-b text-left">Student ID</th>
                    <th className="py-2 px-4 border-b text-left">Visa ID</th>
                    <th className="py-2 px-4 border-b text-left">Visa Dates</th>
                    <th className="py-2 px-4 border-b text-left">Visa Type</th>
                    <th className="py-2 px-4 border-b text-left">Passport Number</th>
                    <th className="py-2 px-4 border-b text-left">Passport Dates</th>
                    <th className="py-2 px-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visaPassports.map((record) => (
                    <tr key={record.visaPassportId} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{record.visaPassportId}</td>
                      <td className="py-2 px-4 border-b">{record.studentId}</td>
                      <td className="py-2 px-4 border-b">{record.visaId}</td>
                      <td className="py-2 px-4 border-b">
                        Issued: {record.visaIssuedDate}<br/>
                        Expired: {record.visaExpiredDate}
                      </td>
                      <td className="py-2 px-4 border-b">{getVisaTypeText(record.visaType)}</td>
                      <td className="py-2 px-4 border-b">{record.passportNumber}</td>
                      <td className="py-2 px-4 border-b">
                        Issued: {record.passportIssuedDate}<br/>
                        Expired: {record.passportExpiredDate}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingId(record.visaPassportId);
                              setEditData({
                                studentId: record.studentId,
                                visaId: record.visaId,
                                visaIssuedDate: record.visaIssuedDate,
                                visaExpiredDate: record.visaExpiredDate,
                                visaType: record.visaType,
                                passportNumber: record.passportNumber,
                                passportIssuedDate: record.passportIssuedDate,
                                passportExpiredDate: record.passportExpiredDate
                              });
                            }}
                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => deleteVisaPassport(record.visaPassportId)}
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
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Edit Visa/Passport Record</h3>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24}/>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Visa Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-3">Visa Information</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                          <input
                            type="text"
                            value={editData.studentId || ''}
                            onChange={(e) => setEditData({...editData, studentId: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Visa ID</label>
                          <input
                            type="text"
                            value={editData.visaId || ''}
                            onChange={(e) => setEditData({...editData, visaId: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Visa Issued Date</label>
                            <input
                              type="date"
                              value={editData.visaIssuedDate || ''}
                              onChange={(e) => setEditData({...editData, visaIssuedDate: e.target.value})}
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Visa Expired Date</label>
                            <input
                              type="date"
                              value={editData.visaExpiredDate || ''}
                              onChange={(e) => setEditData({...editData, visaExpiredDate: e.target.value})}
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Visa Type</label>
                          <select
                            value={editData.visaType !== undefined ? editData.visaType : 0}
                            onChange={(e) => setEditData({...editData, visaType: parseInt(e.target.value)})}
                            className="w-full p-2 border rounded-lg"
                          >
                            <option value={0}>Single Entry</option>
                            <option value={1}>Multiple Entry</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Passport Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-3">Passport Information</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                          <input
                            type="text"
                            value={editData.passportNumber || ''}
                            onChange={(e) => setEditData({...editData, passportNumber: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passport Issued Date</label>
                            <input
                              type="date"
                              value={editData.passportIssuedDate || ''}
                              onChange={(e) => setEditData({...editData, passportIssuedDate: e.target.value})}
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passport Expired Date</label>
                            <input
                              type="date"
                              value={editData.passportExpiredDate || ''}
                              onChange={(e) => setEditData({...editData, passportExpiredDate: e.target.value})}
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
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

export default AdminVisaPassportManager;