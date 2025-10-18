import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Edit, Trash2 } from 'lucide-react'; // Import icons
import CustomConfirmDialog from '../Components/CustomConfirmDialog';

const AdminPartnerInstitutionManager = () => {
  const [partnerInstitutions, setPartnerInstitutions] = useState([]);
  const [formData, setFormData] = useState({
    partnerInstitutionId: "",
    institutionName: "",
    websiteUrl: "",
    email: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [institutionIdToDelete, setInstitutionIdToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await axios.get("/admin/partner-institutions");
      setPartnerInstitutions(response.data);
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
        await axios.put(`/admin/partner-institutions/${formData.partnerInstitutionId}`, formData);
      } else {
        await axios.post("/admin/partner-institutions", formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving partner institution:", error);
      setError("Error saving partner institution: " + error.message);
    }
  };

  const handleEdit = (institution) => {
    setFormData({
      partnerInstitutionId: institution.partnerInstitutionId,
      institutionName: institution.institutionName,
      websiteUrl: institution.websiteUrl || "",
      email: institution.email || ""
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    setInstitutionIdToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/admin/partner-institutions/${institutionIdToDelete}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting partner institution:", error);
      setError("Error deleting partner institution: " + error.message);
    } finally {
      setShowConfirmDialog(false);
      setInstitutionIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setInstitutionIdToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      partnerInstitutionId: "",
      institutionName: "",
      websiteUrl: "",
      email: ""
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Partner Institution Management</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Partner Institution Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Form for creating/editing partner institutions */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Partner Institution" : "Add New Partner Institution"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institution ID
            </label>
            <input
              type="text"
              name="partnerInstitutionId"
              value={formData.partnerInstitutionId}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institution Name
            </label>
            <input
              type="text"
              name="institutionName"
              value={formData.institutionName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <input
              type="text"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {isEditing ? "Update" : "Create"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table to display partner institutions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Partner Institutions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institution ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Website
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {partnerInstitutions.map((institution) => (
                <tr key={institution.partnerInstitutionId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {institution.partnerInstitutionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {institution.institutionName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {institution.websiteUrl || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {institution.email || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(institution)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(institution.partnerInstitutionId)}
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
      </div>

      {/* Custom Confirm Dialog */}
      <CustomConfirmDialog
        isOpen={showConfirmDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Partner Institution"
        message="Are you sure you want to delete this partner institution? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AdminPartnerInstitutionManager;