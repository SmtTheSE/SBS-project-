import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultProfile from '../assets/profiles/profile.jpeg';

const ProfileImageContext = createContext();

export const useProfileImage = () => {
  const context = useContext(ProfileImageContext);
  if (!context) {
    throw new Error('useProfileImage must be used within a ProfileImageProvider');
  }
  return context;
};

export const ProfileImageProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Load user-specific profile image on mount and when user changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");
    
    // Reset to default when no user logged in
    if (!token || !accountId) {
      setProfileImage(defaultProfile);
      setCurrentUserId(null);
      return;
    }
    
    // Only update if user has changed
    if (accountId !== currentUserId) {
      setCurrentUserId(accountId);
      // Try to load user's profile image
      const savedProfileImage = localStorage.getItem(`profileImage_${accountId}`);
      if (savedProfileImage) {
        setProfileImage(savedProfileImage);
      } else {
        setProfileImage(defaultProfile);
      }
    }
  }, [currentUserId]);

  const updateProfileImage = (imageUrl) => {
    const accountId = localStorage.getItem("accountId");
    if (accountId) {
      // Add timestamp to prevent browser caching
      const imageUrlWithTimestamp = `${imageUrl}?t=${new Date().getTime()}`;
      setProfileImage(imageUrlWithTimestamp);
      // Save to localStorage for this specific user
      localStorage.setItem(`profileImage_${accountId}`, imageUrlWithTimestamp);
      setCurrentUserId(accountId);
    }
  };

  // Clear profile image cache for a specific user
  const clearProfileImageCache = (accountId) => {
    if (accountId) {
      localStorage.removeItem(`profileImage_${accountId}`);
    }
  };

  // Clear all profile image caches
  const clearAllProfileImageCaches = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('profileImage_')) {
        localStorage.removeItem(key);
      }
    });
  };

  const value = {
    profileImage,
    updateProfileImage,
    clearProfileImageCache,
    clearAllProfileImageCaches
  };

  return (
    <ProfileImageContext.Provider value={value}>
      {children}
    </ProfileImageContext.Provider>
  );
};