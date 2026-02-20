import { Prediction } from '../types';

const generateMockPredictions = (): Prediction[] => {
  const categories: ('Free' | 'Safe' | 'Fixed')[] = ['Free', 'Safe', 'Fixed'];
  const teams = [
    ['Man City', 'Liverpool'], ['Real Madrid', 'Barcelona'], ['Juventus', 'AC Milan'],
    ['Bayern', 'Dortmund'], ['PSG', 'Arsenal'], ['Inter', 'Napoli'],
    ['Chelsea', 'Man Utd'], ['Atletico', 'Sevilla'], ['Ajax', 'PSV']
  ];
  
  const predictions: Prediction[] = [];
  const now = new Date();

  categories.forEach(category => {
    for (let i = 0; i < 8; i++) {
      // 2 matches per day: i=0,1 (day 0), i=2,3 (day 1), i=4,5 (day 2), i=6,7 (day 3)
      const dayOffset = Math.floor(i / 2);
      const matchDate = new Date(now);
      matchDate.setDate(now.getDate() + dayOffset);
      matchDate.setHours(14 + (i % 2) * 4, 0, 0, 0); // Stagger times: 14:00 and 18:00

      const teamPair = teams[i % teams.length];
      
      predictions.push({
        id: `${category}-${i}`,
        league: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga'][i % 4],
        homeTeam: teamPair[0],
        awayTeam: teamPair[1],
        startTime: matchDate.toISOString(),
        prediction: i % 2 === 0 ? 'Home Win' : 'Over 2.5 Goals',
        odds: 1.5 + (i * 0.1),
        category: category,
        status: 'Pending',
        confidence: 70 + (i * 2),
        analysis: category !== 'Free' ? `Exclusive analysis for ${category} match ${i+1}` : undefined
      });
    }
  });

  return predictions;
};

export const MOCK_PREDICTIONS: Prediction[] = generateMockPredictions();
