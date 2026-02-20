export interface Bookmaker {
  id: string;
  name: string;
  avatar: string;
  winRate: number;
  totalWins: number;
  followers: number;
  pricePerTip: number;
  isVerified: boolean;
  recentTips: {
    matchLabel: string;
    selection: string;
    odds: number;
    result: 'Won' | 'Lost' | 'Pending';
  }[];
}

export const MOCK_BOOKMAKERS: Bookmaker[] = [
  {
    id: '1',
    name: 'Alex "The Oracle" Smith',
    avatar: 'https://picsum.photos/seed/alex/200',
    winRate: 78,
    totalWins: 1450,
    followers: 5200,
    pricePerTip: 5.00,
    isVerified: true,
    recentTips: [
      { matchLabel: 'Man City vs Liverpool', selection: 'Man City', odds: 2.10, result: 'Pending' },
      { matchLabel: 'Real Madrid vs Barca', selection: 'BTTS - Yes', odds: 1.50, result: 'Won' },
      { matchLabel: 'PSG vs Arsenal', selection: 'Arsenal', odds: 3.10, result: 'Lost' }
    ]
  },
  {
    id: '2',
    name: 'Sarah Betz',
    avatar: 'https://picsum.photos/seed/sarah/200',
    winRate: 65,
    totalWins: 890,
    followers: 3100,
    pricePerTip: 2.50,
    isVerified: true,
    recentTips: [
      { matchLabel: 'Juventus vs Milan', selection: 'Draw', odds: 3.20, result: 'Pending' },
      { matchLabel: 'Bayern vs Dortmund', selection: 'Over 2.5', odds: 1.45, result: 'Won' }
    ]
  },
  {
    id: '3',
    name: 'Goal Hunter',
    avatar: 'https://picsum.photos/seed/goal/200',
    winRate: 82,
    totalWins: 2100,
    followers: 8500,
    pricePerTip: 10.00,
    isVerified: true,
    recentTips: [
      { matchLabel: 'Man City vs Liverpool', selection: 'Over 2.5', odds: 1.75, result: 'Pending' },
      { matchLabel: 'Real Madrid vs Barca', selection: 'Real Madrid', odds: 2.80, result: 'Won' }
    ]
  },
  {
    id: '4',
    name: 'Underdog King',
    avatar: 'https://picsum.photos/seed/underdog/200',
    winRate: 45,
    totalWins: 320,
    followers: 1200,
    pricePerTip: 1.00,
    isVerified: false,
    recentTips: [
      { matchLabel: 'PSG vs Arsenal', selection: 'Arsenal', odds: 3.10, result: 'Pending' },
      { matchLabel: 'Bayern vs Dortmund', selection: 'Dortmund', odds: 3.80, result: 'Lost' }
    ]
  }
];
