import React, { useEffect, useState, useRef } from "react";
import defaultCoverPic from "../assets/cover-photos/sbs-pic-neGu5492.png";
import defaultProfile from "../assets/profiles/profile.jpeg";
import Container from "../Components/Container";
import SubContainer from "../Components/SubContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faUpload, faCertificate, faCoins, faCamera } from "@fortawesome/free-solid-svg-icons";
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
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [certificateFile, setCertificateFile] = useState(null);
  const [isUploadingCertificate, setIsUploadingCertificate] = useState(false);
  const fileInputRef = useRef(null);
  const certificateInputRef = useRef(null);
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

  const handleCertificateClick = () => {
    certificateInputRef.current.click();
  };

  const handleCertificateChange = (event) => {
    const file = event.target.files[0];
    if (!file || !profile) return;

    setCertificateFile(file);
  };

  const handleCertificateUpload = () => {
    if (!certificateFile || !profile) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("file", certificateFile);
    formData.append("studentId", profile.studentId);
    formData.append("certificateType", "credit-exemption");

    setIsUploadingCertificate(true);
    // 修复：使用 axiosInstance 而不是 axios，并移除 /api 前缀
    axiosInstance.post("/academic/certificates/upload", formData)
      .then((res) => {
        alert("Certificate uploaded successfully for credit exemption!");
        // Reset file input
        certificateInputRef.current.value = "";
        setCertificateFile(null);
      })
      .catch((error) => {
        console.error("Error uploading certificate:", error);
        // 更详细的错误处理
        if (error.response) {
          // 服务器响应了错误状态码
          if (error.response.status === 400) {
            alert("Failed to upload certificate: Bad Request. The server may not have the upload endpoint implemented yet.");
          } else if (error.response.status === 401) {
            alert("Authentication required. Please log in again.");
            navigate("/login");
          } else if (error.response.status === 500) {
            alert("Server error. Please try again later.");
          } else {
            alert(`Failed to upload certificate: ${error.response.status} - ${error.response.statusText}`);
          }
        } else if (error.request) {
          // 请求已发出但没有收到响应
          alert("Failed to upload certificate: No response from server. Please check your connection.");
        } else {
          // 其他错误
          alert("Failed to upload certificate: " + error.message);
        }
      })
      .finally(() => {
        setIsUploadingCertificate(false);
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
        {/* Modernized cover section with gradient overlay */}
        <div className="h-80 w-full overflow-hidden relative rounded-b-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-900 opacity-80"></div>
          <img src={defaultCoverPic} alt="Cover Photo" className="object-cover w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">Student Profile</h1>
              <p className="text-xl text-red-200">SBS Student Portal</p>
            </div>
          </div>
        </div>
        
        <SubContainer>
          {/* Modernized profile section with better layout and styling */}
          <div className="flex flex-col lg:flex-row justify-start items-center gap-8 my-10 p-6 bg-white rounded-2xl shadow-lg">
            <div className="relative group">
              <div className="w-40 h-40 rounded-2xl border-4 border-white overflow-hidden shadow-2xl relative">
                <img
                  src={profileImage}
                  alt="Profile Picture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div 
                className="absolute bottom-3 right-3 bg-red-600 rounded-full p-3 shadow-lg cursor-pointer transform transition-transform group-hover:scale-110 border-4 border-white"
                onClick={handleProfileImageClick}
              >
                <FontAwesomeIcon icon={faCamera} className="text-white text-base" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                  <div className="w-10 h-10 border-t-2 border-white rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            <div className="flex-grow w-full">
              {profile&& (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-gray-200">
                    <h3 className="text-sm uppercase text-gray-500 font-semibold tracking-wider">Full Name</h3>
                    <p className="font-bold text-xl mt-1">{profile.name}</p>
                  </div>
                  <div className="pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-gray-200">
                    <h3 className="text-sm uppercase text-gray-500 font-semibold tracking-wider">Student ID</h3>
                    <p className="font-bold text-xl mt-1">{profile.studentId}</p>
                  </div>
                  <div className="pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-gray-200">
                    <h3 className="text-sm uppercase text-gray-500 font-semibold tracking-wider">Email</h3>
                    <p className="font-bold text-xl mt-1 truncate" title={profile.email}>{profile.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm uppercase text-gray-500 font-semibold tracking-wider">Pathway</h3>
                    <p className="font-bold text-xl mt-1">{profile.pathway}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Cards Section */}
          <div className="grid gap-6 sm:grid-cols-2 mb-8">
            {otherInfos.map((otherInfo, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="p-6">
                  <div className="flex items-center gap-5">
                    <div className="bg-gradient-to-r from-red-100 to-red-200 rounded-full w-16 h-16 flex items-center justify-center">
                      <img src={otherInfo.icon} alt={otherInfo.name} className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">{otherInfo.name}</h3>
                      <p className={
                        otherInfo.data === 0 ? "text-red-500 font-bold text-xl" :
                        otherInfo.data === 1 ? "text-green-500 font-bold text-xl" :
                        "text-gray-800 font-bold text-2xl"
                      }>
                        {otherInfo.data === 0 ? "Not yet" :
                         otherInfo.data === 1 ? "Completed" :
                         otherInfo.data}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Deadlines Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-5">
              <h1 className="text-xl font-bold text-white">Upcoming Deadlines</h1>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {currentDeadlines.map((el) => (
                  <div key={el.id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <h1 className="flex justify-start items-center gap-2 font-medium">
                      <span className="block rounded-full bg-red-500 w-2 h-2"></span>
                      {el.name}
                    </h1>
                    <p className="text-gray-600 font-medium">{el.deadline}</p>
                  </div>
                ))}
              </div>
              
              {/* Pagination for Upcoming Deadlines */}
              {deadlinesTotalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center gap-1">
                    <button
                      onClick={() => handleDeadlinesPageChange(deadlinesCurrentPage - 1)}
                      disabled={deadlinesCurrentPage === 1}
                      className={`px-3 py-1 rounded-md ${
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
                          className={`w-8 h-8 rounded-full ${
                            deadlinesCurrentPage === pageNumber
                              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
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
                      className={`px-3 py-1 rounded-md ${
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

          {/* Certificate Upload Section */}
          <div className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faCertificate} />
                Credit Exemption Certificate
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-5">Upload your previous certificates for credit exemption consideration.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <input
                  type="file"
                  ref={certificateInputRef}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleCertificateChange}
                />
                
                <button
                  onClick={handleCertificateClick}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 shadow-md"
                  disabled={isUploadingCertificate}
                >
                  <FontAwesomeIcon icon={faUpload} />
                  {certificateFile ? "File Selected" : "Choose Certificate File"}
                </button>
                
                {certificateFile && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-700 truncate max-w-xs bg-gray-100 px-3 py-1 rounded-md">{certificateFile.name}</span>
                    <button
                      onClick={handleCertificateUpload}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md"
                      disabled={isUploadingCertificate}
                    >
                      {isUploadingCertificate ? "Uploading..." : "Upload Certificate"}
                    </button>
                  </div>
                )}
                
                {!certificateFile && (
                  <span className="text-sm text-gray-500 italic">No file chosen</span>
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