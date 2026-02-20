import React from 'react';
import { MOCK_BOOKMAKERS } from '../data/mockBookmakers';
import { Star, Users, Trophy, CheckCircle2, Lock } from 'lucide-react';

export default function Bookmakers() {
  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Top Bookmakers</h2>
        <button className="text-emerald-400 text-sm font-medium hover:text-emerald-300">
          Become a Bookmaker
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_BOOKMAKERS.map((bookmaker) => (
          <div key={bookmaker.id} className="bg-[#1a1b1e] rounded-xl border border-white/5 p-4 hover:border-emerald-500/30 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={bookmaker.avatar} 
                  alt={bookmaker.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#25262b]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-white font-bold">{bookmaker.name}</h3>
                    {bookmaker.isVerified && (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {bookmaker.followers.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Trophy size={12} />
                      {bookmaker.winRate}% Win Rate
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-[#25262b] px-3 py-1.5 rounded-lg border border-white/5 text-center">
                <div className="text-xs text-gray-500 mb-0.5">Price</div>
                <div className="text-emerald-400 font-bold">${bookmaker.pricePerTip.toFixed(2)}</div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Recent Tips</h4>
              {bookmaker.recentTips.slice(0, 2).map((tip, idx) => (
                <div key={idx} className="flex justify-between items-center bg-[#25262b]/50 p-2 rounded text-xs">
                  <span className="text-gray-300">{tip.matchLabel}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">{tip.selection} @ {tip.odds.toFixed(2)}</span>
                    {tip.result === 'Won' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                    {tip.result === 'Lost' && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                    {tip.result === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm border border-emerald-500/20">
              <Lock size={14} />
              <span>Unlock Premium Tips</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
