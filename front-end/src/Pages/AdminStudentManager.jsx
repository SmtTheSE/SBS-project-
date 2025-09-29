import React, { useState, useEffect } from 'react';
import { Plus, Save, Edit, X, Eye, EyeOff, Trash2 } from 'lucide-react';

const AdminStudentManager = () => {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId]=useState(null);
  const [editData, setEditData] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createData, setCreateData] = useState({
    studentId: '',
    accountId: '',
    firstName: '',
    lastName: '',
    dateOfBirth:'',
phone: '',
    studentEmail: '',
    homeAddress: '',
    wardId: '',
    wardName: '', // 新增区域名称字段
    cityId: '',
cityName: '', // 新增城市名称字段
    streetAddress: '',
    buildingName: '',
    gender: 1,
nationality:'VN',
    nationalId: '',
    studyPlanId: '',
    accountRole: 'student',
    accountStatus: 1,
    password: '' // 添加密码字段
  });
  const [cities, setCities] = useState([]);
  const [wards, setWards] = useState([]);

useEffect(()=> {
fetchStudents();
    fetchCities();
   fetchWards();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/students', {
        credentials: 'include'
      });
      if (!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (error){
      console.error('Failed to fetch students:', error);
    }
  };

  const fetchCities = async () => {
   try{
      const response = await fetch('http://localhost:8080/api/admin/students/cities', {
        credentials: 'include'
      });
      if (!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
     setCities(data);
   }catch (error){
      console.error('Failed to fetch cities:', error);
      // Fallback to mock data if API fails
      const mockCities = [
{ cityId: 'CITY001', cityName: 'Ho Chi Minh City' },
        { cityId: 'CITY002',cityName:'Hanoi' }
];
      setCities(mockCities);
    }
  };

  const fetchWards = async () => {
    try {
     const response = await fetch('http://localhost:8080/api/admin/students/wards', {
        credentials: 'include'
      });
      if(!response.ok) {
throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWards(data);
    } catch (error) {
      console.error('Failed to fetch wards:', error);
      // Fallback to mockdataif API fails
     constmockWards =[
        { wardId: 'WARD001', wardName: 'District 1' },
        { wardId: 'WARD002', wardName: 'District 2' }
      ];
      setWards(mockWards);
    }
 };

const createNewStudent = async()=> {
   // Validation
    if (!createData.studentId || !createData.accountId || !createData.firstName || 
        !createData.lastName || !createData.studentEmail) {
      alert('Please fill in all required fields');
      return;
    }

    try {
const response = await fetch('http://localhost:8080/api/admin/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
},
body: JSON.stringify({
          ...createData,
          dateOfBirth: createData.dateOfBirth ? new Date(createData.dateOfBirth).toISOString().split('T')[0] : null}),
       credentials: 'include'
      });

      if (response.ok) {
        alert('Student created successfully!');
        
// Resetform
        setCreateData({
          studentId: '',
          accountId: '',
          firstName: '',
          lastName:'',
          dateOfBirth: '',
          phone: '',
         studentEmail: '',
homeAddress: '',
wardId: '',
          wardName: '', // 重置区域名称字段
          cityId: '',
cityName: '', // 重置城市名称字段
          streetAddress: '',
          buildingName:'',
         gender: 1,
          nationality: 'VN',
nationalId: '',
studyPlanId: '',
accountRole: 'student',
          accountStatus: 1,
          password: ''// 重置密码字段
        });
        setShowCreateForm(false);
        fetchStudents(); // Refresh the listfetchCities(); // Refresh cities list
        fetchWards();// Refresh wardslist
     } else {
        const errorText = await response.text();
        console.error('Create failed:', errorText);
       alert('Failedto create student: ' + errorText);
      }
    } catch (error) {
console.error('Createerror:', error);
      alert('Network error occurred whilecreating student');
}
  };

