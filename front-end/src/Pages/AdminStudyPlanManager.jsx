import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Edit, Trash2 } from 'lucide-react'; // Import icons

const AdminStudyPlanManager = () => {
  const [studyPlans, setStudyPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 const[showForm, setShowForm] = useState(false);
 const [editingStudyPlan, setEditingStudyPlan] = useState(null);
  const [formData, setFormData] = useState({
    studyPlanId: '',
    pathwayName: '',
    totalCreditPoint: 0,
    majorName: ''
  });

useEffect(() => {
    fetchStudyPlans();
  }, []);

const fetchStudyPlans = async () => {
   try {
      const response = await axiosInstance.get('/academic/study-plans');
      setStudyPlans(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch study plans:', error);
      setError('Failed to fetch study plans');
      setLoading(false);
    }
  };

 const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   try {
      if (editingStudyPlan) {
        // Update existing record
        await axiosInstance.put(`/academic/study-plans/${formData.studyPlanId}`, formData);
      } else {
        //Create new record
await axiosInstance.post('/academic/study-plans', formData);
      }
      
      //Resetform and refresh dataset
      setFormData({
        studyPlanId: '',
        pathwayName: '',
        totalCreditPoint: 0,
        majorName: ''
      });
      setEditingStudyPlan(null);
      setShowForm(false);
      fetchStudyPlans();
    } catch (error) {
      console.error('Failed tosave study plan:', error);
      setError('Failed to save study plan');
    }
  };

 const handleEdit= (studyPlan) => {
    setFormData({
      studyPlanId: studyPlan.studyPlanId,
      pathwayName: studyPlan.pathwayName,
      totalCreditPoint: studyPlan.totalCreditPoint,
      majorName: studyPlan.majorName
    });
    setEditingStudyPlan(studyPlan);
    setShowForm(true);
  };

 const handleDelete = async (studyPlanId) => {
try{
     const confirmDelete =window.confirm('Are yousure you want to delete this study plan?');
     if (!confirmDelete)return;

      await axiosInstance.delete(`/academic/study-plans/${studyPlanId}`);
fetchStudyPlans();
    } catch (error) {
      console.error('Failed todeletestudyplan:', error);
setError('Failed todelete study plan');
    }
  };

  const handleCancel = () => {
   setFormData({
      studyPlanId: '',
      pathwayName: '',
      totalCreditPoint: 0,
      majorName: ''
});
    setEditingStudyPlan(null);
   setShowForm(false);
  };

if(loading){
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
         <h1 className="text-3xl font-bold text-gray-800 mb-6">Study Plan Management</h1>
         <p>Loading...</p>
        </div>
      </div>
    );
  }

 return (
    <div className="max-w-7xl mx-auto p-6">
<div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Study Plan Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-500text-white rounded hover:bg-blue-600"
          >
            {showForm ? 'Cancel': 'AddNew'}
          </button>
</div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
{error}
</div>
       )}

      {showForm && (
          <form onSubmit={handleSubmit}className="mb-8p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold mb-4">
{editingStudyPlan ? 'Edit Study Plan': 'AddNew StudyPlan'}
            </h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4mb-4">
             <div>
                <label className="block text-gray-700 mb-2">Study PlanID</label>
                <input
type="text"
                  name="studyPlanId"
                 value={formData.studyPlanId}
                 onChange={handleInputChange}
                  className="w-full p-2 border rounded"
required
                  disabled={editingStudyPlan}
                />
              </div>
              
              <div>
               <label className="blocktext-gray-700 mb-2">Pathway Name</label>
<input
                  type="text"
                  name="pathwayName"
                  value={formData.pathwayName}
onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
/>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">TotalCredit Point</label>
               <input
                  type="number"
name="totalCreditPoint"
                  value={formData.totalCreditPoint}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                 required
               />
             </div>
              
<div>
<label className="block text-gray-700 mb-2">MajorName</label>
                <input
                 type="text"
                  name="majorName"
                  value={formData.majorName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                required
/>
</div>
          </div>
            
            <div className="flex justify-endspace-x-2">
             <button
type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500text-white rounded hover:bg-gray-600"
              >
Cancel
            </button>
              <button
               type="submit"
               className="px-4 py-2bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editingStudyPlan? 'Update': 'Create'}
              </button>
            </div>
</form>
)}

       <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6py-3 text-left text-xs font-medium text-gray-500uppercase tracking-wider">
                  Study PlanID
                </th>
                <th className="px-6py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pathway Name</th>
               <th className="px-6 py-3 text-lefttext-xsfont-medium text-gray-500 uppercase tracking-wider">
                  TotalCredit Point
</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MajorName
</th>
                <th className="px-6 py-3text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studyPlans.map((studyPlan) => (
               <tr key={studyPlan.studyPlanId}>
                  <td className="px-6 py-4 whitespace-nowraptext-smfont-medium text-gray-900">
                    {studyPlan.studyPlanId}
                  </td>
                  <td className="px-6 py-4whitespace-nowraptext-sm text-gray-500">
                    {studyPlan.pathwayName}
                  </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {studyPlan.totalCreditPoint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {studyPlan.majorName}
                 </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(studyPlan)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={()=> handleDelete(studyPlan.studyPlanId)}
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
         </table>
          
          {studyPlans.length=== 0 && (
<div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No study plansfound</p>
            </div>
          )}
        </div>
      </div>
    </div>
 );
};

export default AdminStudyPlanManager;