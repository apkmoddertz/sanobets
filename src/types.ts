export interface Prediction {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  prediction: string; // e.g., "Home Win", "Over 2.5", "Correct Score 2-1"
  odds: number;
  category: 'Free' | 'Safe' | 'Fixed';
  status: 'Pending' | 'Won' | 'Lost';
  result?: string; // e.g., "2-1"
  confidence?: number; // 1-100
  analysis?: string;
}

export interface UserProfile {
  email: string;
  isVip: boolean;
  vipExpiry?: string;
}
