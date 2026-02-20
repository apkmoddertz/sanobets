import React from 'react';
import { User, CreditCard, LogOut, Send, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AccountProps {
  onOpenPremium: () => void;
  onNavigate: (view: 'free' | 'safe' | 'fixed' | 'account' | 'members' | 'users') => void;
}

export default function Account({ onOpenPremium, onNavigate }: AccountProps) {
  const { user, userProfile, signOut, isAdmin, toggleAdminMode, isAdminMode } = useAuth();
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <User size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium">Please log in to view your account</p>
      </div>
    );
  }

  const formatDate = (isoString: string | null | undefined) => {
    if (!isoString) return 'No active subscription';
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="pb-24">
      <div className="bg-[#1a1b1e] rounded-xl p-6 border border-white/5 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-2xl font-bold text-black border-2 border-[#1a1b1e]">
          {user.email?.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user.displayName || 'User'}</h2>
          <p className="text-gray-400 text-sm">{user.email}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
            Verified Account
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="bg-[#1a1b1e] rounded-xl border border-white/5 p-4 mb-6">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <Calendar size={18} className="text-emerald-500" />
          Subscription Status
        </h3>
        <div className="bg-[#25262b] rounded-lg p-4 border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">Current Plan</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
              userProfile?.subscription === 'fixed' ? 'bg-purple-500/20 text-purple-500' :
              userProfile?.subscription === 'safe' ? 'bg-emerald-500/20 text-emerald-500' :
              'bg-blue-500/20 text-blue-500'
            }`}>
              {userProfile?.subscription || 'Free'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Expires On</span>
            <span className="text-white font-mono text-sm">
              {formatDate(userProfile?.expires)}
            </span>
          </div>
        </div>
      </div>

      {/* VIP Upgrade Banner or Admin Manage Users */}
      {isAdmin ? (
        <div 
          onClick={() => onNavigate('users')}
          className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-6 mb-6 relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-purple-500/30"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Manage Users</h3>
              <p className="text-purple-200 text-sm mb-3">Control subscriptions and access.</p>
              <div className="inline-flex items-center gap-2 bg-white text-purple-900 px-4 py-2 rounded-lg font-bold text-sm">
                <User size={16} />
                View Users
              </div>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User size={32} className="text-white" />
            </div>
          </div>
        </div>
      ) : (
        <div 
          onClick={onOpenPremium}
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-6 relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Upgrade to VIP</h3>
              <p className="text-blue-100 text-sm mb-3">Get access to Safe & Fixed matches.</p>
              <div className="inline-flex items-center gap-2 bg-white text-blue-900 px-4 py-2 rounded-lg font-bold text-sm">
                <Send size={16} />
                Upgrade Now
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <CreditCard size={32} className="text-white" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
      )}

      {isAdmin && (
        <div className="bg-[#1a1b1e] rounded-xl border border-white/5 p-4 mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold">Admin Mode</h3>
            <p className="text-gray-400 text-xs">Switch to admin dashboard</p>
          </div>
          <button 
            onClick={toggleAdminMode}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
              isAdminMode ? 'bg-emerald-500' : 'bg-gray-600'
            }`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
              isAdminMode ? 'left-7' : 'left-1'
            }`} />
          </button>
        </div>
      )}

      <div className="bg-[#1a1b1e] rounded-xl border border-white/5 overflow-hidden">
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-4 p-4 hover:bg-red-500/10 transition-colors text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <LogOut size={18} />
          </div>
          <span className="text-red-500 font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}
