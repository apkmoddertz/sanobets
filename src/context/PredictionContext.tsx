import React, { createContext, useContext, useState } from 'react';
import { Prediction } from '../types';
import { MOCK_PREDICTIONS } from '../data/mockPredictions';

interface PredictionContextType {
  predictions: Prediction[];
  addPrediction: (prediction: Prediction) => void;
  updatePrediction: (prediction: Prediction) => void;
  deletePrediction: (id: string) => void;
  loading: boolean;
}

const PredictionContext = createContext<PredictionContextType>({} as PredictionContextType);

export const usePredictions = () => useContext(PredictionContext);

export const PredictionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with MOCK_PREDICTIONS
  const [predictions, setPredictions] = useState<Prediction[]>(MOCK_PREDICTIONS);
  const [loading, setLoading] = useState(false);

  const addPrediction = (prediction: Prediction) => {
    setPredictions(prev => [prediction, ...prev]);
  };

  const updatePrediction = (updatedPrediction: Prediction) => {
    setPredictions(prev => prev.map(p => p.id === updatedPrediction.id ? updatedPrediction : p));
  };

  const deletePrediction = (id: string) => {
    setPredictions(prev => prev.filter(p => p.id !== id));
  };

  return (
    <PredictionContext.Provider value={{ predictions, addPrediction, updatePrediction, deletePrediction, loading }}>
      {children}
    </PredictionContext.Provider>
  );
};
