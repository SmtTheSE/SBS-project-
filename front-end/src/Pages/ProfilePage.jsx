import React, { useEffect, useState, useRef } from "react";
import defaultCoverPic from "../assets/cover-photos/cover-pic.jpg";
import defaultProfile from "../assets/profiles/profile.jpeg";
import Container from "../Components/Container";
import SubContainer from "../Components/SubContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import donePayment from "../assets/icons/done-payment.png";
import failPayment from "../assets/icons/fail-payment.png";
import payment from "../assets/icons/payment.png";
import credit from "../assets/icons/score.png";
import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useProfileImage } from "../utils/profileImageContext";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [generalInfo, setGeneralInfo] = useState({ paymentStatus: null, totalCredits: null });
  const [classTimeline, setClassTimeline] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
 const navigate = useNavigate();
  const { profileImage, updateProfileImage, clearProfileImageCache } = useProfileImage();
  
  // Pagination states for upcoming deadlines
  const [deadlinesCurrentPage, setDeadlinesCurrentPage] = useState(1);
  const deadlinesItemsPerPage = 5; // Show 5 deadlines per page

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axiosInstance.get("/profile")
      .then((res) => {
        setProfile(res.data);
        fetchGeneralInfo(res.data.studentId);
        fetchClassTimeline(res.data.studentId);
        fetchAssignmentDeadlines(res.data.studentId);
        // Fetch profile image when profile data is loaded
        fetchProfileImage(res.data.studentId);
      })
      .catch(() => navigate("/login"));
  }, []);

const fetchProfileImage = (studentId) => {
  axiosInstance.get(`/account/profile/${studentId}/image`)
      .then((res) => {
        if (res.data.imageUrl) {
          // Add timestamp to prevent browser caching
          updateProfileImage(res.data.imageUrl);
        } else {
          // If no image found on server, use default
          updateProfileImage(null); // This will trigger default image in context
        }
      })
      .catch(() => {
        // Error handling - use default profile image
        updateProfileImage(null); // This will trigger default image in context
      });
  };

  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file || !profile)return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentId", profile.studentId);

    setIsUploading(true);
    axios.post("http://localhost:8080/api/account/profile/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        // Update profile image with new one (add timestamp to prevent caching)
       updateProfileImage(res.data.imageUrl);
      })
      .catch((error) => {
        console.error("Error uploading profile image:", error);
        alert("Failed to upload profile image");
      })
      .finally(() => {
        setIsUploading(false);
        // Reset file input
        event.target.value = "";
      });
};

