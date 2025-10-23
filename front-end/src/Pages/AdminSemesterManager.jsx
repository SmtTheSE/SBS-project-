import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormButton } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';
import { Search, Filter } from 'lucide-react';

const AdminSemesterManager = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [formData, setFormData] = useState({
    semesterId: '',
    year: '',
    intakeMonth: '',
    term: ''
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [semesterIdToDelete, setSemesterIdToDelete] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    intakeMonth: '',
    term: ''
  });

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filtered semesters based on search and filters
  const filteredSemesters = useMemo(() => {
    return semesters.filter(semester => {
      // Apply search term
      const matchesSearch = !searchTerm || 
        semester.semesterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (semester.year && semester.year.toLowerCase().includes(searchTerm.toLowerCase())) ||
        semester.intakeMonth.toLowerCase().includes(searchTerm.toLowerCase()) ||
        semester.term.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply filters
      const matchesYear = !filters.year || 
        (semester.year && semester.year.toLowerCase().includes(filters.year.toLowerCase()));
      const matchesIntakeMonth = !filters.intakeMonth || 
        semester.intakeMonth.toLowerCase().includes(filters.intakeMonth.toLowerCase());
      const matchesTerm = !filters.term || 
        semester.term.toLowerCase().includes(filters.term.toLowerCase());
      
      return matchesSearch && matchesYear && matchesIntakeMonth && matchesTerm;
    });
  }, [semesters, searchTerm, filters]);

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await axiosInstance.get('/academic/semesters');
      // Ensure we're working with an array
      if (Array.isArray(response.data)) {
        setSemesters(response.data);
      } else {
        console.error('Unexpected response format for semesters:', response.data);
        setSemesters([]);
        setError('Unexpected data format received for semesters');
      }
      setLoading(false);
      // 添加新记录时返回第一页
      setCurrentPage(1);
    } catch (error) {
      console.error('Failed to fetch semesters:', error);
      setError('Failed to fetch semesters: ' + (error.response?.data?.message || error.message));
      setSemesters([]);
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
      const semesterData = {
        ...formData,
        year: formData.year ? new Date(formData.year).toISOString().split('T')[0] : null
      };

      if (editingSemester) {
        // Update existing semester
        await axiosInstance.put(`/academic/semesters/${formData.semesterId}`, semesterData);
      } else {
        // Create new semester
        await axiosInstance.post('/academic/semesters', semesterData);
      }
      
      // Reset form and refresh data
      setFormData({
        semesterId: '',
        year: '',
        intakeMonth: '',
        term: ''
      });
      setEditingSemester(null);
      setShowForm(false);
      fetchSemesters();
    } catch (error) {
      console.error('Failed to save semester:', error);
      setError('Failed to save semester: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (semester) => {
    setFormData({
      semesterId: semester.semesterId,
      year: semester.year || '',
      intakeMonth: semester.intakeMonth,
      term: semester.term
    });
    setEditingSemester(semester);
    setShowForm(true);
  };

  const handleDelete = async (semesterId) => {
    setSemesterIdToDelete(semesterId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/academic/semesters/${semesterIdToDelete}`);
      fetchSemesters();
      // 删除记录后检查当前页是否为空
      const totalItems = filteredSemesters.length - 1; // 删除后的总数
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    } catch (error) {
      console.error('Failed to delete semester:', error);
      setError('Failed to delete semester: ' + (error.response?.data?.message || error.message));
    } finally {
      setShowConfirmDialog(false);
      setSemesterIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setSemesterIdToDelete(null);
  };

  const handleCancel = () => {
    setFormData({
      semesterId: '',
      year: '',
      intakeMonth: '',
      term: ''
    });
    setEditingSemester(null);
    setShowForm(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      year: '',
      intakeMonth: '',
      term: ''
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
    if (filters.year) filtersList.push({ key: 'year', label: `Year: ${filters.year}` });
    if (filters.intakeMonth) filtersList.push({ key: 'intakeMonth', label: `Intake: ${filters.intakeMonth}` });
    if (filters.term) filtersList.push({ key: 'term', label: `Term: ${filters.term}` });
    return filtersList;
  }, [searchTerm, filters]);

  // 获取当前页面的学期数据
  const getCurrentSemesters = () => {
    const indexOfLastSemester = currentPage * itemsPerPage;
    const indexOfFirstSemester = indexOfLastSemester - itemsPerPage;
    return Array.isArray(filteredSemesters) ? filteredSemesters.slice(indexOfFirstSemester, indexOfLastSemester) : [];
  };

  // 分页控制函数
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    const totalItems = Array.isArray(filteredSemesters) ? filteredSemesters.length : 0;
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Semester Management</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // 获取当前页面的数据
  const currentSemesters = getCurrentSemesters();
  const totalPages = Math.ceil((Array.isArray(filteredSemesters) ? filteredSemesters.length : 0) / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Semester Management</h1>
          <FormButton
            variant="primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add New'}
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
                placeholder="Search by ID, Year, Month or Term..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Filter Inputs */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  name="year"
                  placeholder="Filter by Year"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.year}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="intakeMonth"
                  placeholder="Filter by Month"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.intakeMonth}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="term"
                  placeholder="Filter by Term"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.term}
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

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {editingSemester ? 'Edit Semester' : 'Add New Semester'}
                  </h2>
                  <button 
                    onClick={handleCancel}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <ModernForm onSubmit={handleSubmit}>
                  <FormRow>
                    <FormGroup>
                      <FormLabel required>Semester ID</FormLabel>
                      <FormInput
                        type="text"
                        name="semesterId"
                        value={formData.semesterId}
                        onChange={handleInputChange}
                        required
                        disabled={editingSemester}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>Year</FormLabel>
                      <FormInput
                        type="date"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel required>Intake Month</FormLabel>
                      <FormInput
                        type="text"
                        name="intakeMonth"
                        value={formData.intakeMonth}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>Term</FormLabel>
                      <FormInput
                        type="text"
                        name="term"
                        value={formData.term}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                    <FormButton
                      type="button"
                      variant="secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </FormButton>
                    <FormButton
                      type="submit"
                      variant="success"
                    >
                      {editingSemester ? 'Update' : 'Create'}
                    </FormButton>
                  </div>
                </ModernForm>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intake Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Term
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSemesters.map((semester) => (
                <tr key={semester.semesterId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {semester.semesterId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {semester.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {semester.intakeMonth}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {semester.term}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(semester)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(semester.semesterId)}
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {currentSemesters.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No semesters found</p>
            </div>
          )}
          
          {Array.isArray(filteredSemesters) && filteredSemesters.length === 0 && searchTerm && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No semesters match your search criteria</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {Array.isArray(filteredSemesters) && filteredSemesters.length > itemsPerPage && (
          <div className="flex justify-center items-center space-x-2 my-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Custom Confirm Dialog */}
        <CustomConfirmDialog
          isOpen={showConfirmDialog}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Semester"
          message="Are you sure you want to delete this semester? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default AdminSemesterManager;