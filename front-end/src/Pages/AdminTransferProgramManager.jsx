import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Edit, Trash2 } from 'lucide-react'; // Import icons

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this transfer program?");
      if (!confirmDelete) return;
      
      await axios.delete(`/admin/transfer-programs/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting transfer program:", error);
      setError("Error deleting transfer program: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      transferProgramId: "",
      adminId: "",
      transferCountry: "",
      partnerInstitutionId: ""
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Transfer Program Management</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transfer Program Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Form for creating/editing transfer programs */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Transfer Program" : "Add New Transfer Program"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transfer Program ID
            </label>
            <input
              type="text"
              name="transferProgramId"
              value={formData.transferProgramId}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin
            </label>
            <select
              name="adminId"
              value={formData.adminId}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Admin</option>
              {admins.map((admin) => (
                <option key={admin.adminId} value={admin.adminId}>
                  {admin.firstName} {admin.lastName} ({admin.adminId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transfer Country
            </label>
            <input
              type="text"
              name="transferCountry"
              value={formData.transferCountry}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partner Institution
            </label>
            <select
              name="partnerInstitutionId"
              value={formData.partnerInstitutionId}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Partner Institution</option>
              {partnerInstitutions.map((institution) => (
                <option key={institution.partnerInstitutionId} value={institution.partnerInstitutionId}>
                  {institution.institutionName}
                </option>
              ))}
            </select>
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

      {/* Table to display transfer programs */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Transfer Programs</h2>
        <div className="overflow-x-auto">
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
                <tr key={program.transferProgramId}>
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
      </div>
    </div>
  );
};

export default AdminTransferProgramManager;