const getWeekRange = (date) => {
    const currentDate = new Date(date);
    const dayOfWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
   const startDate = new Date(currentDate);

    // Calculate Monday as the first day of the week
    // Adjustfor Sunday (0) tobe considered as end of previous week
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(currentDate.getDate()+ diffToMonday);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); //Saturday

    return { startDate, endDate };
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month:"short",
      year: "numeric"
    });
  };

  const getDayOfWeek = (date) => {
   const days = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
  };

  const fetchGeneralInfo = (studentId) => {
    axiosInstance.get(`/tuition-payments/student/${studentId}`)
      .then((res) =>{
        const paymentStatus = res.data.some(p => p.paymentStatus === 1) ? 1 : 0;
        setGeneralInfo(prev => ({ ...prev, paymentStatus }));
      })
.catch(() => setGeneralInfo(prev => ({ ...prev, paymentStatus: 0 })));

    axiosInstance.get(`/academic/course-results/total-credits/${studentId}`)
      .then((res) => setGeneralInfo(prev => ({ ...prev, totalCredits: res.data })))
      .catch(() =>setGeneralInfo(prev => ({ ...prev, totalCredits: 0 })));
  };

  const fetchClassTimeline = (studentId) => {
    // Get currentweek range (Monday to Saturday)
    const { startDate, endDate } = getWeekRange(new Date());

    axiosInstance.get(`/academic/class-timelines/${studentId}`)
      .then((res) => {
        // Filter classes within the current week
        const classesInWeek =res.data.filter(classItem => {
const classDate = new Date(classItem.classDate);
          return classDate >= startDate && classDate <= endDate;
        });

        // Group by dayof week
        const grouped = classesInWeek.reduce((acc, curr) => {
          const classDate = new Date(curr.classDate);
          const dayOfWeek =getDayOfWeek(classDate);

          if (!acc[dayOfWeek]) acc[dayOfWeek] = [];
          acc[dayOfWeek].push(curr);
         return acc;
        }, {});

        // Create timeline for the current week (Monday to Saturday)
        const weekdaysOrder = ["Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        const formatted = weekdaysOrder.map((day, index) => {
          const subjects = grouped[day] ||[];
          const sortedSubjects = subjects.sort((a, b) => a.startTime.localeCompare(b.startTime));

          // Find the actual datefor this day in the current week
const dayDate = new Date(startDate);
          dayDate.setDate(startDate.getDate() + index);

          return {
            id: index,
            day,
date: dayDate,
            subjects: sortedSubjects.map((s, i) => ({
              id: i,
              subject: s.courseName,
              lecturer: s.lecturerName || "TBD",
              startTime: s.startTime,
              endTime: s.endTime,
            })),
          };
        });

        setClassTimeline(formatted);
      })
      .catch(() => setClassTimeline([]));
  };

  const fetchAssignmentDeadlines = (studentId) => {
    axiosInstance.get(`/academic/study-plan-courses/student/${studentId}`)
      .then((res) => {
        const deadlines = res.data.map((item,idx) => ({
          id: idx,
          name: item.courseName || item.course?.courseName || item.courseId,
          deadline:new Date(item.assignmentDeadline).toLocaleDateString("en-GB"),
        }));
        setUpcomingDeadlines(deadlines);
        setDeadlinesCurrentPage(1); // Reset to first page when data changes
      })
      .catch(() => setUpcomingDeadlines([]));
};

  // Pagination functions for upcoming deadlines
  const getPaginatedDeadlines = () => {
    const startIndex = (deadlinesCurrentPage - 1) * deadlinesItemsPerPage;
    const endIndex = startIndex + deadlinesItemsPerPage;
    return upcomingDeadlines.slice(startIndex, endIndex);
  };

  const getDeadlinesTotalPages = () => {
    return Math.ceil(upcomingDeadlines.length / deadlinesItemsPerPage);
  };

  const handleDeadlinesPageChange = (pageNumber) => {
    setDeadlinesCurrentPage(pageNumber);
  };

  const otherInfos = [
    { id: 1, name: "Payment", icon: payment, data: generalInfo.paymentStatus},
    { id: 2, name: "Total Credits", icon: credit, data: generalInfo.totalCredits },
  ];

  const today = new Date();
 const todayFormatted = formatDate(today);
  const { startDate, endDate } = getWeekRange(today);
  const weekRangeText = `${formatDate(startDate)}- ${formatDate(endDate)}`;

  // Get current deadlines for pagination
  const currentDeadlines = getPaginatedDeadlines();
  const deadlinesTotalPages = getDeadlinesTotalPages();

 return (
    <section>
      <Container>
        <div className="h-60 w-full overflow-hidden relative">
<img src={defaultCoverPic} alt="Cover Photo" className="object-cover w-full h-full" />
        </div>
        <SubContainer>
<div className="flex justify-start items-center gap-5 my-10">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md relative group">
              <img
                src={profileImage}
                alt="Profile Picture"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleProfileImageClick}
              >
                <span className="text-white text-sm font-bold">Change Photo</span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
               className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              {profile&& (
                <div key={profile.studentId} className="bg-white px-8 py-6 rounded-md shadow flex flex-wrap justify-center items-center gap-6 text-center">
                  <div className="px-6 border-r border-gray-300">
                    <h1 className="font-bold text-2xl">{profile.name}</h1>
                    <h3 className="text-gray-500">{profile.nativeCountry}</h3>
                  </div>
                  <div className="px-6 border-r border-gray-300">
                    <h1 className="font-bold text-2xl">SBS{profile.studentId}</h1>
                    <h3 className="text-gray-500">Student ID</h3>
                  </div>
                  <div className="px-6 border-r border-gray-300">
                    <h1 className="font-bold text-2xl">{profile.email}</h1>
                    <h3 className="text-gray-500">Email</h3>
</div>
                  <div className="px-6">
                    <h1 className="font-bold text-2xl">{profile.pathway}</h1>
                    <h3 className="text-gray-500">Pathway</h3>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mb-5">
            {otherInfos.map((otherInfo, index) => (
              <div key={index}className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-5">
                <div className="bg-background rounded-full w-20 h-20 overflow-hidden flex items-center justify-center mb-4">
                  <img src={otherInfo.icon} alt={otherInfo.name} className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{otherInfo.name}</h3>
                  <p className={
                    otherInfo.data === 0 ? "text-red-500" :
                    otherInfo.data === 1 ? "text-green-500" :
                    "text-font text-2xl"
                 }>
                    {otherInfo.data === 0 ? "Not yet" :
                    otherInfo.data === 1 ? "Completed" :
                    otherInfo.data}
                  </p>
                </div>
              </div>
))}
          </div>

          <div className="grid grid-cols-3 gap-3">
           <div className="bg-white p-5 col-span-2 row-span-2 rounded-md">
              <div className="flex justify-between items-center uppercase text-gray-500 text-xl border-b border-font-lightpb-5">
<h1>Class Timeline</h1>
                <p className="text-sm normal-case text-gray-500">{weekRangeText}</p>
              </div>
              <div>
                {classTimeline.map((timeline) => (
                  <div key={timeline.id} className="grid grid-cols-4 py-5 border-b border-border">
                    <div className="col-span-1">
                      <div className="flex items-center gap-2">
                        <h1 className="text-font text-2xl">
                          {formatDate(timeline.date) === todayFormatted ? "Today" : timeline.day}
                        </h1>
                      </div>
                      <p className="text-font-light">{formatDate(timeline.date)}</p>
                    </div>
                    <div className="col-span-3">
                      {!timeline.subjects?.length ? (
                        <h1 className="text-2xl text-font">Noclasses - Enjoyyour day off!</h1>
                      ) : (
                        <div>
                          {timeline.subjects.map((sub) => (
                            <div key={sub.id}>
                              <div className="flex justify-start items-center">
                                <div className="w-25">
                                  <h3>{sub.startTime}</h3>
                                  <h3>{sub.endTime}</h3>
                                </div>
                                <div className="w-full p-5 border-l-5 border-border bg-background">
                                  <div className="flex justify-between items-center w-full">
                                    <h1 className="flex items-center gap-3">
                                     <span className="block rounded-full bg-amber-600 w-2 h-2"></span>
                                      {sub.subject}
                                    </h1>
                                    <h1>{sub.lecturer}</h1>
                                  </div>
                                </div>
                              </div>
                              <br />
                            </div>
                          ))}
</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 col-span-1 rounded-md">
              <h1 className="uppercase text-gray-500 text-xl border-b border-font-light pb-5">Upcoming Deadlines</h1>
              <div>
                {currentDeadlines.map((el) => (
                  <div key={el.id} className="flex justify-between items-center border-b border-font-light py-3">
                    <h1 className="flex justify-start items-center gap-2">
                      <span className="block rounded-full bg-amber-600 w-2 h-2"></span>
                     {el.name}
                    </h1>
                    <p>{el.deadline}</p>
                  </div>
                ))}
                
                {/* Pagination for Upcoming Deadlines */}
                {deadlinesTotalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <nav className="flex items-center gap-1">
                      <button
                        onClick={() => handleDeadlinesPageChange(deadlinesCurrentPage - 1)}
                        disabled={deadlinesCurrentPage === 1}
                        className={`px-2 py-1 text-sm rounded ${
                          deadlinesCurrentPage === 1 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Previous
                      </button>
                      
                      {[...Array(deadlinesTotalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handleDeadlinesPageChange(pageNumber)}
                            className={`w-8 h-8 text-sm rounded-full ${
                              deadlinesCurrentPage === pageNumber
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handleDeadlinesPageChange(deadlinesCurrentPage + 1)}
                        disabled={deadlinesCurrentPage === deadlinesTotalPages}
                        className={`px-2 py-1 text-sm rounded ${
                          deadlinesCurrentPage === deadlinesTotalPages 
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
            </div>
          </div>
        </SubContainer>
</Container>
    </section>
  );
};

export default ProfilePage;