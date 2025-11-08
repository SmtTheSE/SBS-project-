import React, { useState, useEffect } from "react";
import sbsLogo from "../assets/images/sbs-logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faEnvelope,
  faUserCircle,
  faFileAlt,
} from "@fortawesome/free-regular-svg-icons";
import {
  faAngleDown,
  faSignOutAlt,
  faCheckCircle,
  faPassport,
  faUser,
  faKey,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

import axiosInstance from "../utils/axiosInstance";
import { useProfileImage } from "../utils/profileImageContext";
import useAdminSideBar from "../Hook/useAdminSideBar";

const Navigation = () => {
  const [pendingVisaRequestsCount, setPendingVisaRequestsCount] = useState(0);
  const [pendingTranscriptRequestsCount, setPendingTranscriptRequestsCount] =
    useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showVisaMessage, setShowVisaMessage] = useState(false);
  const [visaRequestStatus, setVisaRequestStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { profileImage, clearAllProfileImageCaches } = useProfileImage();
  // Check if user is a guest
  const isGuest = localStorage.getItem("isGuest") === "true";

  // Fetch pending requests for admin
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        // Check if user is admin by checking if a specific admin route is accessible
        const visaResponse = await axiosInstance.get(
          "/admin/visa-extension-requests/pending"
        );

        // For transcript requests, we need to get all and filter pending ones
        const transcriptResponse = await axiosInstance.get(
          "/academic/transcript-requests/all"
        );

        if (Array.isArray(visaResponse.data)) {
          setPendingVisaRequestsCount(visaResponse.data.length);
        }

        // Filter pending transcript requests (assuming status field exists)
        if (
          transcriptResponse.data.success &&
          Array.isArray(transcriptResponse.data.data)
        ) {
          const pendingTranscripts = transcriptResponse.data.data.filter(
            (request) => request.requestStatus === "Pending"
          );
          setPendingTranscriptRequestsCount(pendingTranscripts.length);
        }
      } catch (error) {
        // If the user is not an admin, this request will fail
        // We don't need to do anything special here
        console.log("Not an admin or error fetching pending requests");
      }
    };

    // Only fetch pending requests for non-guest users
    if (!isGuest) {
      fetchPendingRequests();

      // Set up polling every 30 seconds
      const interval = setInterval(fetchPendingRequests, 30000);

      // Clean up interval on component unmount
      return () => clearInterval(interval);
    }
  }, [isGuest]);

  // Fetch student visa request status
  useEffect(() => {
    const fetchStudentVisaRequestStatus = async () => {
      if (!isUserLoggedIn() || isUserAdmin() || isGuest) return;

      try {
        // Fetch student's visa request status
        const studentId = localStorage.getItem("accountId");
        if (studentId) {
          const visaResponse = await axiosInstance.get(
            `/admin/visa-extension-requests/student/${studentId}`
          );
          if (
            visaResponse.data &&
            Array.isArray(visaResponse.data) &&
            visaResponse.data.length > 0
          ) {
            // Get the latest request (assuming it's the first one or the one with the latest date)
            const latestRequest = visaResponse.data.reduce(
              (latest, current) => {
                if (!latest) return current;
                const latestDate = new Date(latest.requestDate || 0);
                const currentDate = new Date(current.requestDate || 0);
                return currentDate > latestDate ? current : latest;
              },
              null
            );

            if (latestRequest) {
              setVisaRequestStatus(latestRequest);
            }
          }
        }
      } catch (error) {
        console.log("Error fetching student visa request status");
      }
    };

    // Only fetch visa status for non-guest users
    if (!isGuest) {
      fetchStudentVisaRequestStatus();

      // Set up polling every 30 seconds for student visa status
      const interval = setInterval(fetchStudentVisaRequestStatus, 30000);

      // Clean up interval on component unmount
      return () => clearInterval(interval);
    }
  }, [isGuest]);

  const getNotificationBadge = (count) => {
    if (count === 0) return null;

    let displayCount = count;
    if (count > 99) {
      displayCount = "99+";
    }

    return (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {displayCount}
      </span>
    );
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("accountId");
    localStorage.removeItem("isGuest");

    // Clear all profile image caches on logout
    clearAllProfileImageCaches();

    // Reset state
    setPendingVisaRequestsCount(0);
    setPendingTranscriptRequestsCount(0);
    setVisaRequestStatus(null);

    // Redirect to login page
    navigate("/login");
  };

  const isUserLoggedIn = () => {
    return localStorage.getItem("token") !== null;
  };

  const isUserAdmin = () => {
    return localStorage.getItem("role") === "admin";
  };

  const handleVisaIconClick = () => {
    if (!isUserAdmin()) {
      if (visaRequestStatus) {
        setShowVisaMessage(!showVisaMessage);
      }
    }
  };

  const handleViewProfile = () => {
    navigate("/profile");
    setShowProfileMenu(false);
  };

  const handleChangePassword = () => {
    navigate("/change-password");
    setShowProfileMenu(false);
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from { transform: translateY(-10px) scale(0.95); }
            to { transform: translateY(0) scale(1); }
          }
        `}
      </style>
      <nav className="xs:h-15 md:h-20 lg:h-30 z-10 flex left-0 top-0 justify-between items-center px-10 py-3 bg-white fixed w-full shadow-sm">
        <img src={sbsLogo} alt="SBS Logo" className="xs:w-20 md:w-30 lg:w-50" />
        <div className="flex justify-between items-center gap-5">
          {isUserLoggedIn() && !isGuest && (
            <>
              <div className="relative">
                <FontAwesomeIcon
                  icon={isUserAdmin() ? faPassport : faCheckCircle}
                  className="text-4xl cursor-pointer"
                  onClick={handleVisaIconClick}
                />
                {isUserAdmin()
                  ? getNotificationBadge(pendingVisaRequestsCount)
                  : visaRequestStatus && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        1
                      </span>
                    )}

                {!isUserAdmin() && showVisaMessage && visaRequestStatus && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-20 border">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      {visaRequestStatus.status === 1
                        ? "Your Visa Extension Request is approved and will send to you soon"
                        : `Your Visa Extension Request status: ${
                            visaRequestStatus.status === 0
                              ? "Pending"
                              : "Rejected"
                          }`}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {!isGuest && (
            <div className="relative">
              <div
                className="flex justify-between items-center gap-3 cursor-pointer group"
                onClick={() =>
                  isUserLoggedIn() && setShowProfileMenu(!showProfileMenu)
                }
              >
                <div className="w-12 h-12 overflow-hidden rounded-full flex items-center justify-center ring-2 ring-gray-200 group-hover:ring-blue-400 transition-all duration-300 ease-in-out">
                  {isUserAdmin() ? (
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="text-3xl text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
                    />
                  ) : (
                    <img
                      src={profileImage}
                      alt="Profile pic"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`text-2xl text-gray-500 group-hover:text-blue-500 transition-all duration-300 ease-in-out ${
                    showProfileMenu ? "transform rotate-180" : ""
                  }`}
                />
              </div>

              {showProfileMenu && isUserLoggedIn() && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-20 border border-gray-100 transform transition-all duration-300 ease-out origin-top-right scale-100 opacity-100"
                  style={{
                    animation: "fadeIn 0.3s ease-out, slideIn 0.3s ease-out",
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      Account Options
                    </p>
                  </div>
                  {!isUserAdmin() && (
                    <button
                      onClick={handleViewProfile}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 ease-in-out"
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className="mr-3 text-blue-500"
                      />
                      <span>View Profile</span>
                    </button>
                  )}
                  <button
                    onClick={handleChangePassword}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 ease-in-out"
                  >
                    <FontAwesomeIcon
                      icon={faKey}
                      className="mr-3 text-blue-500"
                    />
                    <span>Change Password</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200 ease-in-out"
                  >
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="mr-3 text-red-500"
                    />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      <div className="xs:h-15 md:h-20 lg:h-30"></div>
    </>
  );
};

export default Navigation;
