import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Save, Edit, X, Trash2, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';

const AdminTuitionPaymentManager = () => {
  const [tuitionPayments, setTuitionPayments] = useState([]);
  const [students, setStudents] = useState([]); // 添加学生数据状态
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createData, setCreateData] = useState({
    studentId: '',
    scholarshipId: '',
    paymentStatus: 0, // 0 = Unpaid, 1 = Paid
    paymentMethod: 1, // 1 = Bank Transfer, 2 = Credit Card
    amountPaid: 0.0
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [paymentIdToDelete, setPaymentIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false); // 添加删除状态
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    student: '',
    paymentStatus: '',
    paymentMethod: '',
    minAmount: '',
    maxAmount: ''
  });

  useEffect(() => {
    fetchTuitionPayments();
    fetchStudents(); // 获取学生数据
  }, []);

  const fetchTuitionPayments = async () => {
    try {
      const response = await axiosInstance.get('/admin/tuition-payments');
      setTuitionPayments(response.data);
    } catch (error) {
      console.error('Failed to fetch tuition payments:', error);
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
      paymentStatus: '',
      paymentMethod: '',
      minAmount: '',
      maxAmount: ''
    });
    setCurrentPage(1);
  };

  // Filter and search tuition payments
  const filteredTuitionPayments = useMemo(() => {
    return tuitionPayments.filter(payment => {
      // Apply search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const studentName = getStudentName(payment.studentId).toLowerCase();
        if (!(payment.id.toString().includes(term) ||
              payment.studentId.toLowerCase().includes(term) ||
              (payment.scholarshipId && payment.scholarshipId.toLowerCase().includes(term)) ||
              studentName.includes(term))) {
          return false;
        }
      }

      // Apply student filter (ID or name)
      if (filters.student) {
        const studentTerm = filters.student.toLowerCase();
        const studentIdMatch = payment.studentId.toLowerCase().includes(studentTerm);
        const studentNameMatch = getStudentName(payment.studentId).toLowerCase().includes(studentTerm);
        if (!studentIdMatch && !studentNameMatch) {
          return false;
        }
      }

      // Apply payment status filter
      if (filters.paymentStatus !== '' && payment.paymentStatus.toString() !== filters.paymentStatus) {
        return false;
      }

      // Apply payment method filter
      if (filters.paymentMethod !== '' && payment.paymentMethod.toString() !== filters.paymentMethod) {
        return false;
      }

      // Apply amount filters
      if (filters.minAmount && payment.amountPaid < parseFloat(filters.minAmount)) {
        return false;
      }

      if (filters.maxAmount && payment.amountPaid > parseFloat(filters.maxAmount)) {
        return false;
      }

      return true;
    });
  }, [tuitionPayments, searchTerm, filters, students]);

  // Get current tuition payments for pagination
  const getCurrentTuitionPayments = () => {
    const indexOfLastPayment = currentPage * itemsPerPage;
    const indexOfFirstPayment = indexOfLastPayment - itemsPerPage;
    return filteredTuitionPayments.slice(indexOfFirstPayment, indexOfLastPayment);
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
    if (currentPage < Math.ceil(filteredTuitionPayments.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const createNewTuitionPayment = async () => {
    // Validation
    if (!createData.studentId) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await axiosInstance.post('/admin/tuition-payments', createData);
      
      alert('Tuition payment record created successfully!');
      
      // Reset form
      setCreateData({
        studentId: '',
        scholarshipId: '',
        paymentStatus: 0,
        paymentMethod: 1,
        amountPaid: 0.0
      });
      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page
      fetchTuitionPayments(); // Refresh the list
    } catch (error) {
      console.error('Create error:', error);
      alert('Network error occurred while creating tuition payment record');
    }
  };

  const saveEdit = async () => {
    try {
      const response = await axiosInstance.put(`/admin/tuition-payments/${editingId}`, {
        ...editData
      });
      
      alert('Tuition payment record updated successfully!');
      setEditingId(null);
      fetchTuitionPayments(); // Refresh the list
    } catch (error) {
      console.error('Update error:', error);
      alert('Network error occurred while updating tuition payment record');
    }
  };

  const deleteTuitionPayment = async (id) => {
    setPaymentIdToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setDeleting(true); // 设置删除状态
    try {
      await axiosInstance.delete(`/admin/tuition-payments/${paymentIdToDelete}`);
      
      alert('Tuition payment record deleted successfully!');
      // If we're on the last page and it becomes empty, go to previous page
      const totalPages = Math.ceil((filteredTuitionPayments.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
      fetchTuitionPayments(); // Refresh the list
    } catch (error) {
      console.error('Delete error:', error);
      alert('Network error occurred while deleting tuition payment record');
    } finally {
      setDeleting(false); // 重置删除状态
      setShowConfirmDialog(false);
      setPaymentIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setPaymentIdToDelete(null);
  };

  const getPaymentStatusText = (status) => {
    return status === 1 ? 'Paid' : 'Unpaid';
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 1: return 'Bank Transfer';
      case 2: return 'Credit Card';
      default: return 'Unknown';
    }
  };

  // Get current tuition payments
  const currentTuitionPayments = getCurrentTuitionPayments();
  const totalPages = Math.ceil(filteredTuitionPayments.length / itemsPerPage);
  
  // Check if any filters are active
  const hasActiveFilters = searchTerm || filters.student || filters.paymentStatus !== '' || 
    filters.paymentMethod !== '' || filters.minAmount || filters.maxAmount;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Panel - Tuition Payment Management
            </h1>
            <p className="text-gray-600">
              Manage student tuition payments • Total: {filteredTuitionPayments.length}
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
            
            {/* Payment Status Filter */}
            <div>
              <select
                value={filters.paymentStatus}
                onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="0">Unpaid</option>
                <option value="1">Paid</option>
              </select>
            </div>
            
            {/* Payment Method Filter */}
            <div>
              <select
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Methods</option>
                <option value="1">Bank Transfer</option>
                <option value="2">Credit Card</option>
              </select>
            </div>
          </div>
          
          {/* Amount Range Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <details className="group">
                <summary className="cursor-pointer flex items-center text-blue-600 hover:text-blue-800">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Amount Range</span>
                </summary>
                
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Min Amount</label>
                    <input
                      type="number"
                      value={filters.minAmount}
                      onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Max Amount</label>
                    <input
                      type="number"
                      value={filters.maxAmount}
                      onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="10000"
                    />
                  </div>
                </div>
              </details>
            </div>
            
            {/* Clear Filters Button */}
            <div className="flex items-end">
              {(hasActiveFilters) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
              
              {filters.paymentStatus !== '' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Status: {filters.paymentStatus === '0' ? 'Unpaid' : 'Paid'}
                  <button 
                    onClick={() => handleFilterChange('paymentStatus', '')}
                    className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.paymentMethod !== '' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Method: {filters.paymentMethod === '1' ? 'Bank Transfer' : 'Credit Card'}
                  <button 
                    onClick={() => handleFilterChange('paymentMethod', '')}
                    className="ml-1 inline-flex h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {(filters.minAmount || filters.maxAmount) && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Amount: {filters.minAmount || '0'} - {filters.maxAmount || '∞'}
                  <button 
                    onClick={() => {
                      handleFilterChange('minAmount', '');
                      handleFilterChange('maxAmount', '');
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

        {/* Create New Tuition Payment Form */}
        {showCreateForm && (
          // 修改为与其他管理页面相同的样式
          <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Create New Tuition Payment Record</h2>
                  <button 
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24}/>
                  </button>
                </div>
                
                <ModernForm>
                  <FormRow>
                    <FormGroup>
                      <FormLabel required>Student ID</FormLabel>
                      <FormInput
                        type="text"
                        value={createData.studentId}
                        onChange={(e) => setCreateData({...createData, studentId: e.target.value})}
                        placeholder="e.g., STU001"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel>Scholarship ID</FormLabel>
                      <FormInput
                        type="text"
                        value={createData.scholarshipId}
                        onChange={(e) => setCreateData({...createData, scholarshipId: e.target.value})}
                        placeholder="e.g., SCH001"
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel>Payment Status</FormLabel>
                      <FormSelect
                        value={createData.paymentStatus}
                        onChange={(e) => setCreateData({...createData, paymentStatus: parseInt(e.target.value)})}
                      >
                        <option value={0}>Unpaid</option>
                        <option value={1}>Paid</option>
                      </FormSelect>
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel>Payment Method</FormLabel>
                      <FormSelect
                        value={createData.paymentMethod}
                        onChange={(e) => setCreateData({...createData, paymentMethod: parseInt(e.target.value)})}
                      >
                        <option value={1}>Bank Transfer</option>
                        <option value={2}>Credit Card</option>
                      </FormSelect>
                    </FormGroup>
                  </FormRow>
                  
                  <FormGroup>
                    <FormLabel>Amount Paid</FormLabel>
                    <FormInput
                      type="number"
                      step="0.01"
                      value={createData.amountPaid}
                      onChange={(e) => setCreateData({...createData, amountPaid: parseFloat(e.target.value) || 0.0})}
                      placeholder="e.g., 1000.00"
                    />
                  </FormGroup>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                    <FormButton
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowCreateForm(false);
                        setCreateData({
                          studentId: '',
                          scholarshipId: '',
                          paymentStatus: 0,
                          paymentMethod: 1,
                          amountPaid: 0.0
                        });
                      }}
                    >
                      <X size={20} />
                      Cancel
                    </FormButton>
                    
                    <FormButton
                      type="button"
                      variant="success"
                      onClick={createNewTuitionPayment}
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

        {/* Existing Tuition Payments Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2">
            Existing Records ({filteredTuitionPayments.length})
          </h2>

          {filteredTuitionPayments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                {tuitionPayments.length === 0 
                  ? "No tuition payment records yet" 
                  : "No tuition payment records match your search criteria"}
              </p>
              {hasActiveFilters && (
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your search or filter criteria
                </p>
              )}
              <p className="text-gray-400 text-sm mt-2">Click "Create New Record" to add your first record</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scholarship ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount Paid
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentTuitionPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.studentId} - {getStudentName(payment.studentId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.scholarshipId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            payment.paymentStatus === 1 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {getPaymentStatusText(payment.paymentStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getPaymentMethodText(payment.paymentMethod)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${payment.amountPaid.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditingId(payment.id);
                              setEditData({
                                studentId: payment.studentId,
                                scholarshipId: payment.scholarshipId,
                                paymentStatus: payment.paymentStatus,
                                paymentMethod: payment.paymentMethod,
                                amountPaid: payment.amountPaid
                              });
                            }}
                            className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => deleteTuitionPayment(payment.id)}
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
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Edit Tuition Payment Record</h3>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24}/>
                    </button>
                  </div>
                  
                  <ModernForm>
                    <FormGroup>
                      <FormLabel required>Student ID</FormLabel>
                      <FormInput
                        type="text"
                        value={editData.studentId || ''}
                        onChange={(e) => setEditData({...editData, studentId: e.target.value})}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel>Scholarship ID</FormLabel>
                      <FormInput
                        type="text"
                        value={editData.scholarshipId || ''}
                        onChange={(e) => setEditData({...editData, scholarshipId: e.target.value})}
                      />
                    </FormGroup>
                    
                    <FormRow>
                      <FormGroup>
                        <FormLabel>Payment Status</FormLabel>
                        <FormSelect
                          value={editData.paymentStatus !== undefined ? editData.paymentStatus : 0}
                          onChange={(e) => setEditData({...editData, paymentStatus: parseInt(e.target.value)})}
                        >
                          <option value={0}>Unpaid</option>
                          <option value={1}>Paid</option>
                        </FormSelect>
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel>Payment Method</FormLabel>
                        <FormSelect
                          value={editData.paymentMethod !== undefined ? editData.paymentMethod : 1}
                          onChange={(e) => setEditData({...editData, paymentMethod: parseInt(e.target.value)})}
                        >
                          <option value={1}>Bank Transfer</option>
                          <option value={2}>Credit Card</option>
                        </FormSelect>
                      </FormGroup>
                    </FormRow>
                    
                    <FormGroup>
                      <FormLabel>Amount Paid</FormLabel>
                      <FormInput
                        type="number"
                        step="0.01"
                        value={editData.amountPaid || 0.0}
                        onChange={(e) => setEditData({...editData, amountPaid: parseFloat(e.target.value) || 0.0})}
                      />
                    </FormGroup>
                    
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
            title="Delete Tuition Payment Record"
            message="Are you sure you want to delete this tuition payment record? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            isDeleting={deleting} // 传递删除状态
          />
        </div>
      </div>
    </div>
  );
};

export default AdminTuitionPaymentManager;