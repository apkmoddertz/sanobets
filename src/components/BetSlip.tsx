import React, { useState } from 'react';
import { Bet } from '../types';
import { Trash2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BetSlipProps {
  bets: Bet[];
  onRemoveBet: (matchId: string) => void;
  onClearBets: () => void;
  onPlaceBet: (stake: number) => void;
}

export default function BetSlip({ bets, onRemoveBet, onClearBets, onPlaceBet }: BetSlipProps) {
  const [stake, setStake] = useState<string>('10');
  const [isSuccess, setIsSuccess] = useState(false);

  const totalOdds = bets.reduce((acc, bet) => acc * bet.odds, 1);
  const potentialReturn = (parseFloat(stake || '0') * totalOdds).toFixed(2);
  const totalOddsDisplay = totalOdds.toFixed(2);

  const handlePlaceBet = () => {
    onPlaceBet(parseFloat(stake || '0'));
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClearBets();
    }, 2000);
  };

  if (bets.length === 0 && !isSuccess) {
    return (
      <div className="bg-[#1a1b1e] rounded-xl border border-white/5 p-8 text-center h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-[#25262b] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🎫</span>
        </div>
        <h3 className="text-white font-medium mb-2">Your bet slip is empty</h3>
        <p className="text-gray-500 text-sm">Select odds from any match to start building your bet.</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1b1e] rounded-xl border border-emerald-500/30 p-8 text-center relative overflow-hidden h-full flex flex-col items-center justify-center"
      >
        <div className="absolute inset-0 bg-emerald-500/5"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-white font-bold text-xl mb-2">Bet Placed!</h3>
          <p className="text-gray-400 text-sm mb-6">Good luck! You can track your bet in the My Bets section.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-[#1a1b1e] rounded-xl border border-white/5 overflow-hidden flex flex-col h-full max-h-[80vh] lg:max-h-[calc(100vh-120px)] lg:sticky lg:top-24">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#25262b]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-black text-xs font-bold">
            {bets.length}
          </div>
          <h2 className="text-white font-bold">Bet Slip</h2>
        </div>
        <button 
          onClick={onClearBets}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {bets.map((bet) => (
            <motion.div
              key={`${bet.matchId}-${bet.selectionId}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
              className="bg-[#25262b] rounded-lg p-3 border border-white/5 relative group"
            >
              <button 
                onClick={() => onRemoveBet(bet.matchId)}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
              <div className="pr-6">
                <div className="text-xs text-gray-500 mb-1 line-clamp-1">{bet.matchLabel}</div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 font-medium text-sm">{bet.selectionLabel}</span>
                  <span className="bg-black/30 px-2 py-0.5 rounded text-white font-bold text-sm">
                    {bet.odds.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-[#25262b] border-t border-white/5 mt-auto">
        <div className="flex justify-between items-center mb-4 text-sm">
          <span className="text-gray-400">Total Odds</span>
          <span className="text-emerald-400 font-bold font-mono">{totalOddsDisplay}</span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Stake amount</span>
            <span>Max: $500.00</span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              className="w-full bg-[#1a1b1e] border border-white/10 rounded-lg py-2.5 pl-7 pr-3 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400 text-sm">Potential Return</span>
          <span className="text-white font-bold text-lg">${potentialReturn}</span>
        </div>

        <button 
          onClick={handlePlaceBet}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>Place Bet</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
