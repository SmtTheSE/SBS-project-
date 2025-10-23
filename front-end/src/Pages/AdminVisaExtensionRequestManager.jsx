import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { ModernForm, FormButton } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';
import { Search, Filter, X } from 'lucide-react';

const AdminVisaExtensionRequestManager = () => {
  const [extensionRequests, setExtensionRequests] = useState([]);
  const [students, setStudents] = useState([]); // 添加学生数据状态
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [requestIdToDelete, setRequestIdToDelete] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    student: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchExtensionRequests();
    fetchStudents(); // 获取学生数据
  }, []);

  const fetchExtensionRequests = async () => {
    try {
      const response = await axiosInstance.get('/visa-extension-requests');
      setExtensionRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch visa extension requests:', error);
      setLoading(false);
    }
  };

  // 获取学生数据
  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get('/admin/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  // 获取学生姓名
  const getStudentName = (studentId) => {
    const student = students.find(s => s.studentId === studentId);
    return student ? `${student.firstName} ${student.lastName}` : studentId;
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
      student: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    });
    setCurrentPage(1);
  };

  // Filter and search extension requests
  const filteredExtensionRequests = useMemo(() => {
    return extensionRequests.filter(request => {
      // Apply search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const studentName = getStudentName(request.studentId).toLowerCase();
        if (!(request.extensionRequestId.toLowerCase().includes(term) ||
              request.studentId.toLowerCase().includes(term) ||
              request.visaPassportId.toLowerCase().includes(term) ||
              studentName.includes(term))) {
          return false;
        }
      }

      // Apply student filter (ID or name)
      if (filters.student) {
        const studentTerm = filters.student.toLowerCase();
        const studentIdMatch = request.studentId.toLowerCase().includes(studentTerm);
        const studentNameMatch = getStudentName(request.studentId).toLowerCase().includes(studentTerm);
        if (!studentIdMatch && !studentNameMatch) {
          return false;
        }
      }

      // Apply status filter
      if (filters.status !== '' && request.status.toString() !== filters.status) {
        return false;
      }

      // Apply date range filter
      if (filters.dateFrom || filters.dateTo) {
        const requestDate = new Date(request.requestDate);
        
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (requestDate < fromDate) {
            return false;
          }
        }
        
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          if (requestDate > toDate) {
            return false;
          }
        }
      }

      return true;
    });
  }, [extensionRequests, searchTerm, filters, students]);

  // Get current extension requests for pagination
  const getCurrentExtensionRequests = () => {
    const indexOfLastRequest = currentPage * itemsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
    return filteredExtensionRequests.slice(indexOfFirstRequest, indexOfLastRequest);
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
    if (currentPage < Math.ceil(filteredExtensionRequests.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      const request = extensionRequests.find(req => req.extensionRequestId === requestId);
      await axiosInstance.put(`/visa-extension-requests/${requestId}`, {
        ...request,
        status: status
      });
      
      // Update local state
      setExtensionRequests(prev => 
        prev.map(req => 
          req.extensionRequestId === requestId 
            ? { ...req, status: status } 
            : req
        )
      );
      
      alert('Request status updated successfully!');
    } catch (error) {
      console.error('Failed to update request status:', error);
      alert('Failed to update request status');
    }
  };

  // Function to delete a specific request
  const deleteRequest = async (requestId) => {
    setRequestIdToDelete(requestId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      // Delete the request
      await axiosInstance.delete(`/visa-extension-requests/${requestIdToDelete}`);
      
      // Update local state to remove the deleted request
      const updatedRequests = filteredExtensionRequests.filter(req => req.extensionRequestId !== requestIdToDelete);
      setExtensionRequests(updatedRequests);
      
      // If we're on the last page and it becomes empty, go to previous page
      const totalPages = Math.ceil((updatedRequests.length) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
      
      alert('Request deleted successfully!');
    } catch (error) {
      console.error('Failed to delete request:', error);
      alert('Failed to delete request');
    } finally {
      setShowConfirmDialog(false);
      setRequestIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setRequestIdToDelete(null);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Approved';
      case 2: return 'Rejected';
      default: return 'Unknown';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get current extension requests
  const currentExtensionRequests = getCurrentExtensionRequests();
  const totalPages = Math.ceil(filteredExtensionRequests.length / itemsPerPage);
  
  // Check if any filters are active
  const hasActiveFilters = searchTerm || filters.student || filters.status !== '' || 
    filters.dateFrom || filters.dateTo;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Visa Extension Requests</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Visa Extension Requests</h1>
            <p className="text-gray-600">
              Manage student visa extension requests • Total: {filteredExtensionRequests.length}
            </p>
          </div>
        </div>

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
                placeholder="Search by ID, Student..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Student Filter */}
            <div>
              <input
                type="text"
                value={filters.student}
                onChange={(e) => handleFilterChange('student', e.target.value)}
                placeholder="Filter by Student"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Status Filter */}
            <div>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="0">Pending</option>
                <option value="1">Approved</option>
                <option value="2">Rejected</option>
              </select>
            </div>
            
            {/* Date Range Filter */}
            <div className="relative">
              <details className="group">
                <summary className="cursor-pointer flex items-center text-blue-600 hover:text-blue-800">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Date Range</span>
                </summary>
                
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">From</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">To</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </details>
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
                
                {filters.student && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Student: {filters.student}
                    <button 
                      onClick={() => handleFilterChange('student', '')}
                      className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.status !== '' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Status: {filters.status === '0' ? 'Pending' : filters.status === '1' ? 'Approved' : 'Rejected'}
                    <button 
                      onClick={() => handleFilterChange('status', '')}
                      className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {(filters.dateFrom || filters.dateTo) && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Date: {filters.dateFrom || '...'} to {filters.dateTo || '...'}
                    <button 
                      onClick={() => {
                        handleFilterChange('dateFrom', '');
                        handleFilterChange('dateTo', '');
                      }}
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

        {/* Table */}
        {filteredExtensionRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              {extensionRequests.length === 0 
                ? "No visa extension requests found" 
                : "No visa extension requests match your search criteria"}
            </p>
            {hasActiveFilters && (
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search or filter criteria
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visa Passport ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested Extension Until
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentExtensionRequests.map((request) => (
                    <tr key={request.extensionRequestId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.extensionRequestId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.studentId} - {getStudentName(request.studentId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.visaPassportId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.requestDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.requestedExtensionUntil}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {request.notes || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.status === 0 && ( // Only show approve/reject for pending requests
                          <>
                            <FormButton
                              type="button"
                              variant="success"
                              onClick={() => updateRequestStatus(request.extensionRequestId, 1)}
                              className="mr-2"
                            >
                              Approve
                            </FormButton>
                            <FormButton
                              type="button"
                              variant="danger"
                              onClick={() => updateRequestStatus(request.extensionRequestId, 2)}
                              className="mr-2"
                            >
                              Reject
                            </FormButton>
                          </>
                        )}
                        <FormButton
                          type="button"
                          variant="secondary"
                          onClick={() => deleteRequest(request.extensionRequestId)}
                        >
                          Delete
                        </FormButton>
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

        {/* Custom Confirm Dialog */}
        <CustomConfirmDialog
          isOpen={showConfirmDialog}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Visa Extension Request"
          message="Are you sure you want to delete this visa extension request? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default AdminVisaExtensionRequestManager;