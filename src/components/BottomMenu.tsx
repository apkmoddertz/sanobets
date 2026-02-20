import React from 'react';
import { Trophy, Shield, Lock, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BottomMenuProps {
  currentView: 'free' | 'safe' | 'fixed' | 'account' | 'members';
  onNavigate: (view: 'free' | 'safe' | 'fixed' | 'account' | 'members') => void;
}

export default function BottomMenu({ currentView, onNavigate }: BottomMenuProps) {
  const { isAdminMode } = useAuth();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1b1e] border-t border-white/10 pb-safe z-50 lg:hidden">
      <div className="flex items-center justify-around h-16">
        <button 
          onClick={() => onNavigate('free')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center ${
            currentView === 'free' ? 'text-emerald-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Trophy size={20} />
          <span className="text-[10px] font-medium">Free</span>
        </button>

        <button 
          onClick={() => onNavigate('safe')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center ${
            currentView === 'safe' ? 'text-emerald-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Shield size={20} />
          <span className="text-[10px] font-medium">Safe</span>
        </button>

        <button 
          onClick={() => onNavigate('fixed')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center ${
            currentView === 'fixed' ? 'text-emerald-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Lock size={20} />
          <span className="text-[10px] font-medium">Fixed</span>
        </button>

        <button 
          onClick={() => onNavigate('members')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center ${
            currentView === 'members' ? 'text-emerald-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Users size={20} />
          <span className="text-[10px] font-medium">Members</span>
        </button>
      </div>
    </div>
  );
}
