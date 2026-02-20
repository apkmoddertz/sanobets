/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BottomMenu from './components/BottomMenu';
import Account from './components/Account';
import Members from './components/Members';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import PredictionCard from './components/PredictionCard';
import Sidebar from './components/Sidebar';
import PremiumModal from './components/PremiumModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PredictionProvider, usePredictions } from './context/PredictionContext';
import { Trophy, Shield, Lock, Loader2, Calendar } from 'lucide-react';

import UserManagement from './components/UserManagement';

function AppContent() {
  const { user, userProfile, loading, isAdminMode } = useAuth();

// Consider app loading if auth is loading OR user exists but profile hasn't loaded yet
const appLoading = loading || (user && !userProfile);
  const { predictions } = usePredictions();
  const [currentView, setCurrentView] = useState<'free' | 'safe' | 'fixed' | 'account' | 'members' | 'users'>('free');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('soccer');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  if (appLoading) {
  return (
    <div className="min-h-screen bg-[#141517] flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
    </div>
  );
}

if (!user) {
  return <LoginPage />;
}

  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-[#141517] text-gray-200 font-sans selection:bg-emerald-500/30 pb-20 lg:pb-0">
        <Navbar 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          onOpenWallet={() => {}}
          balance={0}
          onNavigateHome={() => setCurrentView('free')}
          onNavigate={setCurrentView}
        />
        
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onOpenPremium={() => setIsPremiumModalOpen(true)}
          onNavigate={setCurrentView}
        />

        <main className="max-w-7xl mx-auto px-4 py-8 lg:pl-72">
          {currentView === 'account' ? (
            <Account onOpenPremium={() => setIsPremiumModalOpen(true)} onNavigate={setCurrentView} />
          ) : currentView === 'members' ? (
            <Members onOpenPremium={() => setIsPremiumModalOpen(true)} />
          ) : currentView === 'users' ? (
            <UserManagement />
          ) : (
            <AdminDashboard currentView={currentView as any} onNavigate={setCurrentView} />
          )}
        </main>

        <BottomMenu 
          currentView={currentView}
          onNavigate={setCurrentView}
        />
      </div>
    );
  }

  const filteredPredictions = predictions.filter(p => {
    if (currentView === 'free') return p.category === 'Free';
    if (currentView === 'safe') return p.category === 'Safe';
    if (currentView === 'fixed') return p.category === 'Fixed';
    return false;
  });

  // Group by date
  const groupedPredictions = filteredPredictions.reduce((groups, prediction) => {
    const date = new Date(prediction.startTime).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(prediction);
    return groups;
  }, {} as Record<string, typeof predictions>);

  // Sort dates descending (latest first)
  const sortedDates = Object.keys(groupedPredictions).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Check if user has access to VIP content (Safe/Fixed)
  const hasVipAccess = React.useMemo(() => {
    if (!userProfile) return false;
    if (userProfile.status !== 'active') return false;
    
    // Check expiry
    if (userProfile.expires && new Date(userProfile.expires) < new Date()) {
      return false;
    }

    if (currentView === 'safe') {
      return userProfile.subscription === 'safe' || userProfile.subscription === 'fixed';
    }
    
    if (currentView === 'fixed') {
      return userProfile.subscription === 'fixed';
    }

    return true; // Free content is always accessible
  }, [userProfile, currentView]);

  return (
    <div className="min-h-screen bg-[#141517] text-gray-200 font-sans selection:bg-emerald-500/30 pb-20 lg:pb-0">
      <Navbar 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onOpenWallet={() => {}}
        balance={0}
        onNavigateHome={() => setCurrentView('free')}
        onNavigate={setCurrentView}
      />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenPremium={() => setIsPremiumModalOpen(true)}
        onNavigate={setCurrentView}
      />

      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
      />
      
      <main className="max-w-3xl mx-auto px-4 py-8 lg:pl-72">
        {currentView === 'account' ? (
          <Account onOpenPremium={() => setIsPremiumModalOpen(true)} onNavigate={setCurrentView} />
        ) : currentView === 'members' ? (
          <Members onOpenPremium={() => setIsPremiumModalOpen(true)} />
        ) : (
          <div className="space-y-6">
            {/* Header for current section */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                currentView === 'free' ? 'bg-blue-500/20 text-blue-500' :
                currentView === 'safe' ? 'bg-emerald-500/20 text-emerald-500' :
                'bg-purple-500/20 text-purple-500'
              }`}>
                {currentView === 'free' && <Trophy size={24} />}
                {currentView === 'safe' && <Shield size={24} />}
                {currentView === 'fixed' && <Lock size={24} />}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white capitalize">{currentView} Predictions</h1>
                <p className="text-gray-400 text-sm">
                  {currentView === 'free' ? 'Daily free tips for everyone' :
                   currentView === 'safe' ? 'High confidence VIP selections' :
                   'Exclusive insider fixed matches'}
                </p>
              </div>
            </div>

            {/* Predictions List Grouped by Date */}
            <div className="space-y-8">
              {sortedDates.length > 0 ? (
                sortedDates.map(date => (
                  <div key={date} className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <Calendar size={16} className="text-emerald-500" />
                      <h3 className="text-emerald-500 font-bold text-sm uppercase tracking-wider">
                        {date}
                      </h3>
                    </div>
                    {groupedPredictions[date].map(pred => (
                      <PredictionCard 
                        key={pred.id} 
                        prediction={pred} 
                        isLocked={!hasVipAccess && (currentView === 'safe' || currentView === 'fixed') && pred.status === 'Pending'}
                        onOpenPremium={() => setIsPremiumModalOpen(true)}
                      />
                    ))}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 bg-[#1a1b1e] rounded-xl border border-white/5">
                  <p>No predictions available in this category yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomMenu 
        currentView={currentView}
        onNavigate={setCurrentView}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PredictionProvider>
        <AppContent />
      </PredictionProvider>
    </AuthProvider>
  );
}

