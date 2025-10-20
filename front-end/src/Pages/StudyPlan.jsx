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
import axios from "axios";
import { useNavigate } from "react-router-dom";

// FilterByDropDown styled like previous, **without** the manual arrow
const FilterByDropDown = ({ filter, setFilter, subjPlans }) => {
  // 获取所有唯一的年份和学期组合
  const uniqueYearSemOptions = [...new Set(subjPlans.map(plan => `Year ${plan.year} - Sem ${plan.sem}`))]
    .sort((a, b) => {
      const [yearA, semA] = a.match(/\d+/g).map(Number);
      const [yearB, semB] = b.match(/\d+/g).map(Number);
      return yearA === yearB ? semA - semB : yearA - yearB;
    });

  return (
    <select
      value={filter.filterBy}
      onChange={e => setFilter(prev => ({ ...prev, filterBy: e.target.value }))}
      className="w-40 rounded-md border border-border px-3 py-2 bg-white text-font-light focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
    >
      <option value="none" className="text-font-light">All Years/Sems</option>
      {uniqueYearSemOptions.map(option => (
        <option key={option} value={option} className="text-font-light">{option}</option>
      ))}
    </select>
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
  }, [subjPlans, filter.filterBy]);

  const getGroupedPlans = () => {
    const plans = filteredPlans;
    const groups = [...new Set(plans.map((p) => `Year ${p.year} - Sem ${p.sem}`))]
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
      let groupItems = plans.filter(
        (plan) => `Year ${plan.year} - Sem ${plan.sem}` === group
      );
      return { group, groupItems };
    });
  };

  return (
    <section className="p-10">
      <Container>
        <div className="flex justify-between items-center gap-5 mb-5">
          {academicInfos.map((info) => (
            <div
              key={info.detail}
              className="w-500 rounded-md  px-5 py-3 bg-white flex items-center gap-5"
            >
              <div className="relative w-20 h-20 bg-background overflow-hidden rounded-full">
                <img
                  src={info.icon}
                  alt={info.detail}
                  className="w-15 object-cover absolute top-[50%] left-[50%] -translate-[50%] "
                />
              </div>
              <div>
                <h5 className="font-light text-font-light">{info.detail}</h5>
                <h1
                  className={`text-2xl font-bold`}
                >
                  {info.detail === "Credits"
                    ? info.content + " / 100"
                    : info.content}
                </h1>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-start gap-5">
          <div className="bg-white p-5 rounded-md w-2/3">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <h1 className="text-2xl text-font-light uppercase">
                Study Plan Timeline/Roadmap
              </h1>
              {/* Previous design for filter by dropdown, no arrow */}
              <FilterByDropDown filter={filter} setFilter={setFilter} subjPlans={subjPlans} />
            </div>

            <table className="w-full border-separate border-spacing-y-2">
              <tbody>
                {getGroupedPlans().map(({ group, groupItems }) => (
                  <React.Fragment key={group}>
                    <tr>
                      <td colSpan="2" className="bg-gray-200 font-bold p-2">
                        {group}
                      </td>
                    </tr>
                    {groupItems.map((plan) => (
                      <tr key={plan.id}>
                        <td className="w-1/4 text-sm text-gray-500">
                          {plan.status === 1
                            ? "Completed"
                            : plan.status === 0
                            ? "In Progress"
                            : "Coming"}
                        </td>
                        <td className="flex justify-between items-center border-l-5 border-border p-3 bg-blue-50">
                          <h1>
                            <span className="font-bold">{plan.subject}</span> by {plan.lecturer}
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
              </tbody>
            </table>
          </div>

          <div className="bg-white p-5 w-1/3 rounded-md">
            <h1 className="text-2xl text-font-light uppercase pb-5 border-b border-border mb-5">
              Course History
            </h1>
            <div>
              {filteredPlans
                .filter((subj) => subj.status === 1)
                .map((subj) => (
                  <div key={subj.id} className="flex items-center bg-blue-50 border-l-5 border-border p-3 mb-3">
                    <h1 className="flex-grow mr-2">{subj.subject}</h1>
                    <p className="flex items-center whitespace-nowrap">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-green-600 mr-2" />
                      Completed
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default StudyPlan;