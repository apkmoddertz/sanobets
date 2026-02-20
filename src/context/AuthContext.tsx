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

  /**
   * 1️⃣ AUTH LISTENER (ONLY handles login state)
   * This will NEVER block UI.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // 🔥 Always stop loading immediately
    });

    return unsubscribe;
  }, []);

  /**
   * 2️⃣ FIRESTORE PROFILE SYNC (separate from auth)
   * This does NOT control loading.
   */
  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const syncUserProfile = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserProfile(userSnap.data() as UserProfile);
        } else {
          const newProfile: UserProfile = {
            email: user.email!,
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
      } catch (error) {
        console.error("Firestore sync error:", error);
      }
    };

    syncUserProfile();
  }, [user]);

  /**
   * 3️⃣ ADMIN CHECK
   */
  const isAdmin = user?.email === 'ngimbabetwin@gmail.com';

  useEffect(() => {
    if (isAdmin) {
      setIsAdminMode(true);
    } else {
      setIsAdminMode(false);
    }
  }, [isAdmin]);

  const toggleAdminMode = () => {
    if (isAdmin) {
      setIsAdminMode(prev => !prev);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setIsAdminMode(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAdmin,
        isAdminMode,
        toggleAdminMode,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
