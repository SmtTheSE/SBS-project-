// File: src/pages/Transcripts.jsx
import React, { useEffect, useState } from "react";
import Container from "../Components/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import DropDowns from "../Components/DropDown";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Transcripts = () => {
  const [records, setRecords] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestType, setRequestType] = useState(0); // 0 = Unofficial, 1 = Official
  const [optionalMessage, setOptionalMessage] = useState("");
  const [requestStatus, setRequestStatus] = useState(""); // For success/error messages
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
    } catch (err) {
      console.error("Failed to fetch transcript:", err);
    }
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

  return (
    <section>
      <Container className="p-10 flex justify-between items-start gap-5">
        {/* Academic Records */}
        <div className="shadow-md p-5 rounded-md w-[70%] bg-white">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-font text-4xl font-bold">Academic Records</h1>
            <DropDowns />
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
              {records.map((record) =>
                record.courses.map((course, index) => (
                  <tr
                    className="border-b border-border"
                    key={`${record.semester}-${course.course}`}
                  >
                    <td className="py-5">
                      {index === 0 ? record.semester : ""}
                    </td>
                    <td className="py-5">{course.course}</td>
                    <td className="py-5">{course.course_name}</td>
                    <td className="py-5">{course.grade}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex gap-3 items-center">
            <button className="bg-iconic text-background py-3 px-8 rounded-md">
              Download Transcript
            </button>
            <button className="bg-[var(--light-gray--)] text-background py-3 px-8 rounded-md">
              Preview
            </button>
          </div>
        </div>

        {/* Request */}
        <div className="shadow-md rounded-md w-[30%] p-5 flex flex-col justify-between items-center h-50 bg-white">
          <h1 className="text-2xl text-font">Transcript Request</h1>
          
          {showRequestForm ? (
            <form onSubmit={handleRequestSubmit} className="w-full">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
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
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Optional Message
                </label>
                <textarea
                  value={optionalMessage}
                  onChange={(e) => setOptionalMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iconic"
                  rows="3"
                  placeholder="Enter any additional information..."
                />
              </div>
              
              {requestStatus === "success" && (
                <div className="mb-4 text-green-600">
                  Transcript request submitted successfully!
                </div>
              )}
              
              {requestStatus === "error" && (
                <div className="mb-4 text-red-600">
                  Error submitting request. Please try again.
                </div>
              )}
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-font text-white px-4 py-2 rounded-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          ) : (
            <button 
              className="bg-font text-background px-5 py-3 rounded-md"
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