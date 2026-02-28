export interface Prediction {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string; // This will map to 'date' in Firestore
  prediction: string;
  odds: number;
  category: 'Free' | 'Safe' | 'Fixed';
  status: 'Pending' | 'Won' | 'Lost';
  result?: string;
  confidence?: number;
  analysis?: string;
  createdBy?: string;
  createdAt?: any; // Firestore Timestamp
}

export interface Bet {
  matchId: string;
  selectionId: string;
  selectionLabel: string;
  odds: number;
  matchLabel: string;
}

export interface PlacedBet {
  id: string;
  userId: string;
  bets: Bet[];
  selections: Bet[];
  totalOdds: number;
  stake: number;
  potentialWin: number;
  potentialReturn: number;
  status: 'pending' | 'won' | 'lost' | 'Won' | 'Lost';
  createdAt: string;
  date: string;
}

export interface Match {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  status: 'Upcoming' | 'Live' | 'Finished' | 'pending' | 'win' | 'lose';
  score?: {
    home: number;
    away: number;
  };
  odds: {
    home: number;
    draw: number;
    away: number;
    doubleChance?: {
      homeDraw: number;
      homeAway: number;
      drawAway: number;
    };
    overUnder?: {
      over25: number;
      under25: number;
    };
    btts?: {
      yes: number;
      no: number;
    };
    correctScore?: Record<string, number>;
  };
  category: 'free' | 'safe' | 'fixed';
}

export interface UserProfile {
  email: string;
  subscription: 'free' | 'safe' | 'fixed';
  billing: 'weekly' | 'monthly' | null;
  status: 'active' | 'inactive';
  expires: string | null;
  onboardingCompleted?: boolean;
  createdAt?: string;
}
