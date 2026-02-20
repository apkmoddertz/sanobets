import React from 'react';
import { PlacedBet } from '../types';
import { Calendar, Trophy, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface MyBetsProps {
  history: PlacedBet[];
}

export default function MyBets({ history }: MyBetsProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Trophy size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium">No bets placed yet</p>
        <p className="text-sm">Your bet history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-xl font-bold text-white mb-4">My Bets</h2>
      {history.map((bet) => (
        <div key={bet.id} className="bg-[#1a1b1e] rounded-xl border border-white/5 overflow-hidden">
          <div className="bg-[#25262b] px-4 py-3 flex justify-between items-center border-b border-white/5">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Calendar size={12} />
              <span>{new Date(bet.date).toLocaleString()}</span>
            </div>
            <div className={`text-xs font-bold px-2 py-1 rounded ${
              bet.status === 'Won' ? 'bg-emerald-500/20 text-emerald-400' :
              bet.status === 'Lost' ? 'bg-red-500/20 text-red-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {bet.status.toUpperCase()}
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {bet.selections.map((selection, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-white font-medium">{selection.selectionLabel}</div>
                  <div className="text-xs text-gray-500">{selection.matchLabel}</div>
                </div>
                <div className="bg-black/30 px-2 py-1 rounded text-emerald-400 font-mono text-xs font-bold">
                  {selection.odds.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#25262b]/50 px-4 py-3 border-t border-white/5 flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-500">Stake</div>
              <div className="text-sm font-bold text-white">${bet.stake.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Return</div>
              <div className="text-sm font-bold text-emerald-400">${bet.potentialReturn.toFixed(2)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
