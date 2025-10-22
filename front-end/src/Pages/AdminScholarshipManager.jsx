import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Plus, Save, X, Edit, Trash2, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton, FormSection } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';

const AdminScholarshipManager = () => {
  const [scholarships, setScholarships] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentScholarships, setStudentScholarships] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignData, setAssignData] = useState({
    studentId: '',
    scholarshipId: '',
    scholarshipPercentage: 0
  });
  const [createData, setCreateData] = useState({
    scholarshipId: '',
    scholarshipType: '',
    amount: 0.0,
    description: ''
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(''); // 'deleteScholarship' or 'deleteStudentScholarship'
  const [itemIdToDelete, setItemIdToDelete] = useState(null); // ID of item to delete
  const [deleting, setDeleting] = useState(false); // 添加删除状态
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currentStudentScholarshipsPage, setCurrentStudentScholarshipsPage] = useState(1);

  useEffect(() => {
    fetchScholarships();
    fetchStudents();
    fetchStudentScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await axiosInstance.get('/admin/scholarships');
      setScholarships(response.data);
    } catch (error) {
      console.error('Failed to fetch scholarships:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get('/admin/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const fetchStudentScholarships = async () => {
    try {
      const response = await axiosInstance.get('/admin/student-scholarships');
      setStudentScholarships(response.data);
    } catch (error) {
      console.error('Failed to fetch student scholarships:', error);
    }
  };

  // Get current scholarships for pagination
  const getCurrentScholarships = () => {
    const indexOfLastScholarship = currentPage * itemsPerPage;
    const indexOfFirstScholarship = indexOfLastScholarship - itemsPerPage;
    return scholarships.slice(indexOfFirstScholarship, indexOfLastScholarship);
  };

  // Get current student scholarships for pagination
  const getCurrentStudentScholarships = () => {
    const indexOfLastRecord = currentStudentScholarshipsPage * itemsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
    return studentScholarships.slice(indexOfFirstRecord, indexOfLastRecord);
  };

  // Change page for scholarships
  const paginateScholarships = (pageNumber) => setCurrentPage(pageNumber);
  
  // Previous page for scholarships
  const prevScholarshipsPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Next page for scholarships
  const nextScholarshipsPage = () => {
    if (currentPage < Math.ceil(scholarships.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Change page for student scholarships
  const paginateStudentScholarships = (pageNumber) => setCurrentStudentScholarshipsPage(pageNumber);
  
  // Previous page for student scholarships
  const prevStudentScholarshipsPage = () => {
    if (currentStudentScholarshipsPage > 1) {
      setCurrentStudentScholarshipsPage(currentStudentScholarshipsPage - 1);
    }
  };
  
  // Next page for student scholarships
  const nextStudentScholarshipsPage = () => {
    if (currentStudentScholarshipsPage < Math.ceil(studentScholarships.length / itemsPerPage)) {
      setCurrentStudentScholarshipsPage(currentStudentScholarshipsPage + 1);
    }
  };

  const createNewScholarship = async () => {
    // Validation
    if (!createData.scholarshipId || !createData.scholarshipType) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await axiosInstance.post('/admin/scholarships', createData);
      
      alert('Scholarship created successfully!');
      
      // Reset form
      setCreateData({
        scholarshipId: '',
        scholarshipType: '',
        amount: 0.0,
        description: ''
      });
      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page
      fetchScholarships(); // Refresh the list
    } catch (error) {
      console.error('Create error:', error);
      alert('Network error occurred while creating scholarship');
    }
  };

  const assignScholarshipToStudent = async () => {
    // Validation
    if (!assignData.studentId || !assignData.scholarshipId) {
      alert('Please select both student and scholarship');
      return;
    }

    if (assignData.scholarshipPercentage < 0 || assignData.scholarshipPercentage > 100) {
      alert('Scholarship percentage must be between 0 and 100');
      return;
    }

    try {
      const response = await axiosInstance.post('/admin/student-scholarships', assignData);
      
      alert('Scholarship assigned to student successfully!');
      
      // Reset form
      setAssignData({
        studentId: '',
        scholarshipId: '',
        scholarshipPercentage: 0
      });
      setShowAssignForm(false);
      setCurrentStudentScholarshipsPage(1); // Reset to first page
      fetchStudentScholarships(); // Refresh the list
    } catch (error) {
      console.error('Assign error:', error);
      alert('Network error occurred while assigning scholarship');
    }
  };

  const saveEdit = async () => {
    try {
      const response = await axiosInstance.put(`/admin/scholarships/${editingId}`, {
        ...editData,
        scholarshipId: editingId
      });
      
      alert('Scholarship updated successfully!');
      setEditingId(null);
      fetchScholarships(); // Refresh the list
    } catch (error) {
      console.error('Update error:', error);
      alert('Network error occurred while updating scholarship');
    }
  };

  const deleteScholarship = async (scholarshipId) => {
    setConfirmAction('deleteScholarship');
    setItemIdToDelete(scholarshipId);
    setShowConfirmDialog(true);
  };

  const deleteStudentScholarship = async (id) => {
    setConfirmAction('deleteStudentScholarship');
    setItemIdToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setDeleting(true); // 设置删除状态
    try {
      if (confirmAction === 'deleteScholarship') {
        await axiosInstance.delete(`/admin/scholarships/${itemIdToDelete}`);
        alert('Scholarship deleted successfully!');
        // If we're on the last page and it becomes empty, go to previous page
        const totalPages = Math.ceil((scholarships.length - 1) / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
        fetchScholarships(); // Refresh the list
      } else if (confirmAction === 'deleteStudentScholarship') {
        await axiosInstance.delete(`/admin/student-scholarships/${itemIdToDelete}`);
        alert('Scholarship assignment removed successfully!');
        // If we're on the last page and it becomes empty, go to previous page
        const totalPages = Math.ceil((studentScholarships.length - 1) / itemsPerPage);
        if (currentStudentScholarshipsPage > totalPages && totalPages > 0) {
          setCurrentStudentScholarshipsPage(totalPages);
        }
        fetchStudentScholarships(); // Refresh the list
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Network error occurred while deleting');
    } finally {
      setDeleting(false); // 重置删除状态
      setShowConfirmDialog(false);
      setConfirmAction('');
      setItemIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setConfirmAction('');
    setItemIdToDelete(null);
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.studentId === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  };

  const getScholarshipType = (scholarshipId) => {
    const scholarship = scholarships.find(s => s.scholarshipId === scholarshipId);
    return scholarship ? scholarship.scholarshipType : 'Unknown Scholarship';
  };

  // Get current data for pagination
  const currentScholarships = getCurrentScholarships();
  const currentStudentScholarshipRecords = getCurrentStudentScholarships();
  const scholarshipsTotalPages = Math.ceil(scholarships.length / itemsPerPage);
  const studentScholarshipsTotalPages = Math.ceil(studentScholarships.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Panel - Scholarship Management
            </h1>
            <p className="text-gray-600">
              Manage student scholarships • Total: {scholarships.length}
            </p>
          </div>

          <div className="flex gap-2">
            <FormButton
              variant="primary"
              onClick={() => setShowAssignForm(!showAssignForm)}
            >
              <Users size={20} />
              {showAssignForm ? 'Cancel Assign' : 'Assign to Student'}
            </FormButton>
            
            <FormButton
              variant="primary"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Plus size={20} />
              {showCreateForm ? 'Cancel' : 'Create New'}
            </FormButton>
          </div>
        </div>

        {/* Assign Scholarship to Student Form */}
        {showAssignForm && (
          // 修改为与其他管理页面相同的样式
          <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Assign Scholarship to Student</h2>
                  <button 
                    onClick={() => setShowAssignForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24}/>
                  </button>
                </div>
                
                <ModernForm>
                  <FormRow>
                    <FormGroup>
                      <FormLabel required>Select Student</FormLabel>
                      <FormSelect
                        value={assignData.studentId}
                        onChange={(e) => setAssignData({...assignData, studentId: e.target.value})}
                      >
                        <option value="">Choose a student</option>
                        {students.map(student => (
                          <option key={student.studentId} value={student.studentId}>
                            {student.studentId} - {student.firstName} {student.lastName}
                          </option>
                        ))}
                      </FormSelect>
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>Select Scholarship</FormLabel>
                      <FormSelect
                        value={assignData.scholarshipId}
                        onChange={(e) => setAssignData({...assignData, scholarshipId: e.target.value})}
                      >
                        <option value="">Choose a scholarship</option>
                        {scholarships.map(scholarship => (
                          <option key={scholarship.scholarshipId} value={scholarship.scholarshipId}>
                            {scholarship.scholarshipId} - {scholarship.scholarshipType}
                          </option>
                        ))}
                      </FormSelect>
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel>Percentage (0-100)%</FormLabel>
                      <FormInput
                        type="number"
                        min="0"
                        max="100"
                        value={assignData.scholarshipPercentage}
                        onChange={(e) => setAssignData({...assignData, scholarshipPercentage: parseInt(e.target.value) || 0})}
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                    <FormButton
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowAssignForm(false);
                        setAssignData({
                          studentId: '',
                          scholarshipId: '',
                          scholarshipPercentage: 0
                        });
                      }}
                    >
                      <X size={20} />
                      Cancel
                    </FormButton>
                    
                    <FormButton
                      type="button"
                      variant="success"
                      onClick={assignScholarshipToStudent}
                    >
                      <Save size={20} />
                      Assign Scholarship
                    </FormButton>
                  </div>
                </ModernForm>
              </div>
            </div>
          </div>
        )}

        {/* Create New Scholarship Form */}
        {showCreateForm && (
          // 修改为与其他管理页面相同的样式
          <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Create New Scholarship</h2>
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
                      <FormLabel required>Scholarship ID</FormLabel>
                      <FormInput
                        type="text"
                        value={createData.scholarshipId}
                        onChange={(e) => setCreateData({...createData, scholarshipId: e.target.value})}
                        placeholder="e.g., SCH001"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel required>Scholarship Type</FormLabel>
                      <FormInput
                        type="text"
                        value={createData.scholarshipType}
                        onChange={(e) => setCreateData({...createData, scholarshipType: e.target.value})}
                        placeholder="e.g., Merit-based"
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel>Amount</FormLabel>
                      <FormInput
                        type="number"
                        step="0.01"
                        value={createData.amount}
                        onChange={(e) => setCreateData({...createData, amount: parseFloat(e.target.value) || 0.0})}
                        placeholder="e.g., 1000.00"
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <FormGroup>
                    <FormLabel>Description</FormLabel>
                    <textarea
                      value={createData.description}
                      onChange={(e) => setCreateData({...createData, description: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Scholarship description"
                      rows="3"
                    />
                  </FormGroup>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                    <FormButton
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowCreateForm(false);
                        setCreateData({
                          scholarshipId: '',
                          scholarshipType: '',
                          amount: 0.0,
                          description: ''
                        });
                      }}
                    >
                      <X size={20} />
                      Cancel
                    </FormButton>
                    
                    <FormButton
                      type="button"
                      variant="success"
                      onClick={createNewScholarship}
                    >
                      <Save size={20} />
                      Create Scholarship
                    </FormButton>
                  </div>
                </ModernForm>
              </div>
            </div>
          </div>
        )}

        {/* Student Scholarship Assignments */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2">
            Student Scholarship Assignments ({studentScholarships.length})
          </h2>

          {studentScholarships.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No scholarships assigned to students yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Assign to Student" to assign scholarships to students</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scholarship
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentStudentScholarshipRecords.map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getStudentName(assignment.studentId)} ({assignment.studentId})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getScholarshipType(assignment.scholarshipId)} ({assignment.scholarshipId})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assignment.scholarshipPercentage}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteStudentScholarship(assignment.id)}
                            disabled={deleting} // 禁用按钮当正在删除时
                            className={`p-2 rounded-full ${
                              deleting 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                            title="Remove Assignment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination for student scholarships */}
              {studentScholarshipsTotalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={prevStudentScholarshipsPage}
                      disabled={currentStudentScholarshipsPage === 1}
                      className={`flex items-center px-3 py-1 rounded-md ${
                        currentStudentScholarshipsPage === 1 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <ChevronLeft size={16} />
                      <span className="ml-1">Previous</span>
                    </button>
                    
                    {[...Array(studentScholarshipsTotalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginateStudentScholarships(pageNumber)}
                          className={`w-10 h-10 rounded-full ${
                            currentStudentScholarshipsPage === pageNumber
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={nextStudentScholarshipsPage}
                      disabled={currentStudentScholarshipsPage === studentScholarshipsTotalPages}
                      className={`flex items-center px-3 py-1 rounded-md ${
                        currentStudentScholarshipsPage === studentScholarshipsTotalPages 
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
        </div>

        {/* Existing Scholarships Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2">
            Existing Scholarships ({scholarships.length})
          </h2>

          {scholarships.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No scholarships yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Create New Scholarship" to add your first scholarship</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scholarship ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentScholarships.map((scholarship) => (
                      <tr key={scholarship.scholarshipId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {scholarship.scholarshipId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {scholarship.scholarshipType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${scholarship.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {scholarship.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditingId(scholarship.scholarshipId);
                              setEditData({
                                scholarshipType: scholarship.scholarshipType,
                                amount: scholarship.amount,
                                description: scholarship.description
                              });
                            }}
                            className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => deleteScholarship(scholarship.scholarshipId)}
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
              
              {/* Pagination for scholarships */}
              {scholarshipsTotalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={prevScholarshipsPage}
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
                    
                    {[...Array(scholarshipsTotalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginateScholarships(pageNumber)}
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
                      onClick={nextScholarshipsPage}
                      disabled={currentPage === scholarshipsTotalPages}
                      className={`flex items-center px-3 py-1 rounded-md ${
                        currentPage === scholarshipsTotalPages 
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
                    <h3 className="text-xl font-bold text-gray-800">Edit Scholarship</h3>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24}/>
                    </button>
                  </div>
                  
                  <ModernForm>
                    <FormGroup>
                      <FormLabel required>Scholarship Type</FormLabel>
                      <FormInput
                        type="text"
                        value={editData.scholarshipType || ''}
                        onChange={(e) => setEditData({...editData, scholarshipType: e.target.value})}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel>Amount</FormLabel>
                      <FormInput
                        type="number"
                        step="0.01"
                        value={editData.amount || 0.0}
                        onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value) || 0.0})}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel>Description</FormLabel>
                      <textarea
                        value={editData.description || ''}
                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                        className="mt-1 block w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
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
        </div>

        {/* Custom Confirm Dialog */}
        <CustomConfirmDialog
          isOpen={showConfirmDialog}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title={confirmAction === 'deleteScholarship' ? "Delete Scholarship" : "Remove Scholarship Assignment"}
          message={confirmAction === 'deleteScholarship' 
            ? "Are you sure you want to delete this scholarship? This action cannot be undone." 
            : "Are you sure you want to remove this scholarship assignment? This action cannot be undone."}
          confirmText="Delete"
          cancelText="Cancel"
          isDeleting={deleting} // 传递删除状态
        />
      </div>
    </div>
  );
};

export default AdminScholarshipManager;