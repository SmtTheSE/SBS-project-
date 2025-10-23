import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Save, Edit, X, Trash2, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton, FormSection } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';

const AdminVisaPassportManager = () => {
  const [visaPassports, setVisaPassports] = useState([]);
  const [students, setStudents] = useState([]); // 添加学生数据状态
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [visaPassportIdToDelete, setVisaPassportIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false); // 添加删除状态
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    student: '',
    visaType: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchVisaPassports();
    fetchStudents(); // 获取学生数据
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
      visaType: '',
      dateFrom: '',
      dateTo: ''
    });
    setCurrentPage(1);
  };

  // Filter and search visa passports
  const filteredVisaPassports = useMemo(() => {
    return visaPassports.filter(record => {
      // Apply search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const studentName = getStudentName(record.studentId).toLowerCase();
        if (!(record.visaPassportId.toLowerCase().includes(term) ||
              record.studentId.toLowerCase().includes(term) ||
              record.visaId.toLowerCase().includes(term) ||
              record.passportNumber.toLowerCase().includes(term) ||
              studentName.includes(term))) {
          return false;
        }
      }

      // Apply student filter (ID or name)
      if (filters.student) {
        const studentTerm = filters.student.toLowerCase();
        const studentIdMatch = record.studentId.toLowerCase().includes(studentTerm);
        const studentNameMatch = getStudentName(record.studentId).toLowerCase().includes(studentTerm);
        if (!studentIdMatch && !studentNameMatch) {
          return false;
        }
      }

      // Apply visa type filter
      if (filters.visaType && record.visaType.toString() !== filters.visaType) {
        return false;
      }

      // Apply date range filter
      if (filters.dateFrom || filters.dateTo) {
        const visaIssued = new Date(record.visaIssuedDate);
        const visaExpired = new Date(record.visaExpiredDate);
        const passportIssued = new Date(record.passportIssuedDate);
        const passportExpired = new Date(record.passportExpiredDate);
        
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (visaIssued < fromDate && visaExpired < fromDate && 
              passportIssued < fromDate && passportExpired < fromDate) {
            return false;
          }
        }
        
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          if (visaIssued > toDate && visaExpired > toDate && 
              passportIssued > toDate && passportExpired > toDate) {
            return false;
          }
        }
      }

      return true;
    });
  }, [visaPassports, searchTerm, filters, students]);

  // Get current visa/passport records for pagination
  const getCurrentVisaPassports = () => {
    const indexOfLastRecord = currentPage * itemsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
    return filteredVisaPassports.slice(indexOfFirstRecord, indexOfLastRecord);
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
    const totalPages = Math.ceil(filteredVisaPassports.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
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
      setCurrentPage(1); // Reset to first page
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
    setVisaPassportIdToDelete(visaPassportId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setDeleting(true); // 设置删除状态
    try {
      await axiosInstance.delete(`/admin/visa-passports/${visaPassportIdToDelete}`);
      
      alert('Visa/Passport record deleted successfully!');
      // If we're on the last page and it becomes empty, go to previous page
      const totalPages = Math.ceil((filteredVisaPassports.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
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
    } finally {
      setDeleting(false); // 重置删除状态
      setShowConfirmDialog(false);
      setVisaPassportIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setVisaPassportIdToDelete(null);
  };

  const getVisaTypeText = (visaType) => {
    return visaType === 1 ? 'Multiple Entry' : 'Single Entry';
  };

  // Get current visa/passport records
  const currentVisaPassports = getCurrentVisaPassports();
  const totalPages = Math.ceil(filteredVisaPassports.length / itemsPerPage);
  
  // Check if any filters are active
  const hasActiveFilters = searchTerm || filters.student || filters.visaType || filters.dateFrom || filters.dateTo;

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
              Manage student visa and passport information • Total: {filteredVisaPassports.length}
            </p>
          </div>

          <FormButton
            variant="primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus size={20} />
            {showCreateForm ? 'Cancel' : 'Create New Record'}
          </FormButton>
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
                placeholder="Search by ID, Visa ID, Passport or Student..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Student Filter */}
            <div>
              <input
                type="text"
                value={filters.student}
                onChange={(e) => handleFilterChange('student', e.target.value)}
                placeholder="Filter by Student ID or Name"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Visa Type Filter */}
            <div>
              <select
                value={filters.visaType}
                onChange={(e) => handleFilterChange('visaType', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Visa Types</option>
                <option value="0">Single Entry</option>
                <option value="1">Multiple Entry</option>
              </select>
            </div>
            
            {/* Date Range Filter */}
            <div className="relative">
              <details className="group">
                <summary className="cursor-pointer flex items-center text-blue-600 hover:text-blue-800">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Date Range</span>
                </summary>
                
                <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">From</label>
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">To</label>
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </details>
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
              
              {filters.visaType && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Visa Type: {filters.visaType === '0' ? 'Single Entry' : 'Multiple Entry'}
                  <button 
                    onClick={() => handleFilterChange('visaType', '')}
                    className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {(filters.dateFrom || filters.dateTo) && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Date Range: {filters.dateFrom || '...'} to {filters.dateTo || '...'}
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
              
              <button
                onClick={clearFilters}
                className="ml-2 px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Create New Visa/Passport Form */}
        {showCreateForm && (
          // 修改为与其他管理页面相同的样式
          <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Create New Visa/Passport Record</h3>
                  <button 
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24}/>
                  </button>
                </div>
                
                <ModernForm>
                  <FormSection title="Visa Information">
                    <FormRow>
                      <FormGroup>
                        <FormLabel required>Visa Passport ID</FormLabel>
                        <FormInput
                          type="text"
                          value={createData.visaPassportId}
                          onChange={(e) => setCreateData({...createData, visaPassportId: e.target.value})}
                          placeholder="e.g., VP001"
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel required>Student ID</FormLabel>
                        <FormInput
                          type="text"
                          value={createData.studentId}
                          onChange={(e) => setCreateData({...createData, studentId: e.target.value})}
                          placeholder="e.g., STU001"
                        />
                      </FormGroup>
                    </FormRow>
                    
                    <FormRow>
                      <FormGroup>
                        <FormLabel required>Visa ID</FormLabel>
                        <FormInput
                          type="text"
                          value={createData.visaId}
                          onChange={(e) => setCreateData({...createData, visaId: e.target.value})}
                          placeholder="e.g., VISA123"
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel required>Visa Type</FormLabel>
                        <FormSelect
                          value={createData.visaType}
                          onChange={(e) => setCreateData({...createData, visaType: parseInt(e.target.value)})}
                        >
                          <option value={0}>Single Entry</option>
                          <option value={1}>Multiple Entry</option>
                        </FormSelect>
                      </FormGroup>
                    </FormRow>
                    
                    <FormRow>
                      <FormGroup>
                        <FormLabel required>Visa Issued Date</FormLabel>
                        <FormInput
                          type="date"
                          value={createData.visaIssuedDate}
                          onChange={(e) => setCreateData({...createData, visaIssuedDate: e.target.value})}
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel required>Visa Expired Date</FormLabel>
                        <FormInput
                          type="date"
                          value={createData.visaExpiredDate}
                          onChange={(e) => setCreateData({...createData, visaExpiredDate: e.target.value})}
                        />
                      </FormGroup>
                    </FormRow>
                  </FormSection>
                  
                  <FormSection title="Passport Information">
                    <FormRow>
                      <FormGroup>
                        <FormLabel required>Passport Number</FormLabel>
                        <FormInput
                          type="text"
                          value={createData.passportNumber}
                          onChange={(e) => setCreateData({...createData, passportNumber: e.target.value})}
                          placeholder="e.g., P12345678"
                        />
                      </FormGroup>
                    </FormRow>
                    
                    <FormRow>
                      <FormGroup>
                        <FormLabel required>Passport Issued Date</FormLabel>
                        <FormInput
                          type="date"
                          value={createData.passportIssuedDate}
                          onChange={(e) => setCreateData({...createData, passportIssuedDate: e.target.value})}
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel required>Passport Expired Date</FormLabel>
                        <FormInput
                          type="date"
                          value={createData.passportExpiredDate}
                          onChange={(e) => setCreateData({...createData, passportExpiredDate: e.target.value})}
                        />
                      </FormGroup>
                    </FormRow>
                  </FormSection>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                    <FormButton
                      type="button"
                      variant="secondary"
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
                    >
                      <X size={20} />
                      Cancel
                    </FormButton>
                    
                    <FormButton
                      type="button"
                      variant="success"
                      onClick={createNewVisaPassport}
                    >
                      <Save size={20} />
                      Create Record
                    </FormButton>
                  </div>
                </ModernForm>
              </div>
            </div>
          </div>
        )}

        {/* Existing Visa/Passport Records Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2">
            Existing Records ({filteredVisaPassports.length})
          </h2>

          {filteredVisaPassports.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                {visaPassports.length === 0 
                  ? "No visa/passport records yet" 
                  : "No visa/passport records match your search criteria"}
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
                        Visa Passport ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visa ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visa Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visa Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Passport Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Passport Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentVisaPassports.map((record) => (
                      <tr key={record.visaPassportId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.visaPassportId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.studentId} - {getStudentName(record.studentId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.visaId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div>Issued: {record.visaIssuedDate}</div>
                          <div>Expired: {record.visaExpiredDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getVisaTypeText(record.visaType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.passportNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div>Issued: {record.passportIssuedDate}</div>
                          <div>Expired: {record.passportExpiredDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                            className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => deleteVisaPassport(record.visaPassportId)}
                            disabled={deleting} // 禁用按钮当正在删除时
                            className={`p-2 rounded-full ${
                              deleting 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
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
                      <ChevronLeft size={16} />
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
                      <ChevronRight size={16} />
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
          
          {/* Edit Modal */}
          {editingId && (
            // 修改为与其他管理页面相同的样式
            <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
                  
                  <ModernForm>
                    <FormRow>
                      {/* Visa Information */}
                      <div>
                        <FormSection title="Visa Information">
                          <FormGroup>
                            <FormLabel required>Student ID</FormLabel>
                            <FormInput
                              type="text"
                              value={editData.studentId || ''}
                              onChange={(e) => setEditData({...editData, studentId: e.target.value})}
                            />
                          </FormGroup>
                          
                          <FormGroup>
                            <FormLabel required>Visa ID</FormLabel>
                            <FormInput
                              type="text"
                              value={editData.visaId || ''}
                              onChange={(e) => setEditData({...editData, visaId: e.target.value})}
                            />
                          </FormGroup>
                          
                          <FormRow>
                            <FormGroup>
                              <FormLabel required>Visa Issued Date</FormLabel>
                              <FormInput
                                type="date"
                                value={editData.visaIssuedDate || ''}
                                onChange={(e) => setEditData({...editData, visaIssuedDate: e.target.value})}
                              />
                            </FormGroup>
                            
                            <FormGroup>
                              <FormLabel required>Visa Expired Date</FormLabel>
                              <FormInput
                                type="date"
                                value={editData.visaExpiredDate || ''}
                                onChange={(e) => setEditData({...editData, visaExpiredDate: e.target.value})}
                              />
                            </FormGroup>
                          </FormRow>
                          
                          <FormGroup>
                            <FormLabel required>Visa Type</FormLabel>
                            <FormSelect
                              value={editData.visaType !== undefined ? editData.visaType : 0}
                              onChange={(e) => setEditData({...editData, visaType: parseInt(e.target.value)})}
                            >
                              <option value={0}>Single Entry</option>
                              <option value={1}>Multiple Entry</option>
                            </FormSelect>
                          </FormGroup>
                        </FormSection>
                      </div>
                      
                      {/* Passport Information */}
                      <div>
                        <FormSection title="Passport Information">
                          <FormGroup>
                            <FormLabel required>Passport Number</FormLabel>
                            <FormInput
                              type="text"
                              value={editData.passportNumber || ''}
                              onChange={(e) => setEditData({...editData, passportNumber: e.target.value})}
                            />
                          </FormGroup>
                          
                          <FormRow>
                            <FormGroup>
                              <FormLabel required>Passport Issued Date</FormLabel>
                              <FormInput
                                type="date"
                                value={editData.passportIssuedDate || ''}
                                onChange={(e) => setEditData({...editData, passportIssuedDate: e.target.value})}
                              />
                            </FormGroup>
                            
                            <FormGroup>
                              <FormLabel required>Passport Expired Date</FormLabel>
                              <FormInput
                                type="date"
                                value={editData.passportExpiredDate || ''}
                                onChange={(e) => setEditData({...editData, passportExpiredDate: e.target.value})}
                              />
                            </FormGroup>
                          </FormRow>
                        </FormSection>
                      </div>
                    </FormRow>
                    
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                      <FormButton
                        type="button"
                        variant="secondary"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </FormButton>
                      
                      <FormButton
                        type="button"
                        variant="success"
                        onClick={saveEdit}
                      >
                        Save Changes
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
            title="Delete Visa/Passport Record"
            message="Are you sure you want to delete this visa/passport record? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            isDeleting={deleting} // 传递删除状态
          />
        </div>
      </div>
    </div>
  );
};

export default AdminVisaPassportManager;