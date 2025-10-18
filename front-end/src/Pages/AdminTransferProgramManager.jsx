import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Edit, Trash2, Plus, Save, X } from 'lucide-react'; // Import icons
import CustomConfirmDialog from '../Components/CustomConfirmDialog';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton } from '../Components/ModernForm';

const AdminTransferProgramManager = () => {
  const [transferPrograms, setTransferPrograms] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [partnerInstitutions, setPartnerInstitutions] = useState([]);
  const [formData, setFormData] = useState({
    transferProgramId: "",
    adminId: "",
    transferCountry: "",
    partnerInstitutionId: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false); // 添加状态控制创建表单显示
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [programIdToDelete, setProgramIdToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch all data in parallel
      const [
        transferProgramsRes,
        adminsRes,
        partnerInstitutionsRes
      ] = await Promise.all([
        axios.get("/admin/transfer-programs"),
        axios.get("/admin"),
        axios.get("/admin/partner-institutions")
      ]);

      setTransferPrograms(transferProgramsRes.data);
      setAdmins(adminsRes.data);
      setPartnerInstitutions(partnerInstitutionsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data: " + error.message);
    } finally {
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
      setError("");
      if (isEditing) {
        await axios.put(`/admin/transfer-programs/${formData.transferProgramId}`, formData);
      } else {
        await axios.post("/admin/transfer-programs", formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving transfer program:", error);
      setError("Error saving transfer program: " + error.message);
    }
  };

  const handleEdit = (transferProgram) => {
    setFormData({
      transferProgramId: transferProgram.transferProgramId,
      adminId: transferProgram.adminId || "",
      transferCountry: transferProgram.transferCountry,
      partnerInstitutionId: transferProgram.partnerInstitutionId || ""
    });
    setIsEditing(true);
    setShowCreateForm(true); // 显示编辑表单
  };

  const handleDelete = async (id) => {
    setProgramIdToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/admin/transfer-programs/${programIdToDelete}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting transfer program:", error);
      setError("Error deleting transfer program: " + error.message);
    } finally {
      setShowConfirmDialog(false);
      setProgramIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setProgramIdToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      transferProgramId: "",
      adminId: "",
      transferCountry: "",
      partnerInstitutionId: ""
    });
    setIsEditing(false);
    setShowCreateForm(false); // 隐藏表单
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Transfer Program Management</h1>
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
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Panel - Transfer Program Management
            </h1>
            <p className="text-gray-600">
              Manage student transfer programs • Total: {transferPrograms.length}
            </p>
          </div>
          
          <FormButton
            variant="primary"
            onClick={() => {
              resetForm(); // 重置表单状态
              setShowCreateForm(true); // 显示创建表单
            }}
          >
            <Plus size={20} />
            Create New Program
          </FormButton>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* Create/Edit Form Modal - 使用与学费支付页面相同的样式 */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {isEditing ? "Edit Transfer Program" : "Create New Transfer Program"}
                  </h2>
                  <button 
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24}/>
                  </button>
                </div>
                
                <ModernForm onSubmit={handleSubmit}>
                  <FormRow>
                    <FormGroup>
                      <FormLabel required>Transfer Program ID</FormLabel>
                      <FormInput
                        type="text"
                        name="transferProgramId"
                        value={formData.transferProgramId}
                        onChange={handleInputChange}
                        required
                        disabled={isEditing}
                        placeholder="e.g., TP001"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>Transfer Country</FormLabel>
                      <FormInput
                        type="text"
                        name="transferCountry"
                        value={formData.transferCountry}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., USA"
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel required>Admin</FormLabel>
                      <FormSelect
                        name="adminId"
                        value={formData.adminId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Admin</option>
                        {admins.map((admin) => (
                          <option key={admin.adminId} value={admin.adminId}>
                            {admin.firstName} {admin.lastName} ({admin.adminId})
                          </option>
                        ))}
                      </FormSelect>
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>Partner Institution</FormLabel>
                      <FormSelect
                        name="partnerInstitutionId"
                        value={formData.partnerInstitutionId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Partner Institution</option>
                        {partnerInstitutions.map((institution) => (
                          <option key={institution.partnerInstitutionId} value={institution.partnerInstitutionId}>
                            {institution.institutionName}
                          </option>
                        ))}
                      </FormSelect>
                    </FormGroup>
                  </FormRow>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                    <FormButton
                      type="button"
                      variant="secondary"
                      onClick={resetForm}
                    >
                      <X size={20} />
                      Cancel
                    </FormButton>
                    
                    <FormButton
                      type="submit"
                      variant="success"
                    >
                      <Save size={20} />
                      {isEditing ? "Update Program" : "Create Program"}
                    </FormButton>
                  </div>
                </ModernForm>
              </div>
            </div>
          </div>
        )}

        {/* Table to display transfer programs */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2">
            Existing Transfer Programs ({transferPrograms.length})
          </h2>
          
          {transferPrograms.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No transfer programs yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Create New Program" to add your first program</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Partner Institution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transferPrograms.map((program) => (
                    <tr key={program.transferProgramId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {program.transferProgramId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.adminId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.transferCountry}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.partnerInstitutionName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(program)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(program.transferProgramId)}
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
        </div>

        {/* Custom Confirm Dialog */}
        <CustomConfirmDialog
          isOpen={showConfirmDialog}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Transfer Program"
          message="Are you sure you want to delete this transfer program? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default AdminTransferProgramManager;