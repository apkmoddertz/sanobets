import { Match } from '../types';

export const MOCK_MATCHES: Match[] = [
  {
    id: '1',
    league: 'Premier League',
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    startTime: '2024-03-10T16:30:00Z',
    status: 'Upcoming',
    category: 'free',
    odds: {
      home: 2.10,
      draw: 3.50,
      away: 3.20,
      doubleChance: {
        homeDraw: 1.30,
        homeAway: 1.25,
        drawAway: 1.65
      },
      overUnder: {
        over25: 1.75,
        under25: 2.05
      },
      correctScore: {
        score10: 7.50,
        score20: 11.00,
        score21: 9.00,
        score01: 10.00,
        score02: 15.00,
        score12: 12.00,
        score11: 6.50,
        score22: 13.00
      },
      btts: {
        yes: 1.65,
        no: 2.15
      }
    }
  },
  {
    id: '2',
    league: 'La Liga',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    startTime: '2024-03-10T20:00:00Z',
    status: 'Live',
    category: 'free',
    score: {
      home: 1,
      away: 1
    },
    odds: {
      home: 2.80,
      draw: 3.10,
      away: 2.60,
      doubleChance: {
        homeDraw: 1.45,
        homeAway: 1.30,
        drawAway: 1.40
      },
      overUnder: {
        over25: 1.60,
        under25: 2.30
      },
      correctScore: {
        score10: 9.00,
        score20: 14.00,
        score21: 10.00,
        score01: 8.50,
        score02: 13.00,
        score12: 11.00,
        score11: 6.00,
        score22: 12.00
      },
      btts: {
        yes: 1.50,
        no: 2.50
      }
    }
  },
  {
    id: '3',
    league: 'Serie A',
    homeTeam: 'Juventus',
    awayTeam: 'AC Milan',
    startTime: '2024-03-11T19:45:00Z',
    status: 'Upcoming',
    category: 'free',
    odds: {
      home: 2.40,
      draw: 3.20,
      away: 2.95,
      doubleChance: {
        homeDraw: 1.35,
        homeAway: 1.30,
        drawAway: 1.50
      },
      overUnder: {
        over25: 2.10,
        under25: 1.70
      },
      correctScore: {
        score10: 6.50,
        score20: 9.50,
        score21: 9.00,
        score01: 7.50,
        score02: 12.00,
        score12: 10.00,
        score11: 6.00,
        score22: 14.00
      },
      btts: {
        yes: 1.90,
        no: 1.80
      }
    }
  },
  {
    id: '4',
    league: 'Bundesliga',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Dortmund',
    startTime: '2024-03-12T18:30:00Z',
    status: 'Upcoming',
    category: 'free',
    odds: {
      home: 1.85,
      draw: 4.00,
      away: 3.80,
      doubleChance: {
        homeDraw: 1.20,
        homeAway: 1.20,
        drawAway: 1.85
      },
      overUnder: {
        over25: 1.45,
        under25: 2.60
      },
      correctScore: {
        score10: 8.00,
        score20: 10.00,
        score21: 8.50,
        score01: 13.00,
        score02: 20.00,
        score12: 15.00,
        score11: 7.50,
        score22: 12.00
      },
      btts: {
        yes: 1.55,
        no: 2.35
      }
    }
  },
  {
    id: '5',
    league: 'Champions League',
    homeTeam: 'PSG',
    awayTeam: 'Arsenal',
    startTime: '2024-03-13T20:00:00Z',
    status: 'Upcoming',
    category: 'free',
    odds: {
      home: 2.25,
      draw: 3.40,
      away: 3.10,
      doubleChance: {
        homeDraw: 1.33,
        homeAway: 1.28,
        drawAway: 1.55
      },
      overUnder: {
        over25: 1.80,
        under25: 2.00
      },
      correctScore: {
        score10: 8.00,
        score20: 12.00,
        score21: 9.50,
        score01: 9.00,
        score02: 14.00,
        score12: 11.00,
        score11: 6.50,
        score22: 13.00
      },
      btts: {
        yes: 1.70,
        no: 2.05
      }
    }
  }
];
