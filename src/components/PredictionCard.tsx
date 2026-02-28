import React from 'react';
import { Prediction } from '../types';
import { Trophy, Clock, CheckCircle2, XCircle, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface PredictionCardProps {
  prediction: Prediction;
  isLocked?: boolean;
  onOpenPremium?: () => void;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, isLocked = false, onOpenPremium }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLocked) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1b1e] rounded-xl p-6 border border-white/5 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Lock size={28} />
          </div>
          <h3 className="text-white font-bold text-xl mb-2">VIP Content Locked</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-[200px]">Upgrade to {prediction.category} Plan to see this high-confidence prediction.</p>
          <button 
            onClick={onOpenPremium}
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-105"
          >
            Unlock Now
          </button>
        </div>
        
        {/* Blurred Content Background */}
        <div className="opacity-30 pointer-events-none filter blur-md select-none">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Trophy size={14} className="text-gray-500" />
              <span className="text-xs font-bold text-gray-500 uppercase">{prediction.league}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Clock size={12} />
              <span>12:00</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-lg">Home Team</h3>
            <div className="px-4 text-center">
              <div className="text-gray-600 font-mono text-sm font-bold">VS</div>
            </div>
            <h3 className="text-white font-bold text-lg">Away Team</h3>
          </div>
          <div className="bg-[#25262b] rounded-lg p-4 border border-white/5">
             <div className="h-12"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1a1b1e] rounded-xl p-5 border border-white/5 hover:border-emerald-500/30 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-emerald-500" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{prediction.league}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <Clock size={12} />
          {formatDate(prediction.startTime)}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg leading-tight">{prediction.homeTeam}</h3>
        </div>
        <div className="px-4 text-center">
          <div className="text-gray-600 font-mono text-sm font-bold">VS</div>
        </div>
        <div className="flex-1 text-right">
          <h3 className="text-white font-bold text-lg leading-tight">{prediction.awayTeam}</h3>
        </div>
      </div>

      <div className="bg-[#25262b] rounded-lg p-4 border border-white/5 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1 h-full ${
          prediction.status === 'Won' ? 'bg-emerald-500' :
          prediction.status === 'Lost' ? 'bg-red-500' :
          'bg-yellow-500'
        }`}></div>
        <div className="flex justify-between items-center relative z-10">
          <div>
            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Prediction</div>
            <div className="text-emerald-400 font-bold text-lg">{prediction.prediction}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Odds</div>
            <div className="flex items-center gap-2 justify-end">
              <div className="text-white font-mono font-bold text-lg">{prediction.odds.toFixed(2)}</div>
              {prediction.status === 'Won' && <CheckCircle2 size={20} className="text-emerald-500" />}
              {prediction.status === 'Lost' && <XCircle size={20} className="text-red-500" />}
              {prediction.status === 'Pending' && <Clock size={20} className="text-yellow-500" />}
            </div>
          </div>
        </div>
        
        {prediction.analysis && (
          <div className="mt-3 pt-3 border-t border-white/5 text-sm text-gray-400 italic">
            "{prediction.analysis}"
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PredictionCard;
