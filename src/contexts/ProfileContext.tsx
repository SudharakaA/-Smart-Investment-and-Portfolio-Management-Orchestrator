import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  occupation: string;
  bio: string;
  joinDate: string;
  profileImage: string | null;
}

interface ProfileContextType {
  profileData: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
  updateProfileImage: (image: string | null) => void;
}

const defaultProfileData: ProfileData = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, USA",
  occupation: "Pro Investor",
  bio: "Experienced investor with a focus on tech stocks and cryptocurrency markets.",
  joinDate: "January 2024",
  profileImage: null,
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profileData, setProfileData] = useState<ProfileData>(() => {
    // Load from localStorage on initial render
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (error) {
        console.error('Failed to parse saved profile:', error);
        return defaultProfileData;
      }
    }
    return defaultProfileData;
  });

  // Save to localStorage whenever profileData changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profileData));
  }, [profileData]);

  const updateProfile = (data: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };

  const updateProfileImage = (image: string | null) => {
    setProfileData(prev => ({ ...prev, profileImage: image }));
  };

  return (
    <ProfileContext.Provider value={{ profileData, updateProfile, updateProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
