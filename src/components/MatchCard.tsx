import React, { useState } from 'react';
import { Match, Bet } from '../types';
import { Clock, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MatchCardProps {
  match: Match;
  onToggleBet: (bet: Bet) => void;
  selectedBets: Bet[];
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onToggleBet, selectedBets }) => {
  const [showMore, setShowMore] = useState(false);

  const isSelected = (selectionId: string) => {
    return selectedBets.some(b => b.matchId === match.id && b.selectionId === selectionId);
  };

  const getButtonClass = (selectionId: string) => {
    const base = "flex flex-col items-center justify-center py-3 rounded-lg transition-all duration-200 font-medium text-sm cursor-pointer border";
    if (isSelected(selectionId)) {
      return `${base} bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]`;
    }
    return `${base} bg-[#25262b] text-gray-300 border-transparent hover:border-white/10 hover:bg-[#2c2e33]`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short', 
      hour: 'numeric', 
      minute: 'numeric' 
    }).format(date);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1a1b1e] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <Trophy size={12} className="text-emerald-500" />
          <span>{match.league}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
          {match.status === 'Live' ? (
            <span className="flex items-center gap-1.5 text-red-500 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {formatDate(match.startTime)}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg leading-tight">{match.homeTeam}</h3>
        </div>
        <div className="px-4 text-center">
          {match.status === 'Live' ? (
            <div className="bg-[#25262b] px-3 py-1 rounded text-emerald-400 font-mono font-bold text-lg tracking-widest border border-white/5">
              {match.score?.home} - {match.score?.away}
            </div>
          ) : (
            <div className="text-gray-600 font-mono text-sm">VS</div>
          )}
        </div>
        <div className="flex-1 text-right">
          <h3 className="text-white font-semibold text-lg leading-tight">{match.awayTeam}</h3>
        </div>
      </div>

      {/* Main Markets (1X2) */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <button 
          onClick={() => onToggleBet({
            matchId: match.id,
            selectionId: 'home',
            selectionLabel: match.homeTeam,
            odds: match.odds.home,
            matchLabel: `${match.homeTeam} vs ${match.awayTeam}`
          })}
          className={getButtonClass('home')}
        >
          <span className="text-xs opacity-60 mb-0.5">1</span>
          <span>{match.odds.home.toFixed(2)}</span>
        </button>
        
        <button 
          onClick={() => onToggleBet({
            matchId: match.id,
            selectionId: 'draw',
            selectionLabel: 'Draw',
            odds: match.odds.draw,
            matchLabel: `${match.homeTeam} vs ${match.awayTeam}`
          })}
          className={getButtonClass('draw')}
        >
          <span className="text-xs opacity-60 mb-0.5">X</span>
          <span>{match.odds.draw.toFixed(2)}</span>
        </button>
        
        <button 
          onClick={() => onToggleBet({
            matchId: match.id,
            selectionId: 'away',
            selectionLabel: match.awayTeam,
            odds: match.odds.away,
            matchLabel: `${match.homeTeam} vs ${match.awayTeam}`
          })}
          className={getButtonClass('away')}
        >
          <span className="text-xs opacity-60 mb-0.5">2</span>
          <span>{match.odds.away.toFixed(2)}</span>
        </button>
      </div>

      {/* More Markets Toggle */}
      <button 
        onClick={() => setShowMore(!showMore)}
        className="w-full flex items-center justify-center gap-2 text-xs font-medium text-gray-500 hover:text-emerald-400 py-2 transition-colors"
      >
        {showMore ? (
          <>
            <span>Less Markets</span>
            <ChevronUp size={14} />
          </>
        ) : (
          <>
            <span>More Markets (+2)</span>
            <ChevronDown size={14} />
          </>
        )}
      </button>

      {/* Expanded Markets */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-4 border-t border-white/5 mt-2">
              
              {/* Double Chance */}
              {match.odds.doubleChance && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Double Chance</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => onToggleBet({
                        matchId: match.id,
                        selectionId: 'dc_1x',
                        selectionLabel: '1X',
                        odds: match.odds.doubleChance!.homeDraw,
                        matchLabel: `${match.homeTeam} vs ${match.awayTeam}`
                      })}
                      className={getButtonClass('dc_1x')}
                    >
                      <span className="text-xs opacity-60 mb-0.5">1X</span>
                      <span>{match.odds.doubleChance.homeDraw.toFixed(2)}</span>
                    </button>
                    <button 
                      onClick={() => onToggleBet({
                        matchId: match.id,
                        selectionId: 'dc_12',
                        selectionLabel: '12',
                        odds: match.odds.doubleChance!.homeAway,
                        matchLabel: `${match.homeTeam} vs ${match.awayTeam}`
                      })}
                      className={getButtonClass('dc_12')}
                    >
                      <span className="text-xs opacity-60 mb-0.5">12</span>
                      <span>{match.odds.doubleChance.homeAway.toFixed(2)}</span>
                    </button>
                    <button 
                      onClick={() => onToggleBet({
                        matchId: match.id,
                        selectionId: 'dc_x2',
                        selectionLabel: 'X2',
                        odds: match.odds.doubleChance!.drawAway,
                        matchLabel: `${match.homeTeam} vs ${match.awayTeam}`
                      })}
                      className={getButtonClass('dc_x2')}
                    >
                      <span className="text-xs opacity-60 mb-0.5">X2</span>
                      <span>{match.odds.doubleChance.drawAway.toFixed(2)}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Over/Under 2.5 */}
              {match.odds.overUnder && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Total Goals (2.5)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => onToggleBet({
                        matchId: match.id,
                        selectionId: 'over_25',
                        selectionLabel: 'Over 2.5',
                        odds: match.odds.overUnder!.over25,
                        matchLabel: `${match.homeTeam} vs ${match.awayTeam}`
                      })}
                      className={getButtonClass('over_25')}
                    >
                      <span className="text-xs opacity-60 mb-0.5">Over</span>
                      <span>{match.odds.overUnder.over25.toFixed(2)}</span>
                    </button>
                    <button 
                      onClick={() => onToggleBet({
                        matchId: match.id,
                        selectionId: 'under_25',
                        selectionLabel: 'Under 2.5',
                        odds: match.odds.overUnder!.under25,
                        matchLabel: `${match.homeTeam} vs ${match.awayTeam}`
                      })}
                      className={getButtonClass('under_25')}
                    >
                      <span className="text-xs opacity-60 mb-0.5">Under</span>
                      <span>{match.odds.overUnder.under25.toFixed(2)}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Both Teams To Score */}
              {match.odds.btts && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Both Teams To Score</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => onToggleBet({
                        matchId: match.id,
                        selectionId: 'btts_yes',
                        selectionLabel: 'BTTS - Yes',
                        odds: match.odds.btts!.yes,
                        matchLabel: `${match.homeTeam} vs ${match.awayTeam}`
                      })}
                      className={getButtonClass('btts_yes')}
                    >
                      <span className="text-xs opacity-60 mb-0.5">Yes</span>
                      <span>{match.odds.btts.yes.toFixed(2)}</span>
                    </button>
                    <button 
                      onClick={() => onToggleBet({
                        matchId: match.id,
                        selectionId: 'btts_no',
                        selectionLabel: 'BTTS - No',
                        odds: match.odds.btts!.no,
                        matchLabel: `${match.homeTeam} vs ${match.awayTeam}`
                      })}
                      className={getButtonClass('btts_no')}
                    >
                      <span className="text-xs opacity-60 mb-0.5">No</span>
                      <span>{match.odds.btts.no.toFixed(2)}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Correct Score */}
              {match.odds.correctScore && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Correct Score</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(match.odds.correctScore).map(([key, value]) => {
                      // key is like 'score10' -> '1-0'
                      const scoreLabel = key.replace('score', '').split('').join('-');
                      return (
                        <button 
                          key={key}
                          onClick={() => onToggleBet({
                            matchId: match.id,
                            selectionId: `cs_${key}`,
                            selectionLabel: `Score ${scoreLabel}`,
                            odds: value,
                            matchLabel: `${match.homeTeam} vs ${match.awayTeam}`
                          })}
                          className={getButtonClass(`cs_${key}`)}
                        >
                          <span className="text-xs opacity-60 mb-0.5">{scoreLabel}</span>
                          <span>{(value as number).toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MatchCard;
