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

export interface Match {
  id?: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  prediction: string;
  odds: number;
  category: 'free' | 'safe' | 'fixed';
  status: 'pending' | 'win' | 'lose';
  createdBy: string;
  createdAt: any;
}

export interface UserProfile {
  email: string;
  subscription: 'free' | 'safe' | 'fixed';
  billing: 'weekly' | 'monthly' | null;
  status: 'active' | 'inactive';
  expires: string | null;
  createdAt?: string;
}
