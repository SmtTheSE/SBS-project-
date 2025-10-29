import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ModernForm, FormButton } from '../Components/ModernForm';
import { Search, Filter } from 'lucide-react';

const AdminTranscriptRequestManager = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    student: '',
    status: '',
    type: ''
  });

  // 添加分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filtered requests based on search and filters
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // Apply search term
      const matchesSearch = !searchTerm || 
        (request.request?.requestId && request.request.requestId.toString().includes(searchTerm)) ||
        (request.student?.studentId && request.student.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (request.student?.firstName && request.student.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (request.student?.lastName && request.student.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (request.request?.optionalMessage && request.request.optionalMessage.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Apply filters
      const matchesStudent = !filters.student || 
        (request.student?.studentId && request.student.studentId.toLowerCase().includes(filters.student.toLowerCase())) ||
        (request.student?.firstName && request.student.firstName.toLowerCase().includes(filters.student.toLowerCase())) ||
        (request.student?.lastName && request.student.lastName.toLowerCase().includes(filters.student.toLowerCase()));
      
      const matchesStatus = !filters.status || 
        (request.requestStatus && request.requestStatus.toLowerCase().includes(filters.status.toLowerCase()));
      
      const requestType = request.request?.transcriptType === 0 ? 'Unofficial' : 
                         request.request?.transcriptType === 1 ? 'Official' : 'Unknown';
      const matchesType = !filters.type || 
        requestType.toLowerCase().includes(filters.type.toLowerCase());
      
      return matchesSearch && matchesStudent && matchesStatus && matchesType;
    });
  }, [requests, searchTerm, filters]);

  // 获取当前页面的请求数据
  const getCurrentRequests = () => {
    const indexOfLastRequest = currentPage * itemsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
    return filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  };

  // 分页控制函数
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredRequests.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      student: '',
      status: '',
      type: ''
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
    if (filters.student) filtersList.push({ key: 'student', label: `Student: ${filters.student}` });
    if (filters.status) filtersList.push({ key: 'status', label: `Status: ${filters.status}` });
    if (filters.type) filtersList.push({ key: 'type', label: `Type: ${filters.type}` });
    return filtersList;
  }, [searchTerm, filters]);

  useEffect(() => {
    fetchTranscriptRequests();
  }, []);

  const fetchTranscriptRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/academic/transcript-requests/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setRequests(response.data.data);
        // 添加新记录后返回第一页
        setCurrentPage(1);
      } else {
        setError('Failed to fetch transcript requests');
      }
    } catch (err) {
      setError('Error fetching transcript requests: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8080/api/academic/transcript-requests/${requestId}/status?status=${status}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // Update the local state
        setRequests(requests.map(req => 
          req.id === requestId ? { ...req, requestStatus: status } : req
        ));
      } else {
        setError('Failed to update request status');
      }
    } catch (err) {
      setError('Error updating request status: ' + err.message);
    }
  };

  // 计算总页数
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // 获取当前页面的数据
  const currentRequests = getCurrentRequests();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Transcript Request Management</h1>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading transcript requests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Transcript Request Management</h1>
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error: {error}</p>
            <FormButton 
              variant="primary"
              onClick={fetchTranscriptRequests}
              className="mt-4"
            >
              Retry
            </FormButton>
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
            <h1 className="text-3xl font-bold text-gray-800">Transcript Request Management</h1>
            <p className="text-gray-600">
              Manage student transcript requests • Total: {filteredRequests.length}
            </p>
          </div>
        </div>
        
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
                placeholder="Search by ID, Student, or Message..."
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
                  name="student"
                  placeholder="Filter by Student"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.student}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <select
                  name="status"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Issued">Issued</option>
                </select>
              </div>
              <div>
                <select
                  name="type"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  <option value="Official">Official</option>
                  <option value="Unofficial">Unofficial</option>
                </select>
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
        
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              {searchTerm || filters.student || filters.status || filters.type 
                ? 'No transcript requests match your search criteria' 
                : 'No transcript requests found'}
            </p>
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
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.request?.requestId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.student?.studentId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.student?.firstName || ''} {request.student?.lastName || ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.request?.transcriptType === 0 ? 'Unofficial' : 
                         request.request?.transcriptType === 1 ? 'Official' : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.request?.requestDate ? new Date(request.request.requestDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.requestStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.requestStatus === 'Approved' ? 'bg-blue-100 text-blue-800' :
                          request.requestStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                          request.requestStatus === 'Issued' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.requestStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {request.optionalMessage || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.requestStatus === 'Pending' && (
                          <div className="flex space-x-2">
                            <FormButton
                              variant="success"
                              onClick={() => updateRequestStatus(request.id, 'Approved')}
                              className="mr-2"
                            >
                              Approve
                            </FormButton>
                            <FormButton
                              variant="danger"
                              onClick={() => updateRequestStatus(request.id, 'Rejected')}
                            >
                              Reject
                            </FormButton>
                          </div>
                        )}
                        {request.requestStatus === 'Approved' && (
                          <FormButton
                            variant="primary"
                            onClick={() => updateRequestStatus(request.id, 'Issued')}
                          >
                            Mark as Issued
                          </FormButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {filteredRequests.length > itemsPerPage && (
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
          </>
        )}
      </div>
    </div>
  );
};

export default AdminTranscriptRequestManager;