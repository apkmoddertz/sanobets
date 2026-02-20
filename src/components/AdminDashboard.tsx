import React, { useState, useEffect } from 'react';
import { Prediction } from '../types';
import { Plus, Edit2, Trash2, Save, X, Filter, Database, Loader2 } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface AdminDashboardProps {
  currentView: 'free' | 'safe' | 'fixed' | 'account';
  onNavigate: (view: 'free' | 'safe' | 'fixed' | 'account') => void;
}

export default function AdminDashboard({ currentView }: AdminDashboardProps) {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Prediction>>({});
  
  const [isAdding, setIsAdding] = useState(false);
  const [newPrediction, setNewPrediction] = useState<Partial<Prediction>>({
    category: 'Free',
    status: 'Pending',
    odds: 1.50
  });

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "matches"),
      orderBy("date", "desc") // Updated to use 'date'
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const matches = snapshot.docs.map(doc => {
        const data = doc.data();
        // Helper to capitalize first letter
        const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';

        return {
          id: doc.id,
          league: data.league || 'Unknown League',
          homeTeam: data.homeTeam || 'Home Team',
          awayTeam: data.awayTeam || 'Away Team',
          startTime: data.date || new Date().toISOString(), // Map 'date' to 'startTime'
          prediction: data.prediction || 'Pending',
          odds: parseFloat(data.odd || data.odds || '1.0'), // Map 'odd' (string) to 'odds' (number)
          category: (capitalize(data.category) as any) || 'Free', // Map 'free' to 'Free'
          status: (capitalize(data.status) as any) || 'Pending', // Map 'pending' to 'Pending'
          analysis: data.analysis,
          result: data.result
        } as Prediction;
      });
      setPredictions(matches);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching matches:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleEdit = (pred: Prediction) => {
    setIsEditing(pred.id);
    setEditForm(pred);
  };

  const handleSave = async () => {
    if (!isEditing) return;
    
    try {
      const matchRef = doc(db, "matches", isEditing);
      await updateDoc(matchRef, {
        prediction: editForm.prediction,
        odd: editForm.odds?.toString() || "1.0", // Map 'odds' back to 'odd' (string)
        category: editForm.category?.toLowerCase(), // Lowercase
        status: editForm.status?.toLowerCase() // Lowercase
      });
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating match:", error);
      alert("Failed to update match");
    }
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteDoc(doc(db, "matches", deleteId));
        setDeleteId(null);
      } catch (error) {
        console.error("Error deleting match:", error);
        alert("Failed to delete match");
      }
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleAdd = async () => {
    if (!newPrediction.homeTeam || !newPrediction.awayTeam || !newPrediction.prediction || !newPrediction.startTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await addDoc(collection(db, "matches"), {
        league: newPrediction.league || 'Unknown League',
        homeTeam: newPrediction.homeTeam,
        awayTeam: newPrediction.awayTeam,
        date: newPrediction.startTime, // Map 'startTime' back to 'date'
        prediction: newPrediction.prediction,
        odd: newPrediction.odds?.toString() || "1.0", // Map 'odds' back to 'odd' (string)
        category: newPrediction.category?.toLowerCase() || 'free', // Lowercase
        status: newPrediction.status?.toLowerCase() || 'pending', // Lowercase
        createdBy: user?.email,
        createdAt: serverTimestamp()
      });

      setIsAdding(false);
      setNewPrediction({ category: 'Free', status: 'Pending', odds: 1.50 });
    } catch (error) {
      console.error("Error adding match:", error);
      alert("Failed to add match");
    }
  };

  // Filter predictions based on the selected tab (currentView)
  const filteredPredictions = predictions.filter(p => {
    if (currentView === 'free') return p.category === 'Free';
    if (currentView === 'safe') return p.category === 'Safe';
    if (currentView === 'fixed') return p.category === 'Fixed';
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1a1b1e] p-6 rounded-xl border border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Admin Dashboard
            <span className="text-xs font-normal bg-[#25262b] px-2 py-1 rounded text-gray-400 border border-white/5 capitalize">
              {currentView} Predictions
            </span>
          </h2>
          <p className="text-gray-400 text-sm">Manage {currentView} predictions and content</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Add Prediction
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-[#1a1b1e] p-6 rounded-xl border border-emerald-500/30 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">New Prediction</h3>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input 
              placeholder="League (e.g. Premier League)"
              className="bg-[#25262b] border border-white/10 rounded-lg px-4 py-2 text-white"
              value={newPrediction.league || ''}
              onChange={e => setNewPrediction({...newPrediction, league: e.target.value})}
            />
            <input 
              placeholder="Home Team"
              className="bg-[#25262b] border border-white/10 rounded-lg px-4 py-2 text-white"
              value={newPrediction.homeTeam || ''}
              onChange={e => setNewPrediction({...newPrediction, homeTeam: e.target.value})}
            />
            <input 
              placeholder="Away Team"
              className="bg-[#25262b] border border-white/10 rounded-lg px-4 py-2 text-white"
              value={newPrediction.awayTeam || ''}
              onChange={e => setNewPrediction({...newPrediction, awayTeam: e.target.value})}
            />
            <input 
              type="datetime-local"
              className="bg-[#25262b] border border-white/10 rounded-lg px-4 py-2 text-white"
              onChange={e => setNewPrediction({...newPrediction, startTime: e.target.value})}
            />
            <input 
              placeholder="Prediction (e.g. Home Win)"
              className="bg-[#25262b] border border-white/10 rounded-lg px-4 py-2 text-white"
              value={newPrediction.prediction || ''}
              onChange={e => setNewPrediction({...newPrediction, prediction: e.target.value})}
            />
            <input 
              type="number"
              placeholder="Odds"
              className="bg-[#25262b] border border-white/10 rounded-lg px-4 py-2 text-white"
              value={newPrediction.odds}
              onChange={e => setNewPrediction({...newPrediction, odds: parseFloat(e.target.value)})}
            />
            <select
              className="bg-[#25262b] border border-white/10 rounded-lg px-4 py-2 text-white"
              value={newPrediction.category}
              onChange={e => setNewPrediction({...newPrediction, category: e.target.value as any})}
            >
              <option value="Free">Free</option>
              <option value="Safe">Safe</option>
              <option value="Fixed">Fixed</option>
            </select>
            <select
              className="bg-[#25262b] border border-white/10 rounded-lg px-4 py-2 text-white"
              value={newPrediction.status}
              onChange={e => setNewPrediction({...newPrediction, status: e.target.value as any})}
            >
              <option value="Pending">Pending</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <button 
            onClick={handleAdd}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 rounded-lg"
          >
            Save Prediction
          </button>
        </div>
      )}

      <div className="bg-[#1a1b1e] rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#25262b] text-xs uppercase font-medium">
              <tr>
                <th className="px-4 py-3">Match</th>
                <th className="px-4 py-3">Prediction</th>
                <th className="px-4 py-3">Odds</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPredictions.length > 0 ? (
                filteredPredictions.map(pred => (
                  <tr key={pred.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{pred.homeTeam} vs {pred.awayTeam}</div>
                      <div className="text-xs text-gray-500">{pred.league}</div>
                      <div className="text-xs text-gray-600">{new Date(pred.startTime).toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      {isEditing === pred.id ? (
                        <input 
                          value={editForm.prediction} 
                          onChange={e => setEditForm({...editForm, prediction: e.target.value})}
                          className="bg-[#25262b] border border-white/10 rounded px-2 py-1 text-white w-full focus:border-emerald-500 outline-none"
                        />
                      ) : (
                        <span className="text-emerald-400 font-bold">{pred.prediction}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {isEditing === pred.id ? (
                        <input 
                          type="number"
                          value={editForm.odds} 
                          onChange={e => setEditForm({...editForm, odds: parseFloat(e.target.value)})}
                          className="bg-[#25262b] border border-white/10 rounded px-2 py-1 text-white w-20 focus:border-emerald-500 outline-none"
                        />
                      ) : pred.odds.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing === pred.id ? (
                        <select
                          value={editForm.category}
                          onChange={e => setEditForm({...editForm, category: e.target.value as any})}
                          className="bg-[#25262b] border border-white/10 rounded px-2 py-1 text-white focus:border-emerald-500 outline-none"
                        >
                          <option value="Free">Free</option>
                          <option value="Safe">Safe</option>
                          <option value="Fixed">Fixed</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          pred.category === 'Free' ? 'bg-blue-500/20 text-blue-500' :
                          pred.category === 'Safe' ? 'bg-emerald-500/20 text-emerald-500' :
                          'bg-purple-500/20 text-purple-500'
                        }`}>
                          {pred.category}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing === pred.id ? (
                        <select
                          value={editForm.status}
                          onChange={e => setEditForm({...editForm, status: e.target.value as any})}
                          className="bg-[#25262b] border border-white/10 rounded px-2 py-1 text-white focus:border-emerald-500 outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Won">Won</option>
                          <option value="Lost">Lost</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          pred.status === 'Won' ? 'bg-emerald-500/20 text-emerald-500' :
                          pred.status === 'Lost' ? 'bg-red-500/20 text-red-500' :
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {pred.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isEditing === pred.id ? (
                          <>
                            <button onClick={handleSave} className="p-1.5 bg-emerald-500/20 text-emerald-500 rounded hover:bg-emerald-500/30 transition-colors">
                              <Save size={16} />
                            </button>
                            <button onClick={() => setIsEditing(null)} className="p-1.5 bg-gray-500/20 text-gray-400 rounded hover:bg-gray-500/30 transition-colors">
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(pred)} className="p-1.5 bg-blue-500/20 text-blue-500 rounded hover:bg-blue-500/30 transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(pred.id)} className="p-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Filter size={24} className="opacity-50" />
                      <p>No {currentView} predictions found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {deleteId && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1a1b1e] rounded-xl border border-white/10 p-6 max-w-sm w-full shadow-2xl scale-in-95 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-2">Delete Prediction?</h3>
            <p className="text-gray-400 mb-6">This action cannot be undone. Are you sure you want to remove this match?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-[#25262b] hover:bg-[#2c2e33] text-white font-bold py-2.5 rounded-lg transition-colors border border-white/5"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-lg transition-colors shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
