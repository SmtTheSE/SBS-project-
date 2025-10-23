import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Edit, Trash2, Search, Filter } from 'lucide-react';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormButton } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';

const AdminStudyPlanManager = () => {
  const [studyPlans, setStudyPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [studyPlanToDelete, setStudyPlanToDelete] = useState(null);
  const [editingStudyPlan, setEditingStudyPlan] = useState(null);
  const [formData, setFormData] = useState({
    studyPlanId: '',
    pathwayName: '',
    totalCreditPoint: 0,
    majorName: ''
  });
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    pathwayName: '',
    majorName: ''
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filtered study plans based on search and filters
  const filteredStudyPlans = useMemo(() => {
    return studyPlans.filter(plan => {
      // Apply search term
      const matchesSearch = !searchTerm || 
        plan.studyPlanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.pathwayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.majorName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply filters
      const matchesPathwayName = !filters.pathwayName || 
        plan.pathwayName.toLowerCase().includes(filters.pathwayName.toLowerCase());
      const matchesMajorName = !filters.majorName || 
        plan.majorName.toLowerCase().includes(filters.majorName.toLowerCase());
      
      return matchesSearch && matchesPathwayName && matchesMajorName;
    });
  }, [studyPlans, searchTerm, filters]);

  useEffect(() => {
    fetchStudyPlans();
  }, []);

  const fetchStudyPlans = async () => {
    try {
      const response = await axiosInstance.get('/academic/study-plans');
      setStudyPlans(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch study plans:', error);
      setError('Failed to fetch study plans');
      setLoading(false);
    }
  };

  // Get current study plans for pagination
  const getCurrentStudyPlans = () => {
    const indexOfLastPlan = currentPage * itemsPerPage;
    const indexOfFirstPlan = indexOfLastPlan - itemsPerPage;
    return filteredStudyPlans.slice(indexOfFirstPlan, indexOfLastPlan);
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
    if (currentPage < Math.ceil(filteredStudyPlans.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudyPlan) {
        // Update existing record
        await axiosInstance.put(`/academic/study-plans/${formData.studyPlanId}`, formData);
      } else {
        // Create new record
        await axiosInstance.post('/academic/study-plans', formData);
      }

      // Reset form and refresh dataset
      setFormData({
        studyPlanId: '',
        pathwayName: '',
        totalCreditPoint: 0,
        majorName: ''
      });
      setEditingStudyPlan(null);
      closeModal();
      setCurrentPage(1); // Reset to first page
      fetchStudyPlans();
    } catch (error) {
      console.error('Failed to save study plan:', error);
      setError('Failed to save study plan');
    }
  };

  const openAddModal = () => {
    setFormData({
      studyPlanId: '',
      pathwayName: '',
      totalCreditPoint: 0,
      majorName: ''
    });
    setEditingStudyPlan(null);
    setShowModal(true);
  };

  const openEditModal = (studyPlan) => {
    setFormData({
      studyPlanId: studyPlan.studyPlanId,
      pathwayName: studyPlan.pathwayName,
      totalCreditPoint: studyPlan.totalCreditPoint,
      majorName: studyPlan.majorName
    });
    setEditingStudyPlan(studyPlan);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (studyPlanId) => {
    setStudyPlanToDelete(studyPlanId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/academic/study-plans/${studyPlanToDelete}`);
      // If we're on the last page and it becomes empty, go to previous page
      const updatedPlans = studyPlans.filter(plan => plan.studyPlanId !== studyPlanToDelete);
      const totalPages = Math.ceil((updatedPlans.length) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
      fetchStudyPlans();
    } catch (error) {
      console.error('Failed to delete study plan:', error);
      setError('Failed to delete study plan');
    } finally {
      setShowConfirmDialog(false);
      setStudyPlanToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setStudyPlanToDelete(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      pathwayName: '',
      majorName: ''
    });
    setCurrentPage(1);
  };

  const removeFilter = (filterKey) => {
    if (filterKey === 'search') {
      setSearchTerm('');
    } else {
      setFilters(prev => ({
        ...prev,
        [filterKey]: ''
      }));
    }
    setCurrentPage(1);
  };

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const filtersList = [];
    if (searchTerm) filtersList.push({ key: 'search', label: `Search: ${searchTerm}` });
    if (filters.pathwayName) filtersList.push({ key: 'pathwayName', label: `Pathway: ${filters.pathwayName}` });
    if (filters.majorName) filtersList.push({ key: 'majorName', label: `Major: ${filters.majorName}` });
    return filtersList;
  }, [searchTerm, filters]);

  // Get current study plans
  const currentStudyPlans = getCurrentStudyPlans();
  const totalPages = Math.ceil(filteredStudyPlans.length / itemsPerPage);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Study Plan Management</h1>
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
            <h1 className="text-3xl font-bold text-gray-800">Study Plan Management</h1>
            <p className="text-gray-600">
              Manage study plans and academic pathways
            </p>
          </div>
          <FormButton
            variant="primary"
            onClick={openAddModal}
          >
            Add New Study Plan
          </FormButton>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by ID, Pathway or Major..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Filter Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="pathwayName"
                  placeholder="Filter by Pathway..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.pathwayName}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="majorName"
                  placeholder="Filter by Major..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.majorName}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-center">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="h-4 w-4 inline mr-1" />
                Clear Filters
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
              {activeFilters.map((filter) => (
                <span 
                  key={filter.key} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {filter.label}
                  <button
                    type="button"
                    className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                    onClick={() => removeFilter(filter.key)}
                  >
                    <span className="sr-only">Remove filter</span>
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Study Plan ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pathway Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Credit Point
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Major Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStudyPlans.map((studyPlan) => (
                <tr key={studyPlan.studyPlanId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {studyPlan.studyPlanId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {studyPlan.pathwayName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {studyPlan.totalCreditPoint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {studyPlan.majorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditModal(studyPlan)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(studyPlan.studyPlanId)}
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

          {filteredStudyPlans.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No study plans found</p>
            </div>
          )}
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {editingStudyPlan ? 'Edit Study Plan' : 'Add New Study Plan'}
                  </h2>
                  <button 
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <ModernForm onSubmit={handleSubmit}>
                  <FormGroup>
                    <FormLabel required>Study Plan ID</FormLabel>
                    <FormInput
                      type="text"
                      name="studyPlanId"
                      value={formData.studyPlanId}
                      onChange={handleInputChange}
                      required
                      disabled={editingStudyPlan}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel required>Pathway Name</FormLabel>
                    <FormInput
                      type="text"
                      name="pathwayName"
                      value={formData.pathwayName}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel required>Total Credit Point</FormLabel>
                      <FormInput
                        type="number"
                        name="totalCreditPoint"
                        value={formData.totalCreditPoint}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>Major Name</FormLabel>
                      <FormInput
                        type="text"
                        name="majorName"
                        value={formData.majorName}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                    <FormButton
                      type="button"
                      variant="secondary"
                      onClick={closeModal}
                    >
                      Cancel
                    </FormButton>
                    <FormButton
                      type="submit"
                      variant="success"
                    >
                      {editingStudyPlan ? 'Update' : 'Create'}
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
          title="Delete Study Plan"
          message="Are you sure you want to delete this study plan? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default AdminStudyPlanManager;