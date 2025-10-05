import React, { createContext, useContext, useState } from 'react';
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

  const updateProfileImage = (imageUrl) => {
    // Add timestamp to prevent browser caching
    setProfileImage(`${imageUrl}?t=${new Date().getTime()}`);
  };

  const value = {
    profileImage,
    updateProfileImage
  };

  return (
    <ProfileImageContext.Provider value={value}>
      {children}
    </ProfileImageContext.Provider>
  );
};