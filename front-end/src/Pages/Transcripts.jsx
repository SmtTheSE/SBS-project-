// File: src/pages/Transcripts.jsx
import React, { useEffect, useState } from "react";
import Container from "../Components/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import DropDowns from "../Components/DropDown";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 自定义筛选下拉组件
const TranscriptFilter = ({ records, onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filterType, setFilterType] = useState('all'); // 'all', 'semester', 'grade'

  // 获取所有学期选项
  const semesters = [...new Set(records.map(record => record.semester))].sort();
  
  // 获取所有成绩选项
  const grades = [...new Set(records.flatMap(record => 
    record.courses.map(course => course.grade)
  ))].filter(grade => grade !== "-").sort();

  const handleFilterChange = (type, value) => {
    setSelectedFilter(value);
    setFilterType(type);
    onFilterChange(type, value);
  };

  return (
    <div className="flex gap-3">
      <select 
        onChange={(e) => handleFilterChange('semester', e.target.value)}
        className="rounded-lg border border-border px-4 py-2 bg-white text-font-light focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
      >
        <option value="">Filter by Semester</option>
        {semesters.map(semester => (
          <option key={semester} value={semester}>{semester}</option>
        ))}
      </select>
      
      <select 
        onChange={(e) => handleFilterChange('grade', e.target.value)}
        className="rounded-lg border border-border px-4 py-2 bg-white text-font-light focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
      >
        <option value="">Filter by Grade</option>
        {grades.map(grade => (
          <option key={grade} value={grade}>{grade}</option>
        ))}
      </select>
    </div>
  );
};

