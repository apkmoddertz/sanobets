import React from 'react';
import { 
  Trophy, Shield, Lock, Award, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { usePredictions } from '../context/PredictionContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenPremium: () => void;
  onNavigate: (view: 'free' | 'safe' | 'fixed' | 'account' | 'members' | 'users') => void;
}

export default function Sidebar({ isOpen, onClose, activeCategory, onSelectCategory, onOpenPremium, onNavigate }: SidebarProps) {
  const { user, userProfile } = useAuth();
  const { predictions } = usePredictions();

  // Calculate pending counts
  const freePendingCount = predictions.filter(p => p.category === 'Free' && p.status === 'Pending').length;
  const safePendingCount = predictions.filter(p => p.category === 'Safe' && p.status === 'Pending').length;
  const fixedPendingCount = predictions.filter(p => p.category === 'Fixed' && p.status === 'Pending').length;

  const categories = [
    { id: 'free', name: 'Free Predictions', icon: Trophy, count: freePendingCount, view: 'free' },
    { id: 'safe', name: 'Safe (VIP)', icon: Shield, count: safePendingCount, view: 'safe' },
    { id: 'fixed', name: 'Fixed Matches', icon: Lock, count: fixedPendingCount, view: 'fixed' },
    { id: 'members', name: 'VIP Active Members', icon: User, count: null, view: 'members', highlight: true },
  ];

  const handleUpgrade = () => {
    onClose();
    onOpenPremium();
  };

  const formatEmail = (email: string | null | undefined) => {
    if (!email) return 'Guest';
    return email.split('@')[0];
  };

  const getPlanName = () => {
    if (!userProfile) return 'Free Plan';
    if (userProfile.subscription === 'fixed') return 'Fixed Plan';
    if (userProfile.subscription === 'safe') return 'Safe Plan';
    return 'Free Plan';
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-[#1a1b1e] text-gray-200 border-r border-white/5">
      {/* User Info */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-emerald-500/20">
            {user?.email?.substring(0, 2).toUpperCase() || <User size={24} />}
          </div>
          <div className="overflow-hidden">
            <p className="text-white font-bold text-base truncate">{formatEmail(user?.email)}</p>
            <div className="flex items-center gap-1.5 text-sm text-gray-300 font-medium">
              <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] ${
                userProfile?.subscription === 'fixed' ? 'bg-purple-500 shadow-purple-500/50' :
                userProfile?.subscription === 'safe' ? 'bg-emerald-500 shadow-emerald-500/50' :
                'bg-blue-500 shadow-blue-500/50'
              }`}></span>
              {getPlanName()}
            </div>
          </div>
        </div>
        <button 
          onClick={handleUpgrade}
          className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white text-xs font-bold py-2.5 rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
        >
          <Award size={14} className="text-white" />
          Upgrade Plan
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-6">
        {/* Prediction Categories */}
        <div className="space-y-1">
          <div className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categories</div>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => {
                onNavigate(cat.view as any);
                onSelectCategory(cat.id);
                if (window.innerWidth < 1024) onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeCategory === cat.id 
                  ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                  : (cat as any).highlight 
                    ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-white border border-purple-500/20 hover:border-purple-500/40' 
                    : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <cat.icon size={18} className={
                  activeCategory === cat.id 
                    ? 'text-emerald-500' 
                    : (cat as any).highlight 
                      ? 'text-purple-400' 
                      : 'text-gray-500'
                } />
                <span className={(cat as any).highlight ? 'font-bold' : ''}>{cat.name}</span>
              </div>
              {cat.count !== null && (
                <span className="text-xs bg-[#25262b] px-1.5 py-0.5 rounded text-gray-500">{cat.count}</span>
              )}
              {(cat as any).highlight && (
                <div className="flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* VIP Promo */}
        <div className="px-2">
          <div 
            onClick={handleUpgrade}
            className="bg-gradient-to-br from-emerald-900/40 to-emerald-600/10 rounded-xl p-4 border border-emerald-500/20 relative overflow-hidden group cursor-pointer hover:border-emerald-500/40 transition-colors"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold">
                <Award size={18} />
                <span>Go Premium</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">Get access to Safe & Fixed matches with 95% win rate.</p>
              <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold py-2 rounded-lg transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 text-xs text-gray-500 text-center">
        &copy; 2024 Sano Bet. All rights reserved.
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 fixed left-0 top-[65px] bottom-0 z-40">
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 z-[60] lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] z-[70] lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
