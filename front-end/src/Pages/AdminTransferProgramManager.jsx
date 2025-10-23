import React, { useState, useEffect, useMemo } from "react";
import axios from "../api/axios";
import { Edit, Trash2, Plus, Save, X, Search, Filter } from 'lucide-react'; // Import icons
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    admin: '',
    institution: ''
  });

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

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      country: '',
      admin: '',
      institution: ''
    });
    setCurrentPage(1);
  };

  // Filter and search transfer programs
  const filteredTransferPrograms = useMemo(() => {
    return transferPrograms.filter(program => {
      // Apply search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!(program.transferProgramId.toLowerCase().includes(term) ||
              program.transferCountry.toLowerCase().includes(term))) {
          return false;
        }
      }

      // Apply country filter
      if (filters.country && !program.transferCountry.toLowerCase().includes(filters.country.toLowerCase())) {
        return false;
      }

      // Apply admin filter
      if (filters.admin) {
        const admin = admins.find(a => a.adminId === program.adminId);
        if (admin) {
          const adminName = `${admin.firstName} ${admin.lastName}`.toLowerCase();
          if (!adminName.includes(filters.admin.toLowerCase()) && 
              !program.adminId.toLowerCase().includes(filters.admin.toLowerCase())) {
            return false;
          }
        } else if (!program.adminId.toLowerCase().includes(filters.admin.toLowerCase())) {
          return false;
        }
      }

      // Apply institution filter
      if (filters.institution && 
          !program.partnerInstitutionName.toLowerCase().includes(filters.institution.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [transferPrograms, searchTerm, filters, admins]);

  // Get current transfer programs for pagination
  const getCurrentTransferPrograms = () => {
    const indexOfLastProgram = currentPage * itemsPerPage;
    const indexOfFirstProgram = indexOfLastProgram - itemsPerPage;
    return filteredTransferPrograms.slice(indexOfFirstProgram, indexOfLastProgram);
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Next page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredTransferPrograms.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
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
      setCurrentPage(1); // Reset to first page
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
      // If we're on the last page and it becomes empty, go to previous page
      const updatedPrograms = filteredTransferPrograms.filter(program => program.transferProgramId !== programIdToDelete);
      const totalPages = Math.ceil((updatedPrograms.length) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
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

  // Get current transfer programs
  const currentTransferPrograms = getCurrentTransferPrograms();
  const totalPages = Math.ceil(filteredTransferPrograms.length / itemsPerPage);
  
  // Check if any filters are active
  const hasActiveFilters = searchTerm || filters.country || filters.admin || filters.institution;

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
              Manage student transfer programs • Total: {filteredTransferPrograms.length}
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
        
        {/* Search and Filter Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by ID, Country..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Country Filter */}
            <div>
              <input
                type="text"
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                placeholder="Filter by Country"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Admin Filter */}
            <div>
              <input
                type="text"
                value={filters.admin}
                onChange={(e) => handleFilterChange('admin', e.target.value)}
                placeholder="Filter by Admin"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Institution Filter */}
            <div>
              <input
                type="text"
                value={filters.institution}
                onChange={(e) => handleFilterChange('institution', e.target.value)}
                placeholder="Filter by Institution"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          {/* Clear Filters Button */}
          <div className="flex justify-between items-center">
            {(hasActiveFilters) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear All Filters
              </button>
            )}
            
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                
                {searchTerm && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Search: {searchTerm}
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.country && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Country: {filters.country}
                    <button 
                      onClick={() => handleFilterChange('country', '')}
                      className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.admin && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Admin: {filters.admin}
                    <button 
                      onClick={() => handleFilterChange('admin', '')}
                      className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.institution && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Institution: {filters.institution}
                    <button 
                      onClick={() => handleFilterChange('institution', '')}
                      className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
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
            Existing Transfer Programs ({filteredTransferPrograms.length})
          </h2>
          
          {filteredTransferPrograms.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                {transferPrograms.length === 0 
                  ? "No transfer programs yet" 
                  : "No transfer programs match your search criteria"}
              </p>
              {hasActiveFilters && (
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your search or filter criteria
                </p>
              )}
              <p className="text-gray-400 text-sm mt-2">Click "Create New Program" to add your first program</p>
            </div>
          ) : (
            <>
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
                    {currentTransferPrograms.map((program) => (
                      <tr key={program.transferProgramId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {program.transferProgramId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {program.adminId} - {admins.find(a => a.adminId === program.adminId) ? 
                            `${admins.find(a => a.adminId === program.adminId).firstName} ${admins.find(a => a.adminId === program.adminId).lastName}` : 
                            'N/A'}
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
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`flex items-center px-3 py-1 rounded-md ${
                        currentPage === 1 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="ml-1">Previous</span>
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`w-10 h-10 rounded-full ${
                            currentPage === pageNumber
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center px-3 py-1 rounded-md ${
                        currentPage === totalPages 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="mr-1">Next</span>
                    </button>
                  </nav>
                </div>
              )}
            </>
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