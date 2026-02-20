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

  const ADMIN_EMAIL = 'ngimbabetwin@gmail.com';
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Sync user to Firestore if not exists
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
          // Ignore offline errors as they are expected in some environments
          if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
             console.log("Firestore sync skipped (offline)");
          } else {
             console.error("Error syncing user to Firestore:", error);
          }
        }
      } else {
        // User logged out
        setUserProfile(null);
        setIsAdminMode(false);
      }

      if (currentUser?.email === ADMIN_EMAIL) {
        setIsAdminMode(true);
      } else {
        setIsAdminMode(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleAdminMode = () => {
    if (isAdmin) {
      setIsAdminMode(!isAdminMode);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setIsAdminMode(false);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isAdmin, isAdminMode, toggleAdminMode, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
