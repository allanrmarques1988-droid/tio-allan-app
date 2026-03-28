import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>({
    uid: 'mock-user-id',
    email: 'allanrmarques1988@gmail.com',
    displayName: 'Tio Allan',
  });
  const [profile, setProfile] = useState<UserProfile | null>({
    uid: 'mock-user-id',
    email: 'allanrmarques1988@gmail.com',
    displayName: 'Tio Allan',
    role: 'admin',
    createdAt: new Date(),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mocking the auth state change
    setLoading(false);
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
