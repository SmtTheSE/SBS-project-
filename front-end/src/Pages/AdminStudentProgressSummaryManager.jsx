import React, { useState, useEffect } from "react";
import axios from "../api/axios";

const AdminStudentProgressSummaryManager = () => {
  const [studentProgressSummaries, setStudentProgressSummaries] = useState([]);
  const [students, setStudents] = useState([]);
  const [studyPlans, setStudyPlans] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    studentId: "",
    studyPlanId: "",
    totalEnrolledCourse: 0,
    totalCompletedCourse: 0,
    totalCreditsEarned: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        studentProgressSummariesRes,
        studentsRes,
        studyPlansRes
      ] = await Promise.all([
        axios.get("/admin/academic/student-progress-summaries"),
        axios.get("/admin/students"),
        axios.get("/admin/academic/study-plans")
      ]);

      setStudentProgressSummaries(studentProgressSummariesRes.data);
      setStudents(studentsRes.data);
      setStudyPlans(studyPlansRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes("total") ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/admin/academic/student-progress-summaries/${formData.id}`, formData);
      } else {
        await axios.post("/admin/academic/student-progress-summaries", formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving student progress summary:", error);
    }
  };

  const handleEdit = (studentProgressSummary) => {
    setFormData(studentProgressSummary);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/academic/student-progress-summaries/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting student progress summary:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      studentId: "",
      studyPlanId: "",
      totalEnrolledCourse: 0,
      totalCompletedCourse: 0,
      totalCreditsEarned: 0
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Student Progress Summary Management</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Progress Summary Management</h1>
      
      {/* Form for creating/editing student progress summaries */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Student Progress Summary" : "Add New Student Progress Summary"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student
            </label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.studentId} value={student.studentId}>
                  {student.name} ({student.studentId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Study Plan
            </label>
            <select
              name="studyPlanId"
              value={formData.studyPlanId}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Study Plan</option>
              {studyPlans.map((studyPlan) => (
                <option key={studyPlan.studyPlanId} value={studyPlan.studyPlanId}>
                  {studyPlan.studyPlanId}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Enrolled Courses
            </label>
            <input
              type="number"
              name="totalEnrolledCourse"
              value={formData.totalEnrolledCourse}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Completed Courses
            </label>
            <input
              type="number"
              name="totalCompletedCourse"
              value={formData.totalCompletedCourse}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Credits Earned
            </label>
            <input
              type="number"
              name="totalCreditsEarned"
              value={formData.totalCreditsEarned}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>

          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {isEditing ? "Update" : "Create"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table to display student progress summaries */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Student Progress Summaries</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Study Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Enrolled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits Earned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentProgressSummaries.map((summary) => (
                <tr key={summary.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {summary.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {summary.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {summary.studyPlanId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {summary.totalEnrolledCourse}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {summary.totalCompletedCourse}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {summary.totalCreditsEarned}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(summary)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(summary.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentProgressSummaryManager;