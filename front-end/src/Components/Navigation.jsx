import React, { useState, useEffect } from "react";
import sbsLogo from "../assets/images/sbs-logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faAngleDown, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

import defaultProfile from "../assets/profiles/profile.jpeg";
import axiosInstance from "../utils/axiosInstance";
import { useProfileImage } from "../utils/profileImageContext";

const Navigation = () => {
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { profileImage } = useProfileImage();

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        //Check if user is admin by checking if a specific admin route is accessible
        const response = await axiosInstance.get('/admin/visa-extension-requests/pending');
        if(Array.isArray(response.data)) {
          setPendingRequestsCount(response.data.length);
        }
      } catch (error) {
        // If the user is not an admin, this request will fail
        // We don't need to do anything special here
        console.log('Not an admin or error fetching pending requests');
      }
    };

    fetchPendingRequests();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchPendingRequests, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const getNotificationBadge = () => {
    if (pendingRequestsCount === 0) return null;
    
    let displayCount = pendingRequestsCount;
    if (pendingRequestsCount > 99) {
      displayCount = '99+';
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
    
    // Redirect to login page
    navigate("/login");
  };

  const isUserLoggedIn = () => {
    return localStorage.getItem("token") !== null;
  };

  const isUserAdmin = () => {
    return localStorage.getItem("role") === "admin";
  };

  return (
    <>
      <nav className="z-10 flex left-0 top-0 justify-between items-center px-10 py-3 bg-white fixed w-full">
        <img src={sbsLogo} alt="SBS Logo" />
        <div className="flex justify-between items-center gap-5">
          {isUserLoggedIn() && (
            <>
              <FontAwesomeIcon icon={faEnvelope} className="text-4xl" />
              <div className="relative">
                <FontAwesomeIcon icon={faBell} className="text-4xl" />
                {getNotificationBadge()}
              </div>
            </>
          )}
          <div className="relative">
            <div 
              className="flex justify-between items-center gap-3 cursor-pointer"
              onClick={() => isUserLoggedIn() && setShowProfileMenu(!showProfileMenu)}
            >
              <div className="w-12 h-12 overflow-hidden rounded-full">
                <img
                 src={profileImage}
                  alt="Profile pic"
                  className="w-full h-full object-cover"
                />
              </div>
              <FontAwesomeIcon icon={faAngleDown} className="text-2xl" />
            </div>
            
            {showProfileMenu && isUserLoggedIn() && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <br /><br /><br /><br/>
    </>
  );
};

export default Navigation;