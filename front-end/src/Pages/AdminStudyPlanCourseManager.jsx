import React, { useState, useEffect, useMemo } from "react";
import axios from "../utils/axiosInstance";
import { Edit, Trash2, Search, Filter } from 'lucide-react'; // Import icons
import CustomConfirmDialog from '../Components/CustomConfirmDialog';

const AdminStudyPlanCourseManager = () => {
  const [studyPlanCourses, setStudyPlanCourses] = useState([]);
  const [studyPlans, setStudyPlans] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    studyPlanCourseId: "",
    studyPlanId: "",
    courseId: "",
    semesterId:"",
    assignmentDeadline: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  // 添加分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    studyPlan: '',
    course: '',
    semester: ''
  });

  // Get names for display
  const getStudyPlanName = (id) => {
    const studyPlan = studyPlans.find((sp) => sp.studyPlanId === id);
    return studyPlan ? `${studyPlan.pathwayName} - ${studyPlan.majorName}` : "N/A";
  };

  const getCourseName = (id) => {
    const course = courses.find((c) => c.courseId === id);
    return course ? course.courseName : "N/A";
  };

  const getSemesterName = (id) => {
    const semester = semesters.find((s) => s.semesterId === id);
    return semester ? `${semester.intakeMonth} ${semester.year}` : "N/A";
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch study plan courses
      const studyPlanCoursesRes = await axios.get(
        "/admin/academic/study-plan-courses"
      );
      setStudyPlanCourses(studyPlanCoursesRes.data);
      // 添加新记录后返回第一页
      setCurrentPage(1);

      // Fetch study plans
      const studyPlansRes = await axios.get(
        "/academic/study-plans"
      );
      setStudyPlans(studyPlansRes.data);

      // Fetch courses
      const coursesRes = await axios.get(
        "/academic/courses"
      );
      setCourses(coursesRes.data);

      // Fetch semesters
      const semestersRes = await axios.get(
        "/academic/semesters"
      );
      setSemesters(semestersRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to fetch data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtered study plan courses based on search and filters
  const filteredStudyPlanCourses = useMemo(() => {
    return studyPlanCourses.filter(course => {
      // Apply search term
      const matchesSearch = !searchTerm || 
        (course.studyPlanCourseId && course.studyPlanCourseId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (getStudyPlanName(course.studyPlanId).toLowerCase().includes(searchTerm.toLowerCase())) ||
        (getCourseName(course.courseId).toLowerCase().includes(searchTerm.toLowerCase())) ||
        (getSemesterName(course.semesterId).toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Apply filters
      const matchesStudyPlan = !filters.studyPlan || 
        (course.studyPlanId && course.studyPlanId.toLowerCase().includes(filters.studyPlan.toLowerCase())) ||
        (getStudyPlanName(course.studyPlanId).toLowerCase().includes(filters.studyPlan.toLowerCase()));
      
      const matchesCourse = !filters.course || 
        (course.courseId && course.courseId.toLowerCase().includes(filters.course.toLowerCase())) ||
        (getCourseName(course.courseId).toLowerCase().includes(filters.course.toLowerCase()));
      
      const matchesSemester = !filters.semester || 
        (course.semesterId && course.semesterId.toLowerCase().includes(filters.semester.toLowerCase())) ||
        (getSemesterName(course.semesterId).toLowerCase().includes(filters.semester.toLowerCase()));
      
      return matchesSearch && matchesStudyPlan && matchesCourse && matchesSemester;
    });
  }, [studyPlanCourses, searchTerm, filters, studyPlans, courses, semesters]);

  // 获取当前页面的数据
  const getCurrentCourses = () => {
    const indexOfLastCourse = currentPage * itemsPerPage;
    const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
    return filteredStudyPlanCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  };

  // 计算总页数
  const totalPages = Math.ceil(filteredStudyPlanCourses.length / itemsPerPage);

  // 获取当前页面的数据
  const currentCourses = getCurrentCourses();

  // 分页控制函数
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredStudyPlanCourses.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      studyPlan: '',
      course: '',
      semester: ''
    });
    setCurrentPage(1);
  };

  const removeFilter = (filterKey) => {
    if (filterKey === 'search') {
      setSearchTerm('');
    } else {
      setFilters(prev => ({
        ...prev,
        [filterKey]: ''
      }));
    }
    setCurrentPage(1);
  };

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const filtersList = [];
    if (searchTerm) filtersList.push({ key: 'search', label: `Search: ${searchTerm}` });
    if (filters.studyPlan) filtersList.push({ key: 'studyPlan', label: `Study Plan: ${filters.studyPlan}` });
    if (filters.course) filtersList.push({ key: 'course', label: `Course: ${filters.course}` });
    if (filters.semester) filtersList.push({ key: 'semester', label: `Semester: ${filters.semester}` });
    return filtersList;
  }, [searchTerm, filters]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isEditing) {
        // Update existing study plan course
        await axios.put(
          `/admin/academic/study-plan-courses/${formData.studyPlanCourseId}`,
          formData
        );
        setSuccess("Study plan course updated successfully");
      } else {
        // Create new study plan course
        await axios.post(
          "/admin/academic/study-plan-courses",
          formData
        );
        setSuccess("Study plan course created successfully");
      }

      // Reset form and refresh data
      setFormData({
        studyPlanCourseId: "",
        studyPlanId: "",
        courseId: "",
        semesterId: "",
        assignmentDeadline: "",
      });
      setIsEditing(false);
      fetchAllData();
    } catch (err) {
      console.error("Failed to save study plan course:", err);
      setError("Failed to save study plan course: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (studyPlanCourse) => {
    setFormData({
      studyPlanCourseId: studyPlanCourse.studyPlanCourseId,
      studyPlanId: studyPlanCourse.studyPlanId,
      courseId: studyPlanCourse.courseId,
      semesterId: studyPlanCourse.semesterId,
      assignmentDeadline: studyPlanCourse.assignmentDeadline,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    setCourseToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `/admin/academic/study-plan-courses/${courseToDelete}`
      );
      setSuccess("Study plan course deleted successfully");
      fetchAllData();
      // 删除记录后检查当前页是否为空
      const totalItems = filteredStudyPlanCourses.length - 1; // 删除后的总数
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    } catch (err) {
      console.error("Failed to delete study plan course:", err);
      setError("Failed to delete study plan course: " + err.message);
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
      setCourseToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setCourseToDelete(null);
  };

  const handleCancel = () => {
    setFormData({
      studyPlanCourseId: "",
      studyPlanId: "",
      courseId: "",
      semesterId: "",
      assignmentDeadline: "",
    });
    setIsEditing(false);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Study Plan Course Management</h1>
        <button
          onClick={() => {
            handleCancel();
            setShowForm(true);
          }}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Study Plan Course
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, Study Plan, Course, or Semester..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Filter Inputs */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                name="studyPlan"
                placeholder="Filter by Study Plan"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={filters.studyPlan}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <input
                type="text"
                name="course"
                placeholder="Filter by Course"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={filters.course}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <input
                type="text"
                name="semester"
                placeholder="Filter by Semester"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={filters.semester}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-center">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 inline mr-1" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
            {activeFilters.map((filter) => (
              <span 
                key={filter.key} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {filter.label}
                <button
                  type="button"
                  className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                  onClick={() => removeFilter(filter.key)}
                >
                  <span className="sr-only">Remove filter</span>
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Study Plan Courses Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Study Plan Courses • Total: {filteredStudyPlanCourses.length}</h2>
        {loading && filteredStudyPlanCourses.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Study Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCourses.length > 0 ? (
                  currentCourses.map((studyPlanCourse) => (
                    <tr key={studyPlanCourse.studyPlanCourseId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {studyPlanCourse.studyPlanCourseId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getStudyPlanName(studyPlanCourse.studyPlanId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getCourseName(studyPlanCourse.courseId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getSemesterName(studyPlanCourse.semesterId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {studyPlanCourse.assignmentDeadline}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setFormData({
                              studyPlanCourseId: studyPlanCourse.studyPlanCourseId,
                              studyPlanId: studyPlanCourse.studyPlanId,
                              courseId: studyPlanCourse.courseId,
                              semesterId: studyPlanCourse.semesterId,
                              assignmentDeadline: studyPlanCourse.assignmentDeadline,
                            });
                            setIsEditing(true);
                            setShowForm(true);
                          }}
                          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 mr-2"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(studyPlanCourse.studyPlanCourseId)
                          }
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 bg-gray-50">
                      <p className="text-gray-500 text-lg">
                        {searchTerm || filters.studyPlan || filters.course || filters.semester
                          ? 'No study plan courses match your search criteria'
                          : 'No study plan courses found'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {filteredStudyPlanCourses.length > itemsPerPage && (
              <div className="flex justify-center items-center space-x-2 my-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === index + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditing ? "Edit Study Plan Course" : "Add New Study Plan Course"}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Study Plan Course ID
                    </label>
                    <input
                      type="text"
                      name="studyPlanCourseId"
                      value={formData.studyPlanCourseId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={isEditing}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Study Plan
                    </label>
                    <select
                      name="studyPlanId"
                      value={formData.studyPlanId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Study Plan</option>
                      {studyPlans.map((studyPlan) => (
                        <option
                          key={studyPlan.studyPlanId}
                          value={studyPlan.studyPlanId}
                        >
                          {studyPlan.pathwayName} - {studyPlan.majorName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Course
                    </label>
                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course.courseId} value={course.courseId}>
                          {course.courseName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Semester
                    </label>
                    <select
                      name="semesterId"
                      value={formData.semesterId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Semester</option>
                      {semesters.map((semester) => (
                        <option
                          key={semester.semesterId}
                          value={semester.semesterId}
                        >
                          {semester.intakeMonth} {semester.year?.substring(0, 4)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Assignment Deadline
                    </label>
                    <input
                      type="date"
                      name="assignmentDeadline"
                      value={formData.assignmentDeadline}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : isEditing ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <CustomConfirmDialog
        isOpen={showConfirmDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Study Plan Course"
        message="Are you sure you want to delete this study plan course? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AdminStudyPlanCourseManager;