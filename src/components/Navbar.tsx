import React, { useState } from 'react';
import { Wallet, Menu, User as UserIcon, LogIn, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenWallet: () => void;
  balance: number;
  onNavigateHome: () => void;
  onNavigate: (view: 'free' | 'safe' | 'fixed' | 'account' | 'members' | 'users') => void;
}

export default function Navbar({ onToggleSidebar, onOpenWallet, balance, onNavigateHome, onNavigate }: NavbarProps) {
  const { user, isAdmin, isAdminMode, toggleAdminMode } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-[#1a1b1e] border-b border-white/10 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onToggleSidebar}
              className="p-2 hover:bg-white/5 rounded-lg text-gray-400 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <button 
              onClick={onNavigateHome}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
            >
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                S
              </div>
              <span className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">Sano Bet</span>
              {isAdminMode && (
                <span className="bg-red-500/20 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-wider ml-2">
                  Admin
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://t.me/betsano" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#24A1DE] flex items-center justify-center text-white hover:bg-[#208bbf] transition-colors shadow-[0_0_10px_rgba(36,161,222,0.3)] hover:scale-105 transform"
            >
              <Send size={16} className="-ml-0.5 mt-0.5" />
            </a>

            {user ? (
              <>
                <button 
                  onClick={onOpenWallet}
                  className="hidden md:flex items-center gap-2 bg-[#25262b] px-3 py-1.5 rounded-full border border-white/5 hover:bg-[#2c2e33] transition-colors"
                >
                  <Wallet size={16} className="text-emerald-500" />
                  <span className="text-sm font-medium text-white">${balance.toFixed(2)}</span>
                </button>
                
                {isAdmin && (
                  <div className="hidden md:flex items-center gap-2">
                    <span className="text-xs text-gray-500">Admin Mode</span>
                    <button 
                      onClick={toggleAdminMode}
                      className={`w-10 h-5 rounded-full relative transition-colors ${
                        isAdminMode ? 'bg-emerald-500' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${
                        isAdminMode ? 'left-6' : 'left-1'
                      }`} />
                    </button>
                  </div>
                )}

                <button 
                  onClick={() => onNavigate('account')}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 border-2 border-[#1a1b1e] cursor-pointer flex items-center justify-center text-black font-bold text-xs hover:scale-105 transition-transform"
                >
                  {user.email?.substring(0, 2).toUpperCase()}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-gray-300 hover:text-white text-sm font-medium hidden sm:block"
                >
                  Log In
                </button>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                >
                  <LogIn size={16} />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
