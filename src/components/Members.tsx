import React, { useState, useEffect } from 'react';
import { User, Shield, Lock, Star } from 'lucide-react';

interface Member {
  id: string;
  email: string;
  action: string;
  time: string;
  timestamp: number;
  type: 'fixed' | 'safe' | 'vip';
}

const EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
const NAMES = [
  'john', 'peter', 'david', 'sarah', 'michael', 'emma', 'alex', 'chris', 'daniel', 'robert',
  'lisa', 'james', 'mary', 'patricia', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan',
  'jessica', 'thomas', 'joseph', 'charles', 'christopher', 'matthew', 'anthony', 'mark', 'donald'
];

const generateRandomMember = (): Member => {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const domain = EMAIL_DOMAINS[Math.floor(Math.random() * EMAIL_DOMAINS.length)];
  const randomNum = Math.floor(Math.random() * 9999);
  // Mask the email: jo...99@gmail.com
  const email = `${name.substring(0, 2)}...${randomNum}@${domain}`;
  
  const types: ('fixed' | 'safe' | 'vip')[] = ['fixed', 'safe', 'vip'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  let action = '';
  if (type === 'fixed') action = 'Joined Fixed';
  else if (type === 'safe') action = 'Joined Safe';
  else action = 'Joined Safe & Fixed';

  return {
    id: Math.random().toString(36).substr(2, 9),
    email,
    action,
    time: 'Just now',
    timestamp: Date.now(),
    type
  };
};

interface MembersProps {
  onOpenPremium?: () => void;
}

export default function Members({ onOpenPremium }: MembersProps) {
  const [members, setMembers] = useState<Member[]>([]);

  // Initial population
  useEffect(() => {
    const initialMembers: Member[] = [];
    const now = Date.now();
    
    for (let i = 0; i < 12; i++) {
      const member = generateRandomMember();
      // Stagger times for initial list
      const timeAgo = Math.floor(Math.random() * 15 * 60 * 1000); // 0-15 mins ago
      member.timestamp = now - timeAgo;
      initialMembers.push(member);
    }
    
    // Sort by newest first
    initialMembers.sort((a, b) => b.timestamp - a.timestamp);
    setMembers(initialMembers);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newMember = generateRandomMember();
      setMembers(prev => [newMember, ...prev].slice(0, 20)); // Keep max 20 items
    }, 5000 + Math.random() * 5000); // Random interval 5-10s

    return () => clearInterval(interval);
  }, []);

  // Update relative times every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setMembers(prev => [...prev]); // Trigger re-render to update times
    }, 10000); // Update every 10s for "Just now" accuracy

    return () => clearInterval(interval);
  }, []);

  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    return '1 hour ago';
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-[#1a1b1e] p-6 rounded-xl border border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="text-emerald-500" />
            VIP Active Members
          </h2>
          <p className="text-gray-400 text-sm">Real-time community activity</p>
        </div>
        {onOpenPremium && (
          <button 
            onClick={onOpenPremium}
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg font-bold text-sm transition-colors"
          >
            Join Now
          </button>
        )}
      </div>

      <div className="grid gap-3">
        {members.map((member) => (
          <div 
            key={member.id}
            className="bg-[#1a1b1e] p-4 rounded-xl border border-white/5 flex items-center justify-between hover:border-emerald-500/30 transition-colors group animate-in fade-in slide-in-from-top-2 duration-500"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                ${member.type === 'fixed' ? 'bg-purple-500/20 text-purple-500' : 
                  member.type === 'safe' ? 'bg-blue-500/20 text-blue-500' :
                  'bg-yellow-500/20 text-yellow-500'
                }`}
              >
                {member.email.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-white text-sm">{member.email}</div>
                <div className="text-xs text-emerald-500 font-medium">{getRelativeTime(member.timestamp)}</div>
              </div>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5
              ${member.type === 'fixed' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 
                member.type === 'safe' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
              }`}
            >
              {member.type === 'fixed' && <Lock size={12} />}
              {member.type === 'safe' && <Shield size={12} />}
              {member.type === 'vip' && <Star size={12} />}
              {member.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
