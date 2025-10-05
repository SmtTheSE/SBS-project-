import React, { useState, useEffect } from 'react';
import { Plus, Save, Edit, X, Eye, EyeOff, Trash2 } from 'lucide-react';
import ModernDropdown from '../Components/ModernDropdown';
import { ModernForm, FormGroup, FormRow, FormLabel, FormInput, FormSelect, FormButton, FormSection } from '../Components/ModernForm';

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

  // Convert cities to dropdown options
  const cityOptions = cities.map(city => ({
    value: city.cityId,
    label: city.cityName
  }));

  // Convert wards to dropdown options
  const wardOptions = wards.map(ward => ({
    value: ward.wardId,
    label: ward.wardName
  }));

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
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
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

          <FormButton
            variant="primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus size={20} />
            {showCreateForm ? 'Cancel' : 'Create New Student'}
          </FormButton>
        </div>

        {/* Create New StudentForm */}
        {showCreateForm && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Create New Student</h3>
            
            <ModernForm>
              <FormSection title="Account Information">
                <FormRow>
                  <FormGroup>
                    <FormLabel required>Account ID</FormLabel>
                    <FormInput
                      type="text"
                      value={createData.accountId}
                      onChange={(e) =>setCreateData({...createData,accountId: e.target.value})}
                      placeholder="e.g., ACC001"
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
                    <FormLabel>Password</FormLabel>
                    <FormInput
                      type="password"
                      value={createData.password}
                      onChange={(e) => setCreateData({...createData, password: e.target.value})}
                      placeholder="Enter password"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Account Status</FormLabel>
                    <FormSelect
                      value={createData.accountStatus}
                      onChange={(e) => setCreateData({...createData, accountStatus:parseInt(e.target.value)})}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </FormSelect>
                  </FormGroup>
                </FormRow>
              </FormSection>
              
              <FormSection title="Personal Information">
                <FormRow>
                  <FormGroup>
                    <FormLabel required>First Name</FormLabel>
                    <FormInput
                      type="text"
                      value={createData.firstName}
                      onChange={(e) => setCreateData({...createData, firstName: e.target.value})}
                      placeholder="First Name"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel required>Last Name</FormLabel>
                    <FormInput
                      type="text"
                      value={createData.lastName}
                      onChange={(e) => setCreateData({...createData,lastName: e.target.value})}
                      placeholder="Last Name"
                    />
                  </FormGroup>
                </FormRow>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel required>Email</FormLabel>
                    <FormInput
                      type="email"
                      value={createData.studentEmail}
                      onChange={(e) => setCreateData({...createData, studentEmail: e.target.value})}
                      placeholder="student@example.com"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Phone</FormLabel>
                    <FormInput
                      type="text"
                      value={createData.phone}
                      onChange={(e) => setCreateData({...createData, phone: e.target.value})}
                      placeholder="0123456789"
                    />
                  </FormGroup>
                </FormRow>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormInput
                      type="date"
                      value={createData.dateOfBirth}
                      onChange={(e) => setCreateData({...createData, dateOfBirth: e.target.value})}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Gender</FormLabel>
                    <FormSelect
                      value={createData.gender}
                      onChange={(e) => setCreateData({...createData, gender: parseInt(e.target.value)})}
                    >
                      <option value={1}>Male</option>
                      <option value={2}>Female</option>
                      <option value={0}>Other</option>
                    </FormSelect>
                  </FormGroup>
                </FormRow>
              </FormSection>
              
              <FormSection title="Address Information">
                <FormGroup>
                  <FormLabel>Home Address</FormLabel>
                  <FormInput
                    type="text"
                    value={createData.homeAddress}
                    onChange={(e) => setCreateData({...createData,homeAddress:e.target.value})}
                    placeholder="Home address"
                  />
                </FormGroup>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel>City</FormLabel>
                    <ModernDropdown
                      options={cityOptions}
                      value={createData.cityId}
                      onChange={(value) => setCreateData({...createData, cityId: value})}
                      placeholder="Select a city"
                      searchable={true}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel required>City Name</FormLabel>
                    <FormInput
                      type="text"
                      value={createData.cityName}
                      onChange={(e) => setCreateData({...createData, cityName: e.target.value})}
                      placeholder="Enter city name"
                    />
                  </FormGroup>
                </FormRow>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel>Ward</FormLabel>
                    <ModernDropdown
                      options={wardOptions}
                      value={createData.wardId}
                      onChange={(value) => setCreateData({...createData, wardId: value})}
                      placeholder="Select a ward"
                      searchable={true}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Ward Name</FormLabel>
                    <FormInput
                      type="text"
                      value={createData.wardName}
                      onChange={(e) => setCreateData({...createData,wardName: e.target.value})}
                      placeholder="Enter ward name"
                    />
                  </FormGroup>
                </FormRow>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel>Street Address</FormLabel>
                    <FormInput
                      type="text"
                      value={createData.streetAddress}
                      onChange={(e) => setCreateData({...createData, streetAddress: e.target.value})}
                      placeholder="Street address"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Building Name</FormLabel>
                    <FormInput
                      type="text"
                      value={createData.buildingName}
                      onChange={(e) => setCreateData({...createData, buildingName: e.target.value})}
                      placeholder="Building name"
                    />
                  </FormGroup>
                </FormRow>
              </FormSection>
              
              <FormSection title="Additional Information">
                <FormRow>
                  <FormGroup>
                    <FormLabel>Nationality</FormLabel>
                    <FormSelect
                      value={createData.nationality}
                      onChange={(e) => setCreateData({...createData, nationality: e.target.value})}
                    >
                      <option value="VN">Vietnam</option>
                      <option value="MM">Myanmar</option>
                    </FormSelect>
                  </FormGroup>
                  
                  {createData.nationality === 'VN' && (
                    <FormGroup>
                      <FormLabel required>National ID</FormLabel>
                      <FormInput
                        type="text"
                        value={createData.nationalId}
                        onChange={(e) => setCreateData({...createData, nationalId: e.target.value})}
                        placeholder="National ID (required for Vietnamese students)"
                      />
                    </FormGroup>
                  )}
                </FormRow>
                
                <FormGroup>
                  <FormLabel>Study Plan ID</FormLabel>
                  <FormInput
                    type="text"
                    value={createData.studyPlanId}
                    onChange={(e) => setCreateData({...createData, studyPlanId: e.target.value})}
                    placeholder="Study plan ID"
                  />
                </FormGroup>
              </FormSection>
              
              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <FormButton
                  type="button"
                  variant="success"
                  onClick={createNewStudent}
                >
                  <Save size={20} />
                  Create Student
                </FormButton>
                
                <FormButton
                  type="button"
                  variant="secondary"
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
                >
                  <X size={20} />
                  Cancel
                </FormButton>
              </div>
            </ModernForm>
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
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date of Birth
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nationality
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.studentEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.dateOfBirth}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getGenderText(student.gender)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.nationality}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.cityId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                            className={`p-2 rounded-full ${
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
                            className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => deleteStudent(student.studentId)}
                            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
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
              <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
                  
                  <ModernForm>
                    <FormRow>
                      {/* Personal Information */}
                      <div>
                        <FormSection title="Personal Information">
                          <FormGroup>
                            <FormLabel>First Name</FormLabel>
                            <FormInput
                              type="text"
                              value={editData.firstName || ''}
                              onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                            />
                          </FormGroup>
                          
                          <FormGroup>
                            <FormLabel>Last Name</FormLabel>
                            <FormInput
                              type="text"
                              value={editData.lastName || ''}
                              onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                            />
                          </FormGroup>
                          
                          <FormGroup>
                            <FormLabel>Email</FormLabel>
                            <FormInput
                              type="email"
                              value={editData.studentEmail || ''}
                              onChange={(e) => setEditData({...editData, studentEmail: e.target.value})}
                            />
                          </FormGroup>
                          
                          <FormGroup>
                            <FormLabel>Phone</FormLabel>
                            <FormInput
                              type="text"
                              value={editData.phone || ''}
                              onChange={(e) => setEditData({...editData, phone: e.target.value})}
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
                          
                          <FormRow>
                            <FormGroup>
                              <FormLabel>Gender</FormLabel>
                              <FormSelect
                                value={editData.gender !== undefined ? editData.gender : 1}
                                onChange={(e) => setEditData({...editData, gender: parseInt(e.target.value)})}
                              >
                                <option value={1}>Male</option>
                                <option value={2}>Female</option>
                                <option value={0}>Other</option>
                              </FormSelect>
                            </FormGroup>
                            
                            <FormGroup>
                              <FormLabel>Nationality</FormLabel>
                              <FormSelect
                                value={editData.nationality || 'VN'}
                                onChange={(e) => setEditData({...editData, nationality: e.target.value})}
                              >
                                <option value="VN">Vietnam</option>
                                <option value="MM">Myanmar</option>
                              </FormSelect>
                            </FormGroup>
                          </FormRow>
                          
                          {editData.nationality === 'VN' && (
                            <FormGroup>
                              <FormLabel>National ID</FormLabel>
                              <FormInput
                                type="text"
                                value={editData.nationalId || ''}
                                onChange={(e) => setEditData({...editData, nationalId: e.target.value})}
                              />
                            </FormGroup>
                          )}
                          
                          <FormGroup>
                            <FormLabel>Study Plan ID</FormLabel>
                            <FormInput
                              type="text"
                              value={editData.studyPlanId || ''}
                              onChange={(e) => setEditData({...editData, studyPlanId: e.target.value})}
                            />
                          </FormGroup>
                        </FormSection>
                      </div>
                      
                      {/* Address Information */}
                      <div>
                        <FormSection title="Address Information">
                          <FormGroup>
                            <FormLabel>Home Address</FormLabel>
                            <FormInput
                              type="text"
                              value={editData.homeAddress || ''}
                              onChange={(e) => setEditData({...editData, homeAddress: e.target.value})}
                            />
                          </FormGroup>
                          
                          <FormGroup>
                            <FormLabel>Street Address</FormLabel>
                            <FormInput
                              type="text"
                              value={editData.streetAddress || ''}
                              onChange={(e)=> setEditData({...editData, streetAddress: e.target.value})}
                            />
                          </FormGroup>
                          
                          <FormGroup>
                            <FormLabel>Building Name</FormLabel>
                            <FormInput
                              type="text"
                              value={editData.buildingName || ''}
                              onChange={(e) => setEditData({...editData, buildingName: e.target.value})}
                            />
                          </FormGroup>
                          
                          <FormRow>
                            <FormGroup>
                              <FormLabel>City</FormLabel>
                              <ModernDropdown
                                options={cityOptions}
                                value={editData.cityId || ''}
                                onChange={(value) => setEditData({...editData, cityId: value})}
                                placeholder="Select a city"
                                searchable={true}
                              />
                            </FormGroup>
                            
                            <FormGroup>
                              <FormLabel>City Name</FormLabel>
                              <FormInput
                                type="text"
                                value={editData.cityName || ''}
                                onChange={(e) => setEditData({...editData, cityName: e.target.value})}
                              />
                            </FormGroup>
                          </FormRow>
                          
                          <FormRow>
                            <FormGroup>
                              <FormLabel>Ward</FormLabel>
                              <ModernDropdown
                                options={wardOptions}
                                value={editData.wardId || ''}
                                onChange={(value) => setEditData({...editData, wardId: value})}
                                placeholder="Select a ward"
                                searchable={true}
                              />
                            </FormGroup>
                            
                            <FormGroup>
                              <FormLabel>Ward Name</FormLabel>
                              <FormInput
                                type="text"
                                value={editData.wardName|| ''}
                                onChange={(e) => setEditData({...editData, wardName: e.target.value})}
                              />
                            </FormGroup>
                          </FormRow>
                          
                          {/* Account Information */}
                          <FormSection title="Account Information">
                            <FormGroup>
                              <FormLabel>Account Status</FormLabel>
                              <FormSelect
                                value={editData.accountStatus || 1}
                                onChange={(e) =>setEditData({...editData, accountStatus: parseInt(e.target.value)})}
                              >
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                              </FormSelect>
                            </FormGroup>
                            
                            <FormGroup>
                              <FormLabel>Password (leave blank to keep current)</FormLabel>
                              <FormInput
                                type="password"
                                value={editData.password || ''}
                                onChange={(e) => setEditData({...editData, password: e.target.value})}
                                placeholder="Enter new password"
                              />
                            </FormGroup>
                          </FormSection>
                        </FormSection>
                      </div>
                    </FormRow>
                    
                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
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
      </div>
    </div>
  );
};

export default AdminStudentManager;