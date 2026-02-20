import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserProfile {
  email: string;
  subscription: 'free' | 'safe' | 'fixed';
  billing: 'weekly' | 'monthly' | null;
  status: 'active' | 'inactive';
  expires: string | null;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserProfile(userSnap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              email: currentUser.email!,
              subscription: "free",
              billing: null,
              status: "active",
              expires: null
            };
            await setDoc(userRef, {
              ...newProfile,
              createdAt: new Date().toISOString()
            });
            setUserProfile(newProfile);
          }
        } catch (error: any) {
          console.error("Error syncing user to Firestore:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email === 'ngimbabetwin@gmail.com';

  useEffect(() => {
    setIsAdminMode(isAdmin);
  }, [isAdmin]);

  const toggleAdminMode = () => {
    if (isAdmin) {
      setIsAdminMode(!isAdminMode);
    }
  };

  const signOut = async () => {
  // Immediately reset all user-related state
  setUserProfile(null);
  setIsAdminMode(false);
  setUser(null);

  // Then call Firebase sign out
  await firebaseSignOut(auth);
};

  // App is still loading if auth is loading OR user exists but profile hasn't loaded yet
  const isAppLoading = loading || (user && !userProfile);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isAdmin, isAdminMode, toggleAdminMode, signOut }}>
      {isAppLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#141517]">
          <svg className="animate-spin text-emerald-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
