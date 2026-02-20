import React, { useState, useEffect } from 'react';
import { 
  collection, query, orderBy, onSnapshot, addDoc, 
  serverTimestamp, where, doc, setDoc, getDoc, updateDoc, deleteDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: any;
  createdBy: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastCheckTime, setLastCheckTime] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    // 1. Get user's last notification check time
    const fetchUserPrefs = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setLastCheckTime(userSnap.data().lastNotificationCheck);
        } else {
          // Create user doc if not exists
          await setDoc(userRef, {
            email: user.email,
            lastNotificationCheck: serverTimestamp() // Default to now so they don't see old ones immediately
          });
        }
      } catch (error) {
        console.log("Error fetching user prefs (likely offline):", error);
        // If offline, we can't fetch the last check time. 
        // We could default to 'now' to avoid showing all old notifications as new,
        // or default to 0 to show everything.
        // Let's default to now-ish so we don't spam them if they are offline.
        // Or actually, if we can't verify, maybe just don't show badges?
        // Let's set it to null and handle it gracefully.
      }
    };
    fetchUserPrefs();

    // 2. Subscribe to notifications
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notification));
      
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Calculate unread count based on lastCheckTime
  useEffect(() => {
    if (!lastCheckTime) {
        // If no check time, assume all are unread? Or none?
        // Let's assume none if it's the very first load before we fetch the time.
        // But if we just created the user doc with 'now', then 0.
        // If we fetched a time, we compare.
        return;
    }

    const unread = notifications.filter(n => {
        if (!n.createdAt) return false;
        // Compare timestamps. Firestore timestamps have .seconds
        const notifTime = n.createdAt.seconds || 0;
        const checkTime = lastCheckTime.seconds || 0;
        return notifTime > checkTime;
    });
    
    setUnreadCount(unread.length);
  }, [notifications, lastCheckTime]);

  const markAllAsRead = async () => {
    if (!user) return;
    
    // Update local state immediately to hide badge/list
    const now = new Date();
    
    // Update Firestore
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      lastNotificationCheck: serverTimestamp()
    });
    
    // We can optimistically update lastCheckTime to 'now' but serverTimestamp is better.
    // However, for the UI to clear immediately, we might want to wait for the snapshot update 
    // or manually set it.
    // Let's just rely on the snapshot update or force a re-fetch?
    // Actually, since we are using onSnapshot for the user doc? No, we only fetched it once.
    // We should probably listen to the user doc too or just update local state.
    
    // Let's update local state to a client-side timestamp that is definitely newer
    setLastCheckTime({ seconds: Math.floor(Date.now() / 1000) });
  };

  const sendNotification = async (title: string, message: string) => {
    if (!user) return;
    
    await addDoc(collection(db, 'notifications'), {
      title,
      message,
      createdAt: serverTimestamp(),
      createdBy: user.email
    });
  };

  const deleteNotification = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'notifications', id));
  };

  return {
    notifications,
    unreadCount,
    markAllAsRead,
    sendNotification,
    deleteNotification,
    // Filtered list for display (only new ones)
    newNotifications: notifications.filter(n => {
        // If notification is brand new (pending write), treat as new
        if (!n.createdAt) return true;
        // If we haven't checked yet, assume new? Or wait? 
        // Better to wait for lastCheckTime to load, but if it's missing, maybe show all?
        // Let's stick to showing if it's newer than check time.
        if (!lastCheckTime) return false;
        
        return n.createdAt.seconds > lastCheckTime.seconds;
    })
  };
};
