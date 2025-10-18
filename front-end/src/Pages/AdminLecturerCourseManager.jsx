import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Edit, Trash2 } from 'lucide-react'; // Import icons

const AdminLecturerCourseManager = () => {
  const [lecturerCourses, setLecturerCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [studyPlanCourses, setStudyPlanCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [classSchedules, setClassSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    lecturerId: "",
    studyPlanCourseId: "",
    semesterId: "",
    classScheduleId: "",
    totalAssignedCourse: 0
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
        lecturerCoursesRes,
        lecturersRes,
        studyPlanCoursesRes,
        semestersRes,
        classSchedulesRes
      ] = await Promise.all([
        axios.get("/admin/lecturer-courses"),
        axios.get("/admin/lecturers"),
        axios.get("/academic/study-plan-courses"),
        axios.get("/academic/semesters"),
        axios.get("/admin/academic/class-schedules")
      ]);

      setLecturerCourses(lecturerCoursesRes.data);
      setLecturers(lecturersRes.data);
      setStudyPlanCourses(studyPlanCoursesRes.data);
      setSemesters(semestersRes.data);
      setClassSchedules(classSchedulesRes.data);
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
      [name]: name === "totalAssignedCourse" ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/admin/lecturer-courses/${formData.id}`, formData);
      } else {
        await axios.post("/admin/lecturer-courses", formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving lecturer-course mapping:", error);
    }
  };

  const handleEdit = (lecturerCourse) => {
    setFormData(lecturerCourse);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/lecturer-courses/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting lecturer-course mapping:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      lecturerId: "",
      studyPlanCourseId: "",
      semesterId: "",
      classScheduleId: "",
      totalAssignedCourse: 0
    });
    setIsEditing(false);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Lecturer-Course Mapping Management</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lecturer-Course Mapping Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add New Lecturer-Course Mapping
        </button>
      </div>

      {/* Table to display lecturer-course mappings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Lecturer-Course Mappings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lecturer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Study Plan Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Assigned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lecturerCourses.map((lecturerCourse) => (
                <tr key={lecturerCourse.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lecturerCourse.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {lecturerCourse.lecturerId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lecturerCourse.studyPlanCourseId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lecturerCourse.semesterId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lecturerCourse.classScheduleId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lecturerCourse.totalAssignedCourse}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setFormData(lecturerCourse);
                        setIsEditing(true);
                        setShowForm(true);
                      }}
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(lecturerCourse.id)}
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
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditing ? "Edit Lecturer-Course Mapping" : "Add New Lecturer-Course Mapping"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lecturer
                  </label>
                  <select
                    name="lecturerId"
                    value={formData.lecturerId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Lecturer</option>
                    {lecturers.map((lecturer) => (
                      <option key={lecturer.lecturerId} value={lecturer.lecturerId}>
                        {lecturer.name} ({lecturer.lecturerId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Study Plan Course
                  </label>
                  <select
                    name="studyPlanCourseId"
                    value={formData.studyPlanCourseId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Study Plan Course</option>
                    {studyPlanCourses.map((course) => (
                      <option key={course.studyPlanCourseId} value={course.studyPlanCourseId}>
                        {course.studyPlanCourseId}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <select
                    name="semesterId"
                    value={formData.semesterId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Semester</option>
                    {semesters.map((semester) => (
                      <option key={semester.semesterId} value={semester.semesterId}>
                        {semester.semesterId} - {semester.term} {semester.year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Schedule
                  </label>
                  <select
                    name="classScheduleId"
                    value={formData.classScheduleId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Class Schedule</option>
                    {classSchedules.map((schedule) => (
                      <option key={schedule.classScheduleId} value={schedule.classScheduleId}>
                        {schedule.classScheduleId} - {schedule.dayOfWeek} {schedule.startTime}-{schedule.endTime}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Assigned Courses
                  </label>
                  <input
                    type="number"
                    name="totalAssignedCourse"
                    value={formData.totalAssignedCourse}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLecturerCourseManager;