import React, { useState, useEffect } from 'react';
import { Search, Calendar, Check, X, User, Shield, Lock, Loader2, AlertCircle } from 'lucide-react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';

interface AppUser extends UserProfile {
  id: string;
}

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  const isAdmin = currentUser?.email === 'ngimbabetwin@gmail.com';

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const fetchedUsers: AppUser[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedUsers.push({
            id: doc.id,
            email: data.email,
            subscription: data.subscription || 'free',
            billing: data.billing || null,
            status: data.status || 'inactive',
            expires: data.expires || null,
            createdAt: data.createdAt
          } as AppUser);
        });
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateExpiry = (billing: 'weekly' | 'monthly') => {
    const now = new Date();
    const expiry = new Date(now);
    
    if (billing === 'weekly') {
      expiry.setDate(expiry.getDate() + 7);
    } else {
      expiry.setDate(expiry.getDate() + 30);
    }
    
    return expiry.toISOString();
  };

  const updateUser = async (userId: string, updates: Partial<AppUser>) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, updates);

      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, ...updates } : u
      ));
      
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const [planType, setPlanType] = useState<'safe' | 'fixed'>('safe');
  const [selectedDuration, setSelectedDuration] = useState<'weekly' | 'monthly'>('weekly');

  const handleActivatePlan = () => {
    if (!selectedUser) return;
    const expires = calculateExpiry(selectedDuration);
    updateUser(selectedUser.id, {
      subscription: planType,
      billing: selectedDuration,
      status: 'active',
      expires: expires
    });
  };

  const handleSetFree = (user: AppUser) => {
    updateUser(user.id, {
      subscription: 'free',
      billing: null,
      expires: null,
      status: 'active'
    });
  };

  const handleDeactivate = (user: AppUser) => {
    if (!confirm(`Are you sure you want to deactivate ${user.email}?`)) return;
    updateUser(user.id, {
      status: 'inactive'
    });
  };

  const formatDate = (isoString: string | null) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <AlertCircle size={48} className="mb-4 text-red-500 opacity-50" />
        <p className="text-lg font-medium text-red-400">Access Denied</p>
        <p className="text-sm">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-[#1a1b1e] p-6 rounded-xl border border-white/5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="text-emerald-500" />
          User Management
        </h2>
        <p className="text-gray-400 text-sm">Manage user subscriptions and access</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-emerald-500" size={32} />
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search users by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1b1e] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none transition-colors"
            />
          </div>

          <div className="bg-[#1a1b1e] rounded-xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#25262b] text-xs uppercase font-medium">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Billing</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Expires</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          user.subscription === 'fixed' ? 'bg-purple-500/20 text-purple-500' :
                          user.subscription === 'safe' ? 'bg-emerald-500/20 text-emerald-500' :
                          'bg-blue-500/20 text-blue-500'
                        }`}>
                          {user.subscription}
                        </span>
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {user.billing || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          user.status === 'active' ? 'bg-green-500/20 text-green-500' :
                          'bg-red-500/20 text-red-500'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono">
                        {formatDate(user.expires)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedUser(user)}
                            className="bg-[#25262b] hover:bg-[#2c2e33] text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 transition-colors"
                          >
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1a1b1e] rounded-xl border border-white/10 p-6 max-w-md w-full shadow-2xl scale-in-95 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Manage User</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="mb-6 bg-[#25262b] p-4 rounded-lg border border-white/5">
              <p className="text-sm text-gray-400 mb-1">Selected User</p>
              <p className="text-white font-bold text-lg">{selectedUser.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-300 uppercase">{selectedUser.subscription}</span>
                <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-300 uppercase">{selectedUser.status}</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Plan Type Toggle */}
              <div className="flex bg-[#25262b] p-1 rounded-lg border border-white/5">
                <button
                  onClick={() => setPlanType('safe')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all ${
                    planType === 'safe' 
                      ? 'bg-emerald-500 text-black shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Shield size={16} />
                  Safe Matches
                </button>
                <button
                  onClick={() => setPlanType('fixed')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all ${
                    planType === 'fixed' 
                      ? 'bg-purple-500 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Lock size={16} />
                  Fixed Matches
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setSelectedDuration('weekly')}
                  className={`border py-3 rounded-lg text-sm font-bold transition-colors flex flex-col items-center gap-1 ${
                    selectedDuration === 'weekly'
                      ? planType === 'safe'
                        ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500'
                        : 'bg-purple-500/20 text-purple-500 border-purple-500'
                      : 'bg-[#25262b] text-gray-400 border-white/5 hover:bg-[#2c2e33]'
                  }`}
                >
                  <Calendar size={16} />
                  Weekly Access
                </button>
                <button 
                  onClick={() => setSelectedDuration('monthly')}
                  className={`border py-3 rounded-lg text-sm font-bold transition-colors flex flex-col items-center gap-1 ${
                    selectedDuration === 'monthly'
                      ? planType === 'safe'
                        ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500'
                        : 'bg-purple-500/20 text-purple-500 border-purple-500'
                      : 'bg-[#25262b] text-gray-400 border-white/5 hover:bg-[#2c2e33]'
                  }`}
                >
                  <Calendar size={16} />
                  Monthly Access
                </button>
              </div>

              <button 
                onClick={handleActivatePlan}
                className={`w-full py-3 rounded-lg text-black font-bold transition-colors flex items-center justify-center gap-2 ${
                  planType === 'safe' ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-purple-500 hover:bg-purple-400'
                }`}
              >
                <Check size={18} />
                Activate {planType === 'safe' ? 'Safe' : 'Fixed'} {selectedDuration === 'weekly' ? 'Weekly' : 'Monthly'}
              </button>

              <div className="h-px bg-white/10 my-4"></div>

              <button 
                onClick={() => handleSetFree(selectedUser)}
                className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 py-3 rounded-lg text-sm font-bold transition-colors"
              >
                Back to Free
              </button>

              <button 
                onClick={() => handleDeactivate(selectedUser)}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-3 rounded-lg text-sm font-bold transition-colors"
              >
                Deactivate User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
