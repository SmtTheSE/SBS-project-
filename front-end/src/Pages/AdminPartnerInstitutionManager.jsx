import React, { useState, useEffect, useMemo } from "react";
import axios from "../api/axios";
import { Edit, Trash2, Plus, Save, X, Search, Filter } from 'lucide-react'; // Import icons
import CustomConfirmDialog from '../Components/CustomConfirmDialog';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormButton } from '../Components/ModernForm';

const AdminPartnerInstitutionManager = () => {
  const [partnerInstitutions, setPartnerInstitutions] = useState([]);
  const [formData, setFormData] = useState({
    partnerInstitutionId: "",
    institutionName: "",
    websiteUrl: "",
    email: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false); // 添加状态控制创建表单显示
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [institutionIdToDelete, setInstitutionIdToDelete] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    email: ''
  });

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
      name: '',
      email: ''
    });
    setCurrentPage(1);
  };

  // Filter and search partner institutions
  const filteredPartnerInstitutions = useMemo(() => {
    return partnerInstitutions.filter(institution => {
      // Apply search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!(institution.partnerInstitutionId.toLowerCase().includes(term) ||
              institution.institutionName.toLowerCase().includes(term))) {
          return false;
        }
      }

      // Apply name filter
      if (filters.name && !institution.institutionName.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      // Apply email filter
      if (filters.email && !institution.email.toLowerCase().includes(filters.email.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [partnerInstitutions, searchTerm, filters]);

  // Get current partner institutions for pagination
  const getCurrentPartnerInstitutions = () => {
    const indexOfLastInstitution = currentPage * itemsPerPage;
    const indexOfFirstInstitution = indexOfLastInstitution - itemsPerPage;
    return filteredPartnerInstitutions.slice(indexOfFirstInstitution, indexOfLastInstitution);
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
    if (currentPage < Math.ceil(filteredPartnerInstitutions.length / itemsPerPage)) {
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
        await axios.put(`/admin/partner-institutions/${formData.partnerInstitutionId}`, formData);
      } else {
        await axios.post("/admin/partner-institutions", formData);
      }
      resetForm();
      setCurrentPage(1); // Reset to first page
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
    setShowCreateForm(true); // 显示编辑表单
  };

  const handleDelete = async (id) => {
    setInstitutionIdToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/admin/partner-institutions/${institutionIdToDelete}`);
      // If we're on the last page and it becomes empty, go to previous page
      const updatedInstitutions = filteredPartnerInstitutions.filter(institution => institution.partnerInstitutionId !== institutionIdToDelete);
      const totalPages = Math.ceil((updatedInstitutions.length) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
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
    setShowCreateForm(false); // 隐藏表单
  };

  // Get current partner institutions
  const currentPartnerInstitutions = getCurrentPartnerInstitutions();
  const totalPages = Math.ceil(filteredPartnerInstitutions.length / itemsPerPage);
  
  // Check if any filters are active
  const hasActiveFilters = searchTerm || filters.name || filters.email;

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Partner Institution Management</h1>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Panel - Partner Institution Management
            </h1>
            <p className="text-gray-600">
              Manage partner institutions • Total: {filteredPartnerInstitutions.length}
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
            Create New Institution
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
                placeholder="Search by ID, Name..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Name Filter */}
            <div>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                placeholder="Filter by Name"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Email Filter */}
            <div>
              <input
                type="text"
                value={filters.email}
                onChange={(e) => handleFilterChange('email', e.target.value)}
                placeholder="Filter by Email"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Clear Filters Button */}
            <div className="flex items-end">
              {(hasActiveFilters) && (
                <button
                  onClick={clearFilters}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
          
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
              
              {filters.name && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Name: {filters.name}
                  <button 
                    onClick={() => handleFilterChange('name', '')}
                    className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.email && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Email: {filters.email}
                  <button 
                    onClick={() => handleFilterChange('email', '')}
                    className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Create/Edit Form Modal - 使用与其他管理页面相同的样式 */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {isEditing ? "Edit Partner Institution" : "Create New Partner Institution"}
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
                      <FormLabel required>Institution ID</FormLabel>
                      <FormInput
                        type="text"
                        name="partnerInstitutionId"
                        value={formData.partnerInstitutionId}
                        onChange={handleInputChange}
                        required
                        disabled={isEditing}
                        placeholder="e.g., PI001"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>Institution Name</FormLabel>
                      <FormInput
                        type="text"
                        name="institutionName"
                        value={formData.institutionName}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Harvard University"
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel>Website URL</FormLabel>
                      <FormInput
                        type="text"
                        name="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={handleInputChange}
                        placeholder="e.g., https://www.example.com"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel>Email</FormLabel>
                      <FormInput
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g., contact@example.com"
                      />
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
                      {isEditing ? "Update Institution" : "Create Institution"}
                    </FormButton>
                  </div>
                </ModernForm>
              </div>
            </div>
          </div>
        )}

        {/* Table to display partner institutions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2">
            Existing Partner Institutions ({filteredPartnerInstitutions.length})
          </h2>
          
          {filteredPartnerInstitutions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                {partnerInstitutions.length === 0 
                  ? "No partner institutions yet" 
                  : "No partner institutions match your search criteria"}
              </p>
              {hasActiveFilters && (
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your search or filter criteria
                </p>
              )}
              <p className="text-gray-400 text-sm mt-2">Click "Create New Institution" to add your first institution</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg shadow">
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
                    {currentPartnerInstitutions.map((institution) => (
                      <tr key={institution.partnerInstitutionId} className="hover:bg-gray-50">
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
          title="Delete Partner Institution"
          message="Are you sure you want to delete this partner institution? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default AdminPartnerInstitutionManager;