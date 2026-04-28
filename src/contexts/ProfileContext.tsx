import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useAuth } from "@/contexts/AuthContext";

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
  name: "Guest User",
  email: "guest@investx.local",
  phone: "+1 (555) 123-4567",
  location: "New York, USA",
  occupation: "Pro Investor",
  bio: "Experienced investor with a focus on tech stocks and cryptocurrency markets.",
  joinDate: "January 2024",
  profileImage: null,
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const formatJoinDate = (createdAt?: string): string => {
  if (!createdAt) return "January 2024";
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return "January 2024";
  return parsed.toLocaleString("en-US", { month: "long", year: "numeric" });
};

const defaultProfileForUser = (username: string, createdAt?: string): ProfileData => ({
  name: username,
  email: `${username}@investx.local`,
  phone: "",
  location: "",
  occupation: "Investor",
  bio: "Investor profile created from account credentials.",
  joinDate: formatJoinDate(createdAt),
  profileImage: null,
});

const LEGACY_DEFAULT_NAMES = new Set(["", "Alex Morgan", "Guest User"]);
const LEGACY_DEFAULT_EMAILS = new Set([
  "",
  "alex.morgan@example.com",
  "alex@investx.com",
  "guest@investx.local",
]);

const normalizeProfileForUser = (
  username: string,
  createdAt: string | undefined,
  profile: ProfileData,
): ProfileData => {
  const normalizedName = profile.name?.trim() ?? "";
  const normalizedEmail = profile.email?.trim().toLowerCase() ?? "";

  return {
    ...profile,
    name: LEGACY_DEFAULT_NAMES.has(normalizedName) ? username : profile.name,
    email: LEGACY_DEFAULT_EMAILS.has(normalizedEmail) ? `${username}@investx.local` : profile.email,
    joinDate: formatJoinDate(createdAt),
  };
};

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const storageKey = useMemo(
    () => (user ? `userProfile:${user.id}:${user.username}` : null),
    [user],
  );

  useEffect(() => {
    if (!storageKey || !user) {
      setProfileData(defaultProfileData);
      return;
    }

    const savedProfile = localStorage.getItem(storageKey);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile) as ProfileData;
        setProfileData(normalizeProfileForUser(user.username, user.createdAt, parsed));
        return;
      } catch (error) {
        console.error("Failed to parse saved profile:", error);
      }
    }

    setProfileData(defaultProfileForUser(user.username, user.createdAt));
  }, [storageKey, user]);

  // Save per-user profile whenever profileData changes
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(profileData));
  }, [profileData, storageKey]);

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
