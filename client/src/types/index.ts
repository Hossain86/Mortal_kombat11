// Type definitions for the application

export interface Tournament {
  _id: string;
  name: string;
  status: 'upcoming' | 'live' | 'ended';
  startTime: string;
  endTime?: string;
  winner?: Player;
  players: Player[];
  matches: Match[];
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  _id: string;
  name: string;
  tournament: string | Tournament;
  matchesPlayed: number;
  wins: number;
  winRate: number;
  charactersUsed: Map<string, number>;
  charactersUsedArray?: CharacterUsage[];
  createdAt: string;
  updatedAt: string;
}

export interface CharacterUsage {
  character: string;
  usage: number;
}

export interface Match {
  _id: string;
  tournament: string | Tournament;
  player1: Player;
  player2: Player;
  player1Character: string;
  player2Character: string;
  matchType: 'normal' | 'final';
  status: 'live' | 'completed';
  winner?: Player;
  createdAt: string;
  updatedAt: string;
}

export interface TournamentStats {
  totalPlayers: number;
  totalMatches: number;
  completedMatches: number;
  liveMatches: number;
  topPlayers: Player[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

// Mortal Kombat 11 characters list
export const MK11_CHARACTERS = [
  'Scorpion',
  'Sub-Zero',
  'Raiden',
  'Liu Kang',
  'Kung Lao',
  'Kitana',
  'Jade',
  'Cassie Cage',
  'Johnny Cage',
  'Sonya Blade',
  'Jax',
  'Jacqui Briggs',
  'Kano',
  'Kabal',
  'Baraka',
  'Skarlet',
  'Erron Black',
  'D\'Vorah',
  'Kotal Kahn',
  'Shao Kahn',
  'Cetrion',
  'Kollector',
  'Geras',
  'Frost',
  'Noob Saibot',
  'Shang Tsung',
  'Nightwolf',
  'Sindel',
  'Joker',
  'Terminator',
  'Spawn',
  'Fujin',
  'Sheeva',
  'RoboCop',
  'Rambo',
  'Rain',
  'Mileena'
].sort();