const saveEdit = async ()=> {
    try {
      const student = students.find(s => s.studentId === editingId);
      
      const updateData = {
        studentId: editingId,
       accountId: student.loginAccount.accountId,
        firstName: editData.firstName || student.firstName,
       lastName: editData.lastName || student.lastName,
        dateOfBirth: editData.dateOfBirth || student.dateOfBirth,
        phone: editData.phone ||student.phone,
        studentEmail: editData.studentEmail || student.studentEmail,
       homeAddress: editData.homeAddress || student.homeAddress,
        wardId:editData.wardId || student.wardId,
        wardName: editData.wardName || '', // 添加区域名称字段
       cityId:editData.cityId || student.cityId,
        cityName: editData.cityName ||'', // 添加城市名称字段
        streetAddress: editData.streetAddress ||student.streetAddress,
        buildingName: editData.buildingName ||student.buildingName,
        gender: editData.gender !== undefined ? editData.gender :student.gender,
        nationality: editData.nationality || student.nationality,
nationalId: editData.nationalId || student.nationalId,
        studyPlanId:editData.studyPlanId || student.studyPlanId,
accountRole: 'student',
        accountStatus: editData.accountStatus!== undefined ?editData.accountStatus : student.loginAccount.accountStatus,
        password: editData.password || '' // 添加密码字段
      };

      const response = await fetch(`http://localhost:8080/api/admin/students/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify(updateData),
        credentials: 'include'
      });

if (response.ok) {
        alert('Student updated successfully!');
        setEditingId(null);
setEditData({ ...editData, password: '' }); // 清除密码字段
       fetchStudents();// Refresh the list
        fetchCities(); // Refresh cities list
       fetchWards(); // Refreshwards list
      } else {
        const errorText = await response.text();
       console.error('Updatefailed:', errorText);
        alert('Failed to update student: ' + errorText);
      }
} catch (error) {
      console.error('Update error:', error);
      alert('Network error occurred while updatingstudent');
    }
  };

  const deleteStudent = async (studentId) => {
if (!window.confirm('Are you sure you want to deletethis student?')) return;

    try {
     const response = await fetch(`http://localhost:8080/api/admin/students/${studentId}`, {
       method: 'DELETE',
        credentials: 'include'
      });

      if(response.ok){
       alert('Student deletedsuccessfully!');
        fetchStudents(); // Refreshthe list
      } else {
       const errorText =await response.text();
        console.error('Delete failed:', errorText);
        alert('Failed to deletestudent: ' + errorText);
      }
    } catch (error) {
      console.error('Deleteerror:', error);
      alert('Network error occurred whiledeleting student');
    }
  };

 const toggleAccountStatus =async (student) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/students/${student.studentId}/toggle-status`, {
        method: 'PUT',
        credentials: 'include'
      });

      if(response.ok) {
        alert('Accountstatus updated successfully!');
        fetchStudents(); // Refresh the list
      } else {
        const errorText = awaitresponse.text();
        console.error('Togglefailed:', errorText);
        alert('Failed to updateaccount status: ' + errorText);
      }
    } catch (error) {
      console.error('Toggle error:', error);
alert('Network error occurred while toggling account status');
    }
  };

  const getGenderText = (gender) => {
   switch (gender) {
      case 1: return 'Male';
      case 2: return 'Female';
      default:return 'Other';
    }
  };

const getAccountStatusText = (status) => {
    return status === 1 ? 'Active' : 'Inactive';
  };

  return (
<div className="max-w-7xl mx-auto p-6bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
       {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
Admin Panel - Student Management
</h1>
            <p className="text-gray-600">
             Manage student accounts and personal information • Total: {students.length}
            </p>
          </div>

          <button
onClick={() => setShowCreateForm(!showCreateForm)}
className="flex items-center gap-2 px-6py-3 bg-blue-500text-white rounded-lghover:bg-blue-600 transition-colors shadow-md"
          >
            <Plus size={20} />
            {showCreateForm ? 'Cancel' : 'Create New Student'}
</button>
        </div>

        {/* Create New StudentForm */}
        {showCreateForm && (
<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Create New Student</h3>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Information */}
              <div className="space-y-4">
                <h4 className="text-lgfont-semiboldtext-gray-700 border-b pb-2">Account Information</h4>
                
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Account ID *</label>
                  <input
type="text"
                    value={createData.accountId}
onChange={(e) =>setCreateData({...createData,accountId: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
placeholder="e.g., ACC001"
                 />
</div>

                <div>
                  <label className="blocktext-sm font-bold text-gray-700 mb-2">StudentID *</label>
                  <input
                    type="text"
                    value={createData.studentId}
                    onChange={(e) => setCreateData({...createData, studentId: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2focus:ring-blue-500 focus:border-blue-500"
                 placeholder="e.g., STU001"
                 />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={createData.password}
                    onChange={(e) => setCreateData({...createData, password: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 placeholder="Enterpassword"
                  />
                </div>

<div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Account Status</label>
                  <select
                    value={createData.accountStatus}
                    onChange={(e) => setCreateData({...createData, accountStatus:parseInt(e.target.value)})}
                    className="w-full p-3border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
</div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700mb-2">First Name *</label>
                    <input
                      type="text"
                      value={createData.firstName}
                      onChange={(e) => setCreateData({...createData, firstName: e.target.value})}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="FirstName"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">LastName*</label>
                    <input
                      type="text"
                      value={createData.lastName}
                      onChange={(e) => setCreateData({...createData,lastName: e.target.value})}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500focus:border-blue-500"
                     placeholder="LastName"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={createData.studentEmail}
onChange={(e) => setCreateData({...createData, studentEmail: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="student@example.com"
                  />
</div>

                <div className="gridgrid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-boldtext-gray-700 mb-2">Dateof Birth</label>
                    <input
                      type="date"
                      value={createData.dateOfBirth}
onChange={(e) => setCreateData({...createData, dateOfBirth: e.target.value})}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
/>
</div>
                  <div>
                    <label className="block text-sm font-boldtext-gray-700 mb-2">Phone</label>
                    <input
                      type="text"
                      value={createData.phone}
                      onChange={(e) => setCreateData({...createData, phone: e.target.value})}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2focus:ring-blue-500"
placeholder="0123456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-smfont-boldtext-gray-700 mb-2">Gender</label>
                  <select
                    value={createData.gender}
                    onChange={(e) => setCreateData({...createData, gender: parseInt(e.target.value)})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2focus:ring-blue-500"
>
<option value={1}>Male</option>
                    <option value={2}>Female</option>
                    <option value={0}>Other</option>
                  </select>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">AddressInformation</h4>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Home Address</label>
                  <input type="text"
                    value={createData.homeAddress}
                    onChange={(e) => setCreateData({...createData,homeAddress:e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="Homeaddress"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">City ID *</label>
                    <input
                      type="text"
                      value={createData.cityId}
                      onChange={(e) => setCreateData({...createData, cityId: e.target.value})}
className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter city ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">CityName*</label>
                    <input
                      type="text"
                      value={createData.cityName}
                      onChange={(e) => setCreateData({...createData, cityName: e.target.value})}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
placeholder="Entercity name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="blocktext-sm font-bold text-gray-700 mb-2">Ward ID</label>
                    <input
                    type="text"
                     value={createData.wardId}
                      onChange={(e) => setCreateData({...createData, wardId: e.target.value})}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
placeholder="Enter wardID"
/>
</div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ward Name</label>
                    <input
                      type="text"
                      value={createData.wardName}
                      onChange={(e) => setCreateData({...createData,wardName: e.target.value})}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter ward name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-smfont-boldtext-gray-700 mb-2">StreetAddress</label>
                  <input
                    type="text"
                    value={createData.streetAddress}
                    onChange={(e) => setCreateData({...createData, streetAddress: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Streetaddress"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Building Name</label>
                  <input
                    type="text"
                    value={createData.buildingName}
                    onChange={(e) => setCreateData({...createData, buildingName: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Building name"
                  />
                </div>
              </div>

              {/*Additional Information */}
<div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Additional Information</h4>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nationality</label>
                  <select
                    value={createData.nationality}
                    onChange={(e) => setCreateData({...createData, nationality: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
<option value="VN">Vietnam</option>
                    <option value="MM">Myanmar</option>
                  </select>
                </div>

                {createData.nationality === 'VN' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">NationalID*</label>
                    <input
                      type="text"
                      value={createData.nationalId}
                      onChange={(e) => setCreateData({...createData, nationalId: e.target.value})}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="NationalID (required for Vietnamese students)"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Study Plan ID</label>
                  <input
                    type="text"
                    value={createData.studyPlanId}
                    onChange={(e) => setCreateData({...createData, studyPlanId: e.target.value})}
                    className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Study plan ID"
                  />
</div>
</div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                onClick={createNewStudent}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-whiterounded-lg hover:bg-green-600 transition-colors shadow-md"
              >
                <Save size={20} />
                Create Student
              </button>

              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setCreateData({
                    studentId: '',
                    accountId: '',
                   firstName: '',
                    lastName: '',
                    dateOfBirth: '',
                    phone: '',
                    studentEmail: '',
                    homeAddress: '',
                    wardId: '',
                    wardName: '', // 重置区域名称字段
                    cityId: '',
                    cityName: '', // 重置城市名称字段
                   streetAddress:'',
              buildingName: '',
                    gender: 1,
                    nationality: 'VN',
                    nationalId: '',
                    studyPlanId: '',
                    accountRole: 'student',
                    accountStatus: 1,
                    password: '' // 重置密码字段
                  });
                }}
                className="flex items-center gap-2px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Existing Students Management */}
<div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2">
            Existing Students ({students.length})
          </h2>

          {students.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No students yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Create New Student" to add your first student</p>
           </div>
    ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xsfont-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xsfont-medium text-gray-500 uppercase tracking-wider">
                      Email</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DateofBirth
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                   </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500uppercasetracking-wider">
                      Nationality
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500uppercase tracking-wider">
                      City</th>
                    <th className="px-6 py-3 text-left text-xs font-mediumtext-gray-500 uppercase tracking-wider">
                      AccountStatus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
{students.map((student) => (
                   <tr key={student.studentId}>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.studentEmail}
                      </td>
                      <td className="px-6 py-4whitespace-nowrap text-sm text-gray-500">
                        {student.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.dateOfBirth}
                      </td>
                      <td className="px-6 py-4whitespace-nowrap text-sm text-gray-500">
                        {getGenderText(student.gender)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.nationality}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
{student.cityId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                         student.loginAccount && student.loginAccount.accountStatus === 1 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
{getAccountStatusText(student.loginAccount ? student.loginAccount.accountStatus: 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>toggleAccountStatus(student)}
                            className={`p-1 rounded ${
student.loginAccount && student.loginAccount.accountStatus === 1
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                            title={student.loginAccount && student.loginAccount.accountStatus === 1 ? 'Deactivate' : 'Activate'}
                          >
                            {student.loginAccount && student.loginAccount.accountStatus === 1 ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          
                          <button onClick={() => {
                              setEditingId(student.studentId);
                              setEditData({
                               firstName: student.firstName,
                                lastName: student.lastName,
                                studentEmail: student.studentEmail,
                                phone: student.phone,
                                dateOfBirth: student.dateOfBirth,
                                homeAddress: student.homeAddress,
                                streetAddress:student.streetAddress,
                                buildingName: student.buildingName,
                                gender: student.gender,
                               nationality: student.nationality,
                                nationalId: student.nationalId,
                                studyPlanId: student.studyPlanId,
                                cityId: student.cityId || '',
cityName: '', // 初始化城市名称字段
wardId: student.wardId || '',
                                wardName: '', // 初始化区域名称字段accountStatus: student.loginAccount ? student.loginAccount.accountStatus : 1,
                                password: '' // 初始化密码字段
                              });
                            }}
                            className="p-1 bg-blue-100 text-blue-600rounded hover:bg-blue-200"
                            title="Edit"
                          >
<Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => deleteStudent(student.studentId)}
                            className="p-1 bg-red-100text-red-600 rounded hover:bg-red-200"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
{/*Edit Modal */}
          {editingId &&(
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Edit Student</h3>
                    <button 
                      onClick={() => setEditingId(null)}
                     className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24}/>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div>
                     <h4 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h4>
<div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input type="text"
                            value={editData.firstName || ''}
                            onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">LastName</label>
                          <input
                            type="text"
                            value={editData.lastName || ''}
                            onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          />
</div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            value={editData.studentEmail || ''}
                            onChange={(e) => setEditData({...editData, studentEmail: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                        
                        <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input
                            type="text"
                            value={editData.phone || ''}
                            onChange={(e) => setEditData({...editData, phone: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                          <input
                       type="date"
                            value={editData.dateOfBirth || ''}
                            onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                          <select
                            value={editData.gender !== undefined ? editData.gender : 1}
                            onChange={(e) => setEditData({...editData, gender: parseInt(e.target.value)})}
                            className="w-full p-2 border rounded-lg"
                          >
                            <option value={1}>Male</option>
                          <option value={2}>Female</option>
                            <option value={0}>Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                    <select
                            value={editData.nationality || 'VN'}
                            onChange={(e) => setEditData({...editData, nationality: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          >
                            <option value="VN">Vietnam</option>
                            <option value="MM">Myanmar</option>
                          </select>
                        </div>
                        
                        {editData.nationality === 'VN' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                            <input
                              type="text"
                              value={editData.nationalId || ''}
                              onChange={(e) => setEditData({...editData, nationalId: e.target.value})}
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                        )}
                        
                        <div>
                          <label className="block text-smfont-medium text-gray-700 mb-1">Study Plan ID</label>
                          <input
                            type="text"
                            value={editData.studyPlanId || ''}
                            onChange={(e) => setEditData({...editData, studyPlanId: e.target.value})}
                            className="w-full p-2 border rounded-lg"
/>
</div>
                     </div>
                    </div>
                    
                    {/* Address Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-3">Address Information</h4>
                      
                      <div className="space-y-3">
                   <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">HomeAddress</label>
                          <input
                            type="text"
                            value={editData.homeAddress || ''}
                            onChange={(e) => setEditData({...editData, homeAddress: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                        
                        <div>
<label className="block text-sm font-medium text-gray-700 mb-1">StreetAddress</label>
                          <input
                            type="text"
                            value={editData.streetAddress || ''}
onChange={(e)=> setEditData({...editData, streetAddress: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                        
                        <div>
<label className="block text-sm font-medium text-gray-700 mb-1">Building Name</label>
<input type="text"
                            value={editData.buildingName || ''}
                            onChange={(e) => setEditData({...editData, buildingName: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City ID</label>
                            <input
                              type="text"
                              value={editData.cityId || ''}
                              onChange={(e) => setEditData({...editData, cityId:e.target.value})}
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
                            <input
                              type="text"
                             value={editData.cityName || ''}
                              onChange={(e) => setEditData({...editData, cityName: e.target.value})}
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                         <div>
<label className="block text-sm font-medium text-gray-700 mb-1">Ward ID</label>
                            <input
                              type="text"
                              value={editData.wardId || ''}
                              onChange={(e) => setEditData({...editData,wardId: e.target.value})}
className="w-fullp-2 border rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ward Name</label>
                            <input
                              type="text"
                            value={editData.wardName|| ''}
                             onChange={(e) => setEditData({...editData, wardName: e.target.value})}
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                        </div>
                        
                        {/* Account Information */}
                        <h4 className="text-lgfont-semibold text-gray-700 mt-4mb-3">Account Information</h4>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                          <select
                            value={editData.accountStatus || 1}
                            onChange={(e) =>setEditData({...editData, accountStatus: parseInt(e.target.value)})}
                            className="w-full p-2 border rounded-lg"
                          >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                          </select>
                        </div>
                        
                        <div>
<label className="blocktext-sm font-medium text-gray-700 mb-1">Password (leave blank to keep current)</label>
                          <input
                            type="password"
                            value={editData.password || ''}
                            onChange={(e) => setEditData({...editData, password: e.target.value})}
                           className="w-fullp-2 border rounded-lg"
                            placeholder="Enter new password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button onClick={() => setEditingId(null)}
                     className="px-4py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Save Changes
                    </button>
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

export default AdminStudentManager;