import React, { useState, useEffect } from 'react';
import { Plus, Save, Edit, X, Trash2 } from 'lucide-react';

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
    if (!window.confirm('Are you sure you want todeletethis lecturer?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/admin/lecturers/${lecturerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}`: ''
       },
        credentials: 'include'
      });

      if (response.ok) {
        alert('Lecturer deletedsuccessfully!');
        fetchLecturers(); // Refresh the list
      } else {
        const errorText = await response.text();
        console.error('Deletefailed:', errorText);
        alert('Failed to deletelecturer: ' + errorText);
      }
    } catch (error) {
      console.error('Delete error:', error);
     alert('Network error occurred while deleting lecturer');
    }
  };

  return (
    <div className="max-w-7xl mx-autop-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flexjustify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Panel-Lecturer Management
</h1>
            <p className="text-gray-600">
              Manage lecturer accounts and personalinformation • Total:{lecturers.length}
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-centergap-2px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600transition-colors shadow-md"
          >
            <Plus size={20} />
            {showCreateForm ? 'Cancel' : 'Create New Lecturer'}
          </button>
        </div>

       {/* Create New Lecturer Form */}
        {showCreateForm && (
          <div className="bg-gradient-to-rfrom-blue-50to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semiboldtext-blue-800 mb-4">Create New Lecturer</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">PersonalInformation</h4>
                
                <div>
                  <label className="block text-sm font-boldtext-gray-700 mb-2">Lecturer ID *</label>
                  <input
                    type="text"
                    value={createData.lecturerId}
                    onChange={(e) => setCreateData({...createData, lecturerId: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., LEC001"
                  />
                </div>

<div>
                  <label className="block text-sm font-bold text-gray-700mb-2">FullName *</label>
                  <input
                    type="text"
                    value={createData.name}
                    onChange={(e) => setCreateData({...createData, name: e.target.value})}
                   className="w-fullp-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500focus:border-blue-500"
                   placeholder="Full Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-boldtext-gray-700mb-2">Dateof Birth *</label>
                  <input
                    type="date"
                    value={createData.dateOfBirth}
                    onChange={(e) => setCreateData({...createData, dateOfBirth: e.target.value})}
                   className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
/>
                </div>

                <div>
                  <label className="block text-smfont-bold text-gray-700mb-2">Academic Title</label>
                  <input
type="text"
                    value={createData.academicTitle}
                   onChange={(e) => setCreateData({...createData, academicTitle: e.target.value})}
                    className="w-full p-3 border-2rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="e.g., Professor, Associate Professor"
                  />
                </div>
              </div>

              {/* ProfessionalInformation*/}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">ProfessionalInformation</h4>
                
                <div>
<label className="block text-sm font-bold text-gray-700 mb-2">Teaching Experience(years)</label>
                  <input
                    type="number"
                    value={createData.teachingExperience}
                    onChange={(e) => setCreateData({...createData, teachingExperience: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="Yearsof experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700mb-2">Department*</label>
                  <select
                    value={createData.departmentId}
                    onChange={(e) => setCreateData({...createData, departmentId:e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
>
                   <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.departmentId} value={dept.departmentId}>
{dept.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons*/}
<div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                onClick={createNewLecturer}
                className="flexitems-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colorsshadow-md"
              >
                <Save size={20} />
                Create Lecturer
              </button>

              <button
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
                className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-whiterounded-lg hover:bg-gray-600 transition-colors"
              >
                <X size={20} />
                Cancel
             </button>
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
<div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
<tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercasetracking-wider">
Lecturer ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500uppercasetracking-wider">
                     Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-mediumtext-gray-500 uppercase tracking-wider">
                      Dateof Birth
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-mediumtext-gray-500 uppercasetracking-wider">
                      TeachingExperience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AcademicTitle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500uppercasetracking-wider">
                      Department</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercasetracking-wider">
                      Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
{lecturers.map((lecturer)=> (
<tr key={lecturer.lecturerId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lecturer.lecturerId}
                      </td>
                     <td className="px-6 py-4whitespace-nowraptext-sm text-gray-500">
                        {lecturer.name}
                      </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lecturer.dateOfBirth}
                      </td>
<td className="px-6 py-4whitespace-nowrap text-sm text-gray-500">
                        {lecturer.teachingExperience}years
                      </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lecturer.academicTitle || 'N/A'}
                      </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {departments.find(dept => dept.departmentId === lecturer.departmentId)?.departmentName || lecturer.departmentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-smfont-medium">
<div className="flex space-x-2">
                          {editingId === lecturer.lecturerId ? (
<>
                             <button 
                                onClick={saveEdit}
                                className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                title="Save"
                              >
                                <Save size={16} />
                              </button>
                              <button 
                                onClick={()=>setEditingId(null)}
                                className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
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
className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                title="Edit"
                              >
                              <Edit size={16} />
                             </button>
                              <button
onClick={() => deleteLecturer(lecturer.lecturerId)}
className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
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
          )}
          
          {/* Edit Form */}
          {editingId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flexitems-center justify-center p-4 z-50">
              <div className="bg-whiterounded-lg shadow-xl w-fullmax-w-4xl max-h-[90vh] overflow-y-auto">
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
                  
                  <div className="grid grid-cols-1md:grid-cols-2 gap-6">
{/* Personal Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h4>
                      
<div className="space-y-3">
                        <div>
                          <label className="blocktext-sm font-medium text-gray-700 mb-1">Lecturer ID</label>
                          <input
                            type="text"
                            value={editData.lecturerId || ''}
                            disabled
                          className="w-full p-2 border rounded-lg bg-gray-100"
                          />
</div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input type="text"
                            value={editData.name|| ''}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dateof Birth</label>
                          <input
                            type="date"
                            value={editData.dateOfBirth || ''}
                            onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Academic Title</label>
                          <input
type="text"
                            value={editData.academicTitle || ''}
                            onChange={(e) => setEditData({...editData, academicTitle: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                      </div>
</div>
                    
                    {/* ProfessionalInformation */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700mb-3">ProfessionalInformation</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-mediumtext-gray-700 mb-1">Teaching Experience (years)</label>
                          <input
                            type="number"
                            value={editData.teachingExperience|| 0}
                            onChange={(e) => setEditData({...editData, teachingExperience: e.target.value})}
                            className="w-fullp-2 border rounded-lg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                          <select
                            value={editData.departmentId || ''}
                            onChange={(e) => setEditData({...editData, departmentId: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                              <option key={dept.departmentId} value={dept.departmentId}>
                                {dept.departmentName}
                              </option>
))}
                          </select>
                        </div>
</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                    Save Changes</button>
                  </div>
               </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLecturerManager;