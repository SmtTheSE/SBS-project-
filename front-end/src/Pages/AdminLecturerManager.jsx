import React, { useState, useEffect } from 'react';
import { Plus, Save, Edit, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton, FormSection } from '../Components/ModernForm';
import CustomConfirmDialog from '../Components/CustomConfirmDialog';

const AdminLecturerManager = () => {
  const [lecturers, setLecturers] = useState([]);
  const [departments] = useState([
    {departmentId: 'DS', departmentName: 'Data Science' },
    { departmentId: 'BUS', departmentName: 'Business' },
    {departmentId: 'HOSP', departmentName: 'Hospitality' }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const[showCreateForm, setShowCreateForm] = useState(false);
  const [createData,setCreateData] = useState({
    lecturerId: '',
    name: '',
    dateOfBirth: '',
    teachingExperience: 0,
    academicTitle: '',
    departmentId: ''
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [lecturerIdToDelete, setLecturerIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false); // 添加删除状态
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try{
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/lecturers', {
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLecturers(data);
    } catch (error) {
      console.error('Failed to fetch lecturers:', error);
    }
  };

  // Get current lecturers for pagination
  const getCurrentLecturers = () => {
    const indexOfLastLecturer = currentPage * itemsPerPage;
    const indexOfFirstLecturer = indexOfLastLecturer - itemsPerPage;
    return lecturers.slice(indexOfFirstLecturer, indexOfLastLecturer);
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
    if (currentPage < Math.ceil(lecturers.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const createNewLecturer = async () => {
    // Validation
    if (!createData.lecturerId || !createData.name || !createData.dateOfBirth || !createData.departmentId) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token= localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/lecturers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          ...createData,
          dateOfBirth: createData.dateOfBirth ? new Date(createData.dateOfBirth).toISOString().split('T')[0] :null,
          teachingExperience: parseInt(createData.teachingExperience) ||0
        }),
        credentials: 'include'
      });

      if (response.ok) {
        alert('Lecturercreated successfully!');
        
        // Reset form
        setCreateData({
          lecturerId: '',
          name: '',
          dateOfBirth: '',
          teachingExperience: 0,
          academicTitle:'',
          departmentId: ''
        });
        setShowCreateForm(false);
        setCurrentPage(1); // Reset to first page
        fetchLecturers(); // Refreshthe list
      }else {
        const errorText = await response.text();
        console.error('Create failed:', errorText);
        alert('Failedto create lecturer: ' + errorText);
      }
    }catch (error) {
      console.error('Create error:', error);
      alert('Network error occurred while creatinglecturer');
    }
  };

  const saveEdit = async () => {
    try {
      const updateData = {
        lecturerId: editingId,
        name: editData.name||'',
        dateOfBirth:editData.dateOfBirth || '',
        teachingExperience: parseInt(editData.teachingExperience) || 0,
        academicTitle:editData.academicTitle || '',
        departmentId: editData.departmentId || ''
      };

      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:8080/api/admin/lecturers/${editingId}`, {
        method: 'PUT',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(updateData),
        credentials: 'include'
      });

      if(response.ok) {
        alert('Lecturer updated successfully!');
        setEditingId(null);
        fetchLecturers(); //Refresh thelist
      } else {
        const errorText = await response.text();
        console.error('Update failed:', errorText);
        alert('Failed to update lecturer:' + errorText);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Network error occurred whileupdating lecturer');
    }
  };

  const deleteLecturer = async (lecturerId) => {
    setLecturerIdToDelete(lecturerId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setDeleting(true); // 设置删除状态
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/admin/lecturers/${lecturerIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}`: ''
        },
        credentials: 'include'
      });

      if (response.ok) {
        alert('Lecturer deleted successfully!');
        // If we're on the last page and it becomes empty, go to previous page
        const totalPages = Math.ceil((lecturers.length - 1) / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
        fetchLecturers(); // Refresh the list
      } else {
        const errorText = await response.text();
        console.error('Delete failed:', errorText);
        alert('Failed to delete lecturer: ' + errorText);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Network error occurred while deleting lecturer: ' + error.message);
    } finally {
      setDeleting(false); // 重置删除状态
      setShowConfirmDialog(false);
      setLecturerIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setLecturerIdToDelete(null);
  };

  // Get current lecturers
  const currentLecturers = getCurrentLecturers();
  const totalPages = Math.ceil(lecturers.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-autop-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Panel - Lecturer Management
            </h1>
            <p className="text-gray-600">
              Manage lecturer accounts and personal information • Total: {lecturers.length}
            </p>
          </div>

          <FormButton
            variant="primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus size={20} />
            {showCreateForm ? 'Cancel' : 'Create New Lecturer'}
          </FormButton>
        </div>

        {/* Create New Lecturer Form */}
        {showCreateForm && (
          // 修改为与学生管理页面相同的样式
          <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Create New Lecturer</h3>
                  <button 
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24}/>
                  </button>
                </div>
                
                <ModernForm>
                  <FormSection title="Personal Information">
                    <FormRow>
                      <FormGroup>
                        <FormLabel required>Lecturer ID</FormLabel>
                        <FormInput
                          type="text"
                          value={createData.lecturerId}
                          onChange={(e) => setCreateData({...createData, lecturerId: e.target.value})}
                          placeholder="e.g., LEC001"
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel required>Full Name</FormLabel>
                        <FormInput
                          type="text"
                          value={createData.name}
                          onChange={(e) => setCreateData({...createData, name: e.target.value})}
                          placeholder="Full Name"
                        />
                      </FormGroup>
                    </FormRow>
                    
                    <FormRow>
                      <FormGroup>
                        <FormLabel required>Date of Birth</FormLabel>
                        <FormInput
                          type="date"
                          value={createData.dateOfBirth}
                          onChange={(e) => setCreateData({...createData, dateOfBirth: e.target.value})}
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel>Academic Title</FormLabel>
                        <FormInput
                          type="text"
                          value={createData.academicTitle}
                          onChange={(e) => setCreateData({...createData, academicTitle: e.target.value})}
                          placeholder="e.g., Professor, Associate Professor"
                        />
                      </FormGroup>
                    </FormRow>
                  </FormSection>
                  
                  <FormSection title="Professional Information">
                    <FormRow>
                      <FormGroup>
                        <FormLabel>Teaching Experience (years)</FormLabel>
                        <FormInput
                          type="number"
                          value={createData.teachingExperience}
                          onChange={(e) => setCreateData({...createData, teachingExperience: e.target.value})}
                          placeholder="Years of experience"
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel required>Department</FormLabel>
                        <FormSelect
                          value={createData.departmentId}
                          onChange={(e) => setCreateData({...createData, departmentId:e.target.value})}
                        >
                          <option value="">Select Department</option>
                          {departments.map(dept => (
                            <option key={dept.departmentId} value={dept.departmentId}>
                              {dept.departmentName}
                            </option>
                          ))}
                        </FormSelect>
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
                          lecturerId: '',
                          name: '',
                          dateOfBirth: '',
                          teachingExperience: 0,
                          academicTitle:'',
                          departmentId: ''
                        });
                      }}
                    >
                      <X size={20} />
                      Cancel
                    </FormButton>
                    
                    <FormButton
                      type="button"
                      variant="success"
                      onClick={createNewLecturer}
                    >
                      <Save size={20} />
                      Create Lecturer
                    </FormButton>
                  </div>
                </ModernForm>
              </div>
            </div>
          </div>
        )}

        {/* Existing Lecturers Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2">
            Existing Lecturers ({lecturers.length})
          </h2>

          {lecturers.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No lecturers yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Create New Lecturer" to add your first lecturer</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lecturer ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date of Birth
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teaching Experience
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Academic Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentLecturers.map((lecturer)=> (
                      <tr key={lecturer.lecturerId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lecturer.lecturerId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lecturer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lecturer.dateOfBirth}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lecturer.teachingExperience} years
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lecturer.academicTitle || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {departments.find(dept => dept.departmentId === lecturer.departmentId)?.departmentName || lecturer.departmentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {editingId === lecturer.lecturerId ? (
                              <>
                                <button 
                                  onClick={saveEdit}
                                  className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                                  title="Save"
                                >
                                  <Save size={16} />
                                </button>
                                <button 
                                  onClick={()=>setEditingId(null)}
                                  className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                                  title="Cancel"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() =>{
                                    setEditingId(lecturer.lecturerId);
                                    setEditData({
                                      name: lecturer.name,
                                      dateOfBirth: lecturer.dateOfBirth,
                                      teachingExperience: lecturer.teachingExperience,
                                      academicTitle: lecturer.academicTitle,
                                      departmentId: lecturer.departmentId
                                    });
                                  }}
                                  className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => deleteLecturer(lecturer.lecturerId)}
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
                              </>
                            )}
                          </div>
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
          
          {/* Edit Form */}
          {editingId && (
            // 修改为与学生管理页面相同的样式
            <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Edit Lecturer</h3>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  <ModernForm>
                    <FormRow>
                      {/* Personal Information */}
                      <div>
                        <FormSection title="Personal Information">
                          <FormGroup>
                            <FormLabel>Lecturer ID</FormLabel>
                            <FormInput
                              type="text"
                              value={editingId}
                              disabled
                            />
                          </FormGroup>
                          
                          <FormGroup>
                            <FormLabel>Full Name</FormLabel>
                            <FormInput
                              type="text"
                              value={editData.name|| ''}
                              onChange={(e) => setEditData({...editData, name: e.target.value})}
                            />
                          </FormGroup>
                          
                          <FormGroup>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormInput
                              type="date"
                              value={editData.dateOfBirth || ''}
                              onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                            />
                          </FormGroup>
                          
                          <FormGroup>
                            <FormLabel>Academic Title</FormLabel>
                            <FormInput
                              type="text"
                              value={editData.academicTitle || ''}
                              onChange={(e) => setEditData({...editData, academicTitle: e.target.value})}
                            />
                          </FormGroup>
                        </FormSection>
                      </div>
                      
                      {/* Professional Information */}
                      <div>
                        <FormSection title="Professional Information">
                          <FormGroup>
                            <FormLabel>Teaching Experience (years)</FormLabel>
                            <FormInput
                              type="number"
                              value={editData.teachingExperience|| 0}
                              onChange={(e) => setEditData({...editData, teachingExperience: e.target.value})}
                            />
                          </FormGroup>
                          
                          <FormGroup>
                            <FormLabel>Department</FormLabel>
                            <FormSelect
                              value={editData.departmentId || ''}
                              onChange={(e) => setEditData({...editData, departmentId: e.target.value})}
                            >
                              <option value="">Select Department</option>
                              {departments.map(dept => (
                                <option key={dept.departmentId} value={dept.departmentId}>
                                  {dept.departmentName}
                                </option>
                              ))}
                            </FormSelect>
                          </FormGroup>
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
        </div>
        
        {/* 删除确认对话框 */}
        <CustomConfirmDialog
          isOpen={showConfirmDialog}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Confirm Delete"
          message="Are you sure you want to delete this lecturer? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isDeleting={deleting} // 传递删除状态
        />
      </div>
    </div>
  );
};

export default AdminLecturerManager;