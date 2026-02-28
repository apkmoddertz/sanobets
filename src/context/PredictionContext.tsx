import React, { createContext, useContext, useState, useEffect } from 'react';
import { Prediction } from '../types';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface PredictionContextType {
  predictions: Prediction[];
  loading: boolean;
}

const PredictionContext = createContext<PredictionContextType>({} as PredictionContextType);

export const usePredictions = () => useContext(PredictionContext);

export const PredictionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "matches"),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const matches = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Helper to capitalize first letter and trim
        const formatCategory = (s: string) => {
          if (!s) return 'Free';
          const trimmed = s.trim().toLowerCase();
          return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        };

        const formatStatus = (s: string) => {
          if (!s) return 'Pending';
          const trimmed = s.trim().toLowerCase();
          return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        };

        return {
          id: doc.id,
          league: data.league || 'Unknown League',
          homeTeam: data.homeTeam || 'Home Team',
          awayTeam: data.awayTeam || 'Away Team',
          startTime: data.date || new Date().toISOString(),
          prediction: data.prediction || 'Pending',
          odds: parseFloat(data.odd || data.odds || '1.0'),
          category: formatCategory(data.category) as any,
          status: formatStatus(data.status) as any,
          analysis: data.analysis,
          result: data.result
        } as Prediction;
      });
      console.log("Fetched matches:", matches); // Debug log
      setPredictions(matches);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching predictions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]); // Re-fetch when user changes (login/logout)

  return (
    <PredictionContext.Provider value={{ predictions, loading }}>
      {children}
    </PredictionContext.Provider>
  );
};
