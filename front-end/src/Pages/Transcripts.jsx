// File: src/pages/Transcripts.jsx
import React, { useEffect, useState } from "react";
import Container from "../Components/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
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
    <div className="flex gap-2">
      <select 
        value={selectedFilter === 'all' ? 'all' : selectedFilter}
        onChange={(e) => handleFilterChange('all', e.target.value)}
        className="rounded-md border border-border px-3 py-2 bg-white text-font-light focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
      >
        <option value="all">All Records</option>
      </select>
      
      <select 
        onChange={(e) => handleFilterChange('semester', e.target.value)}
        className="rounded-md border border-border px-3 py-2 bg-white text-font-light focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
      >
        <option value="">Filter by Semester</option>
        {semesters.map(semester => (
          <option key={semester} value={semester}>{semester}</option>
        ))}
      </select>
      
      <select 
        onChange={(e) => handleFilterChange('grade', e.target.value)}
        className="rounded-md border border-border px-3 py-2 bg-white text-font-light focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
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

  // 处理页面切换
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 处理筛选逻辑
  const handleFilter = (type, value) => {
    // 确保 records 是数组
    const validRecords = Array.isArray(records) ? records : [];
    
    if (value === "" || value === "all") {
      setFilteredRecords(validRecords);
    } else if (type === 'semester') {
      const filtered = validRecords.filter(record => record.semester === value);
      setFilteredRecords(filtered);
    } else if (type === 'grade') {
      const filtered = validRecords.map(record => {
        // 确保 record.courses 是数组
        const courses = Array.isArray(record.courses) ? record.courses : [];
        const filteredCourses = courses.filter(course => course.grade === value);
        return {...record, courses: filteredCourses};
      }).filter(record => Array.isArray(record.courses) && record.courses.length > 0);
      setFilteredRecords(filtered);
    }
    
    // 重置分页到第一页
    setCurrentPage(1);
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
      case "A":
      case "A+":
      case "A-":
        return "text-green-600 font-bold";
      case "B":
      case "B+":
      case "B-":
        return "text-blue-600 font-bold";
      case "C":
      case "C+":
      case "C-":
        return "text-yellow-600 font-bold";
      case "D":
      case "D+":
      case "D-":
        return "text-orange-600 font-bold";
      case "F":
      case "FAIL":
        return "text-red-600 font-bold";
      default:
        return "";
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

          <table className="w-full text-left mb-5">
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
                  <tr className="border-b border-border" key={index}>
                    <td className="py-5">{record.semester || ""}</td>
                    <td className="py-5">{record.course || "-"}</td>
                    <td className="py-5">{record.course_name || "-"}</td>
                    <td className={`py-5 ${getGradeColorClass(record.grade)}`}>{record.grade || "-"}</td>
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
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
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
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
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
          ) : (
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md w-full transition-colors"
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