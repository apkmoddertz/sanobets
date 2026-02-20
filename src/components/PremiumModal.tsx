import React, { useState } from 'react';
import { X, Check, Crown, Star, Zap, Shield, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | null>('weekly');
  const [vipType, setVipType] = useState<'safe' | 'fixed'>('safe');

  const getPrice = (type: 'safe' | 'fixed', plan: 'weekly' | 'monthly') => {
    if (type === 'safe') {
      return plan === 'weekly' ? 129 : 399;
    } else {
      return plan === 'weekly' ? 399 : 999;
    }
  };

  const currentPrice = selectedPlan ? getPrice(vipType, selectedPlan) : 0;

  const handlePay = () => {
    if (selectedPlan) {
      const price = getPrice(vipType, selectedPlan);
      const typeLabel = vipType === 'safe' ? 'Safe VIP' : 'Fixed VIP';
      const planLabel = selectedPlan === 'weekly' ? 'Weekly' : 'Monthly';
      
      const text = `I want to subscribe to the ${typeLabel} ${planLabel} Plan ($${price})`;
      const url = `https://t.me/Sano_bet?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101] p-4"
          >
            <div className="bg-[#1a1b1e]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              {/* Decorative gradients */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/20 to-transparent pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30 transform rotate-3">
                  <Crown size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Unlock VIP Access</h2>
              </div>

              {/* VIP Type Toggle */}
              <div className="bg-black/20 p-1 rounded-xl flex mb-6 relative z-10">
                <button
                  onClick={() => setVipType('safe')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                    vipType === 'safe' 
                      ? 'bg-emerald-500 text-black shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Shield size={16} />
                  Safe VIP
                </button>
                <button
                  onClick={() => setVipType('fixed')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                    vipType === 'fixed' 
                      ? 'bg-emerald-500 text-black shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Lock size={16} />
                  Fixed VIP
                </button>
              </div>

              <div className="space-y-3 mb-8 relative z-10">
                <button
                  onClick={() => setSelectedPlan('weekly')}
                  className={`w-full p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                    selectedPlan === 'weekly' 
                      ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedPlan === 'weekly' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-400'
                      }`}>
                        <Zap size={20} />
                      </div>
                      <div className="text-left">
                        <div className={`font-bold ${selectedPlan === 'weekly' ? 'text-white' : 'text-gray-300'}`}>Weekly Plan</div>
                        <div className="text-xs text-gray-500">${getPrice(vipType, 'weekly')} / week</div>
                      </div>
                    </div>
                    {selectedPlan === 'weekly' && (
                      <div className="bg-emerald-500 rounded-full p-1">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`w-full p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                    selectedPlan === 'monthly' 
                      ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-gradient-to-bl from-yellow-500 to-orange-500 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                    BEST VALUE
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedPlan === 'monthly' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-400'
                      }`}>
                        <Star size={20} />
                      </div>
                      <div className="text-left">
                        <div className={`font-bold ${selectedPlan === 'monthly' ? 'text-white' : 'text-gray-300'}`}>Monthly Plan</div>
                        <div className="text-xs text-gray-500">${getPrice(vipType, 'monthly')} / month</div>
                      </div>
                    </div>
                    {selectedPlan === 'monthly' && (
                      <div className="bg-emerald-500 rounded-full p-1">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                </button>
              </div>

              <button
                onClick={handlePay}
                disabled={!selectedPlan}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedPlan 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/25 translate-y-0' 
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Pay Now ${currentPrice}</span>
                <Crown size={20} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