const Transcripts = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestType, setRequestType] = useState(0); // 0 = Unofficial, 1 = Official
  const [optionalMessage, setOptionalMessage] = useState("");
  const [requestStatus, setRequestStatus] = useState(""); // For success/error messages
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 每页显示的记录数
  const navigate = useNavigate();
  
  // 筛选状态
  const [activeFilters, setActiveFilters] = useState({
    semester: "",
    grade: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios.get("http://localhost:8080/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const studentId = res.data.studentId;
        setStudentId(studentId);
        fetchTranscript(studentId, token);
      })
      .catch(() => navigate("/login"));
  }, []);

  const fetchTranscript = async (studentId, token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [coursesRes, resultsRes, gradesRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/academic/study-plan-courses/student/${studentId}`, { headers }),
        axios.get(`http://localhost:8080/api/academic/course-results/student/${studentId}`, { headers }),
        axios.get("http://localhost:8080/api/academic/grades", { headers }),
      ]);

      const courseList = Array.isArray(coursesRes.data) ? coursesRes.data : [];
      const resultList = Array.isArray(resultsRes.data) ? resultsRes.data : [];
      const gradeList = Array.isArray(gradesRes.data) ? gradesRes.data : [];

      const courseGradeMap = {};
      resultList.forEach((result) => {
        courseGradeMap[result.studyPlanCourseId] = result.gradeName?.toUpperCase();
      });

      const gradeDescMap = {};
      gradeList.forEach((g) => {
        gradeDescMap[g.gradeName?.toUpperCase()] = g.description;
      });

      const grouped = {};
      courseList.forEach((course) => {
        const { semesterId, courseId, courseName, studyPlanCourseId } = course;
        const gradeName = courseGradeMap[studyPlanCourseId];
        const gradeLabel = gradeName ? `${gradeName} (${gradeDescMap[gradeName] || ""})` : "-";

        grouped[semesterId] = grouped[semesterId] || [];
        grouped[semesterId].push({
          course: courseId,
          course_name: courseName,
          grade: gradeLabel,
        });
      });

      const formatted = Object.entries(grouped).map(([semester, courses]) => ({
        semester,
        courses,
      }));

      setRecords(formatted);
      setFilteredRecords(formatted);
      // 重置分页
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to fetch transcript:", err);
    }
  };

  // 计算分页数据
  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // 计算总页数
  const getTotalPages = (data) => {
    // 计算总记录数（所有学期中的课程总数）
    const totalRecords = data.reduce((total, record) => {
      return total + (Array.isArray(record.courses) ? record.courses.length : 0);
    }, 0);
    return Math.ceil(totalRecords / itemsPerPage);
  };

  // 添加动画状态
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 处理页面切换
  const handlePageChange = (pageNumber) => {
    if (pageNumber !== currentPage && pageNumber >= 1 && pageNumber <= totalPages) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage(pageNumber);
        setIsAnimating(false);
      }, 150); // 与CSS动画持续时间匹配
    }
  };

  // 处理筛选逻辑
  const handleFilter = (type, value) => {
    // 更新活动筛选器状态
    const newFilters = { ...activeFilters, [type]: value };
    setActiveFilters(newFilters);
    
    // 确保 records 是数组
    const validRecords = Array.isArray(records) ? records : [];
    
    if ((!newFilters.semester && !newFilters.grade) || (newFilters.semester === "" && newFilters.grade === "")) {
      setFilteredRecords(validRecords);
    } else {
      let filtered = validRecords;
      
      // 按学期筛选
      if (newFilters.semester) {
        filtered = filtered.filter(record => record.semester === newFilters.semester);
      }
      
      // 按成绩筛选
      if (newFilters.grade) {
        filtered = filtered.map(record => {
          // 确保 record.courses 是数组
          const courses = Array.isArray(record.courses) ? record.courses : [];
          const filteredCourses = courses.filter(course => course.grade.includes(newFilters.grade));
          return {...record, courses: filteredCourses};
        }).filter(record => Array.isArray(record.courses) && record.courses.length > 0);
      }
      
      setFilteredRecords(filtered);
    }
    
    // 重置分页到第一页
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(1);
      setIsAnimating(false);
    }, 150);
  };

  // 清除筛选器
  const clearFilters = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveFilters({
        semester: "",
        grade: ""
      });
      setFilteredRecords(Array.isArray(records) ? records : []);
      setCurrentPage(1);
      setIsAnimating(false);
    }, 150);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestStatus("");
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8080/api/academic/transcript-requests/submit?studentId=${studentId}&transcriptType=${requestType}&optionalMessage=${encodeURIComponent(optionalMessage || "")}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setRequestStatus("success");
        // Hide form after successful submission
        setTimeout(() => {
          setShowRequestForm(false);
          setRequestStatus("");
        }, 2000);
      } else {
        setRequestStatus("error");
      }
    } catch (err) {
      console.error("Failed to submit transcript request:", err);
      setRequestStatus("error");
    }
  };

  // 获取当前页的数据
  const currentRecords = getPaginatedData(filteredRecords, currentPage);
  const totalPages = getTotalPages(filteredRecords);

  // 处理分页显示的记录
  const getPaginatedRecords = () => {
    let itemsToShow = [];
    let itemsCount = 0;
    const startIndex = (currentPage - 1) * itemsPerPage;
    
    // 遍历记录并收集需要显示的项目
    for (const record of filteredRecords) {
      if (!Array.isArray(record.courses)) continue;
      
      for (const course of record.courses) {
        // 如果还没到起始索引，跳过
        if (itemsCount < startIndex) {
          itemsCount++;
          continue;
        }
        
        // 如果已达到每页数量，停止添加
        if (itemsToShow.length >= itemsPerPage) {
          break;
        }
        
        // 添加记录到显示列表
        itemsToShow.push({
          semester: itemsCount === startIndex ? record.semester : "", // 只在第一个课程显示学期
          course: course.course,
          course_name: course.course_name,
          grade: course.grade
        });
        
        itemsCount++;
      }
      
      if (itemsToShow.length >= itemsPerPage) {
        break;
      }
    }
    
    return itemsToShow;
  };

  // 根据成绩获取颜色类名
  const getGradeColorClass = (grade) => {
    if (!grade || grade === "-") return "";
    
    // 提取成绩字母 (例如从 "A (Excellent)" 提取 "A")
    const gradeLetter = grade.split(" ")[0].toUpperCase();
    
    switch (gradeLetter) {
      case "A+":
      case "A":
      case "A-":
        return "bg-green-100 text-green-800 border border-green-300";
      case "B+":
      case "B":
      case "B-":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "C+":
      case "C":
      case "C-":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "D+":
      case "D":
      case "D-":
        return "bg-orange-100 text-orange-800 border border-orange-300";
      case "F":
      case "FAIL":
        return "bg-red-100 text-red-800 border border-red-300";
      case "P":
      case "PASS":
        return "bg-green-100 text-green-800 border border-green-300";
      case "M":
      case "MERIT":
        return "bg-purple-100 text-purple-800 border border-purple-300";
      case "DISTINCTION":
        return "bg-indigo-100 text-indigo-800 border border-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const paginatedRecords = getPaginatedRecords();

  return (
    <section>
      <Container className="p-10 flex justify-between items-start gap-5">
        {/* Academic Records */}
        <div className="shadow-md p-5 rounded-md w-[70%] bg-white">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-font text-4xl font-bold">Academic Records</h1>
            <TranscriptFilter records={Array.isArray(records) ? records : []} onFilterChange={handleFilter} />
          </div>
          
          {/* Active Filters Display */}
          {(activeFilters.semester || activeFilters.grade) && (
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 transition-all duration-300 ease-in-out">
              <span className="font-semibold text-blue-800 mr-2">Active Filters:</span>
              {activeFilters.semester && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center transition-all duration-200 hover:bg-blue-200">
                  Semester: {activeFilters.semester}
                  <button 
                    onClick={() => handleFilter('semester', '')}
                    className="ml-2 text-blue-600 hover:text-blue-900"
                  >
                    <FontAwesomeIcon icon={faTimes} size="sm" />
                  </button>
                </span>
              )}
              {activeFilters.grade && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center transition-all duration-200 hover:bg-blue-200">
                  Grade: {activeFilters.grade}
                  <button 
                    onClick={() => handleFilter('grade', '')}
                    className="ml-2 text-blue-600 hover:text-blue-900"
                  >
                    <FontAwesomeIcon icon={faTimes} size="sm" />
                  </button>
                </span>
              )}
              <button 
                onClick={clearFilters}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center transition-all duration-200 hover:bg-red-200"
              >
                Clear All
                <FontAwesomeIcon icon={faTimes} className="ml-1" size="sm" />
              </button>
            </div>
          )}

          <table className={`w-full text-left mb-5 transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <thead>
              <tr className="border-b border-border">
                <th className="py-3">Semester</th>
                <th className="py-3">Course</th>
                <th className="py-3">Course Name</th>
                <th className="py-3">Grade</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record, index) => (
                  <tr className="border-b border-border hover:bg-gray-50 transition-colors duration-150" key={index}>
                    <td className="py-5">{record.semester || ""}</td>
                    <td className="py-5">{record.course || "-"}</td>
                    <td className="py-5">{record.course_name || "-"}</td>
                    <td className="py-5">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getGradeColorClass(record.grade)}`}>
                        {record.grade || "-"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-5 text-center text-gray-500">
                    No academic records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="flex justify-center mb-5">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-10 h-10 rounded-full ${
                        currentPage === pageNumber
                          ? 'bg-blue-500 text-white shadow-md transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>

        {/* Request */}
        <div className="shadow-md rounded-md w-[30%] p-5 flex flex-col justify-between items-center bg-white">
          <h1 className="text-2xl text-font mb-5">Transcript Request</h1>
          
          {showRequestForm ? (
            <div className="w-full animate-fadeIn">
              <form onSubmit={handleRequestSubmit} className="w-full space-y-4">
                <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-bold">
                    Transcript Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="transcriptType"
                        value={0}
                        checked={requestType === 0}
                        onChange={() => setRequestType(0)}
                        className="mr-2"
                      />
                      Unofficial
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="transcriptType"
                        value={1}
                        checked={requestType === 1}
                        onChange={() => setRequestType(1)}
                        className="mr-2"
                      />
                      Official
                    </label>
                  </div>
                  {requestType === 1 && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm text-blue-800 border border-blue-200">
                      <p className="font-semibold">Official Transcript Process:</p>
                      <ol className="list-decimal list-inside mt-1 space-y-1">
                        <li>Your request will be reviewed by administration</li>
                        <li>Upon approval, the transcript will be issued with official seal</li>
                        <li>You will be notified when it's ready for pickup or mailing</li>
                      </ol>
                    </div>
                  )}
                </div>
              
                <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-bold">
                    Optional Message
                  </label>
                  <textarea
                    value={optionalMessage || ""}
                    onChange={(e) => setOptionalMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows="3"
                    placeholder="Enter any additional information..."
                  />
                </div>
              
                {requestStatus === "success" && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
                    Transcript request submitted successfully!
                  </div>
                )}
              
                {requestStatus === "error" && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                    Error submitting request. Please try again.
                  </div>
                )}
              
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md w-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              onClick={() => setShowRequestForm(true)}
            >
              Request Now
            </button>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Transcripts;