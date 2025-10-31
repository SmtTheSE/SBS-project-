import React, { useEffect, useState } from "react";
import Container from "../Components/Container";

import gpa from "../assets/icons/academic-success.png";
import credit from "../assets/icons/score.png";
import semester from "../assets/icons/calendar.png";
import status from "../assets/icons/project.png";
import DropDowns from "../Components/DropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// FilterByDropDown styled like previous, **without** the manual arrow
const FilterByDropDown = ({ filter, setFilter, subjPlans, onFilterChange }) => {
  // 获取所有唯一的年份和学期组合
  const uniqueYearSemOptions = [...new Set(subjPlans.map(plan => `Year ${plan.year} - Sem ${plan.sem}`))]
    .sort((a, b) => {
      const [yearA, semA] = a.match(/\d+/g).map(Number);
      const [yearB, semB] = b.match(/\d+/g).map(Number);
      return yearA === yearB ? semA - semB : yearA - yearB;
    });

  return (
    <div className="flex items-center space-x-2">
      <select
        value={filter.filterBy}
        onChange={e => {
          setFilter(prev => ({ ...prev, filterBy: e.target.value }));
          onFilterChange(e.target.value);
        }}
        className="w-48 rounded-lg border border-border px-4 py-2 bg-white text-font-light focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
      >
        <option value="none" className="text-font-light">All Years/Sems</option>
        {uniqueYearSemOptions.map(option => (
          <option key={option} value={option} className="text-font-light">{option}</option>
        ))}
      </select>
      
      {filter.filterBy !== "none" && (
        <button
          onClick={() => {
            setFilter(prev => ({ ...prev, filterBy: "none" }));
            onFilterChange("none");
          }}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
          title="Clear filter"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
    </div>
  );
};

const StudyPlan = () => {
  const [academicInfos, setAcademicInfo] = useState([
    { detail: "Credits", content: 0, icon: credit },
  ]);
  const [subjPlans, setSubjPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [filter, setFilter] = useState({
    filterBy: "none",
  });
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 每页显示的项目数
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios
      .get("http://localhost:8080/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const studentId = res.data.studentId;
        fetchAcademicInfo(studentId, token);
        fetchSubjects(studentId, token);
      })
      .catch(() => navigate("/login"));
  }, []);

  const fetchAcademicInfo = async (studentId, token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const creditsRes = await axios.get(
        `http://localhost:8080/api/academic/course-results/total-credits/${studentId}`,
        { headers }
      );
      const totalCredits = creditsRes.data || 0;

      setAcademicInfo([
        { detail: "Credits", content: totalCredits, icon: credit },
      ]);
    } catch {
      // fallback silently
    }
  };

  const parseSemesterId = (semesterId) => {
    // Handle the format: SEM_2024_1, SEM_2024_2, SEM_2024_3, etc.
    if (!semesterId || !/^SEM_\d{4}_\d+$/.test(semesterId)) return null;

    const parts = semesterId.split('_');
    if (parts.length !== 3) return null;

    const year = parseInt(parts[1], 10);
    const semester = parseInt(parts[2], 10);

    return { year, semester };
  };

  const fetchSubjects = async (studentId, token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const studyPlanCoursesRes = await axios.get(
        `http://localhost:8080/api/academic/study-plan-courses/student/${studentId}`,
        { headers }
      );
      const courses = Array.isArray(studyPlanCoursesRes.data)
        ? studyPlanCoursesRes.data
        : [];

      // Get all unique semester IDs and sort them chronologically
      const uniqueSemesters = [...new Set(courses.map(c => c.semesterId))]
        .filter(id => parseSemesterId(id) !== null)
        .sort((a, b) => {
          const semA = parseSemesterId(a);
          const semB = parseSemesterId(b);

          if (semA.year !== semB.year) {
            return semA.year - semB.year;
          }
          return semA.semester - semB.semester;
        });

      // Create mapping from semesterId to (year, semester) tuple
      const semesterMapping = {};
      const minYear = uniqueSemesters.length > 0
        ? parseSemesterId(uniqueSemesters[0]).year
        : 2024;

      uniqueSemesters.forEach((semesterId) => {
        const parsed = parseSemesterId(semesterId);
        // Calculate academic year based on the minimum year in the dataset
        const academicYear = parsed.year - minYear + 1;
        semesterMapping[semesterId] = {
          year: academicYear,
          sem: parsed.semester
        };
      });

      const resultsRes = await axios.get(
        `http://localhost:8080/api/academic/course-results/student/${studentId}`,
        { headers }
      );
      const results = Array.isArray(resultsRes.data) ? resultsRes.data : [];
      const completedCourseIds = new Set(
        results.filter((r) => !!r.gradeName).map((r) => r.studyPlanCourseId)
      );

      const classTimelineRes = await axios.get(
        `http://localhost:8080/api/academic/class-timelines/${studentId}`,
        { headers }
      );
      const classTimelineList = Array.isArray(classTimelineRes.data)
        ? classTimelineRes.data
        : [];

      const courseLecturerMap = {};
      classTimelineList.forEach((ct) => {
        if (ct.courseName && ct.lecturerName && !courseLecturerMap[ct.courseName]) {
          courseLecturerMap[ct.courseName] = ct.lecturerName;
        }
      });

      const subjPlanArr = courses.map((course, idx) => {
        const mapping = semesterMapping[course.semesterId] || { year: 1, sem: 1 };
        const lecturerName = courseLecturerMap[course.courseName] || "-";
        return {
          id: idx + 1,
          subject: course.courseName,
          lecturer: lecturerName,
          year: mapping.year,
          sem: mapping.sem,
          status: completedCourseIds.has(course.studyPlanCourseId) ? 1 : 0,
        };
      });

      setSubjPlans(subjPlanArr);
      // 重置分页
      setCurrentPage(1);
    } catch {
      setSubjPlans([]);
    }
  };

  useEffect(() => {
    let filtered = subjPlans;

    // 如果选择了特定的年份/学期，则进行过滤
    if (filter.filterBy !== "none") {
      const match = filter.filterBy.match(/Year (\d+) - Sem (\d+)/);
      if (match) {
        const year = parseInt(match[1]);
        const sem = parseInt(match[2]);
        filtered = subjPlans.filter(plan => plan.year === year && plan.sem === sem);
      }
    }

    setFilteredPlans(filtered);
    // 重置分页到第一页
    setCurrentPage(1);
  }, [subjPlans, filter.filterBy]);

  // 计算分页数据
  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // 计算总页数
  const getTotalPages = (data) => {
    return Math.ceil(data.length / itemsPerPage);
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

  const getGroupedPlans = () => {
    // 确保 filteredPlans 是数组
    const plans = Array.isArray(filteredPlans) ? filteredPlans : [];
    
    if (plans.length === 0) {
      return [];
    }
    
    // 获取当前页的数据
    const paginatedPlans = getPaginatedData(plans, currentPage);
    const totalPages = getTotalPages(plans);
    
    const groups = [...new Set(paginatedPlans.map((p) => `Year ${p.year} - Sem ${p.sem}`))]
      .sort((a, b) => {
        const getVal = (str) => {
          const match = str.match(/Year (\d+) - Sem (\d+)/);
          return match ? [parseInt(match[1]), parseInt(match[2])] : [0, 0];
        };
        const [ay, as] = getVal(a);
        const [by, bs] = getVal(b);
        return ay === by ? as - bs : ay - by;
      });

    return groups.map((group) => {
      let groupItems = paginatedPlans.filter(
        (plan) => `Year ${plan.year} - Sem ${plan.sem}` === group
      );
      return { group, groupItems };
    });
  };

  // 获取总页数
  const totalPages = getTotalPages(filteredPlans);

  const [activeFilters, setActiveFilters] = useState({
    yearSem: "none"
  });

  // 处理筛选逻辑
  const handleFilterChange = (value) => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveFilters({
        yearSem: value
      });
      setIsAnimating(false);
    }, 150);
  };

  // 清除筛选器
  const clearFilters = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setFilter(prev => ({ ...prev, filterBy: "none" }));
      setActiveFilters({
        yearSem: "none"
      });
      setIsAnimating(false);
    }, 150);
  };

  return (
    <section className="p-10">
      <Container>
        <div className="flex flex-wrap justify-between items-center gap-5 mb-5">
          {academicInfos.map((info) => (
            <div
              key={info.detail}
              className="flex-1 min-w-[200px] max-w-md rounded-xl px-6 py-4 bg-white flex items-center gap-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative w-16 h-16 bg-background overflow-hidden rounded-full flex items-center justify-center">
                <img
                  src={info.icon}
                  alt={info.detail}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h5 className="font-light text-font-light text-sm uppercase tracking-wider">{info.detail}</h5>
                <h1
                  className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
                >
                  {info.detail === "Credits"
                    ? info.content + " / 100"
                    : info.content}
                </h1>
              </div>
            </div>
          ))}
        </div>

        {/* Active Filters Display */}
        {activeFilters.yearSem !== "none" && (
          <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 transition-all duration-300 ease-in-out shadow-sm">
            <span className="font-semibold text-blue-800 mr-2 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Active Filters:
            </span>
            {activeFilters.yearSem !== "none" && (
              <span className="px-4 py-2 bg-white text-blue-800 rounded-full text-sm flex items-center shadow-sm transition-all duration-200 hover:shadow-md">
                Year/Sem: {activeFilters.yearSem}
                <button 
                  onClick={() => {
                    setFilter(prev => ({ ...prev, filterBy: "none" }));
                    handleFilterChange("none");
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full p-1"
                >
                  <FontAwesomeIcon icon={faTimes} size="sm" />
                </button>
              </span>
            )}
            <button 
              onClick={clearFilters}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm flex items-center transition-all duration-200 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg"
            >
              Clear All
              <FontAwesomeIcon icon={faTimes} className="ml-2" size="sm" />
            </button>
          </div>
        )}

        <div className="flex justify-between items-start gap-5">
          <div className="bg-white p-5 rounded-md w-2/3 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <h1 className="text-2xl text-font-light uppercase">
                Study Plan Timeline/Roadmap
              </h1>
              {/* Previous design for filter by dropdown, no arrow */}
              <FilterByDropDown 
                filter={filter} 
                setFilter={setFilter} 
                subjPlans={subjPlans} 
                onFilterChange={handleFilterChange} 
              />
            </div>

            <table className={`w-full border-separate border-spacing-y-2 transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <tbody>
                {getGroupedPlans().length > 0 ? (
                  <>
                    {getGroupedPlans().map(({ group, groupItems }) => (
                      <React.Fragment key={group}>
                        <tr>
                          <td colSpan="2" className="bg-gray-200 font-bold p-2 rounded-t-lg">
                            {group}
                          </td>
                        </tr>
                        {groupItems.map((plan) => (
                          <tr key={plan.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="w-1/4 text-sm text-gray-500">
                              {plan.status === 1
                                ? "Completed"
                                : plan.status === 0
                                ? "In Progress"
                                : "Coming"}
                            </td>
                            <td className="flex justify-between items-center border-l-5 border-border p-3 bg-blue-50 rounded-lg">
                              <h1>
                                <span className="font-bold">{plan.subject || "Unknown Subject"}</span> by {plan.lecturer || "Unknown Lecturer"}
                              </h1>
                              <span>
                                {plan.status === 1 ? (
                                  <FontAwesomeIcon icon={faCircleCheck} className="text-green-600" />
                                ) : plan.status === 0 ? (
                                  <FontAwesomeIcon icon={faClock} className="text-blue-800" />
                                ) : (
                                  <FontAwesomeIcon icon={faCircleXmark} className="text-red-600" />
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                    
                    {/* 分页控件 */}
                    {totalPages > 1 && (
                      <tr>
                        <td colSpan="2" className="pt-4">
                          <div className="flex justify-center">
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
                        </td>
                      </tr>
                    )}
                  </>
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center py-5 text-gray-500">
                      No study plan data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-5 w-1/3 rounded-md shadow-md hover:shadow-lg transition-all duration-300">
            <h1 className="text-2xl text-font-light uppercase pb-5 border-b border-border mb-5">
              Course History
            </h1>
            <div className="max-h-96 overflow-y-auto">
              {Array.isArray(filteredPlans) && filteredPlans.filter((subj) => subj.status === 1).length > 0 ? (
                filteredPlans
                  .filter((subj) => subj.status === 1)
                  .map((subj) => (
                    <div key={subj.id} className="flex items-center bg-blue-50 border-l-5 border-border p-3 mb-3 rounded-lg hover:bg-blue-100 transition-colors duration-150">
                      <h1 className="flex-grow mr-2">{subj.subject || "Unknown Subject"}</h1>
                      <p className="flex items-center whitespace-nowrap">
                        <FontAwesomeIcon icon={faCircleCheck} className="text-green-600 mr-2" />
                        Completed
                      </p>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 py-3">No completed courses</p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default StudyPlan;