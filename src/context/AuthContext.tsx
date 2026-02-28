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
      
      // Set admin mode immediately if it's the admin
      if (currentUser?.email === 'ngimbabetwin@gmail.com') {
        setIsAdminMode(true);
      } else {
        setIsAdminMode(false);
      }

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

  const toggleAdminMode = () => {
    if (isAdmin) {
      setIsAdminMode(!isAdminMode);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setIsAdminMode(false);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isAdmin, isAdminMode, toggleAdminMode, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
