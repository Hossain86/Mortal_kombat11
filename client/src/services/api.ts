import axios from 'axios';
import type { Tournament, Player, Match, TournamentStats, ApiResponse } from '../types';

// Create axios instance with base configuration
// In development: proxies to localhost:5000/api via Vite
// In production: uses VITE_API_BASE_URL from environment
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Tournament API calls
export const tournamentAPI = {
  getAll: async () => {
    const { data } = await api.get<ApiResponse<Tournament[]>>('/tournaments');
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Tournament>>(`/tournaments/${id}`);
    return data;
  },

  create: async (tournament: Partial<Tournament>) => {
    const { data } = await api.post<ApiResponse<Tournament>>('/tournaments', tournament);
    return data;
  },

  update: async (id: string, tournament: Partial<Tournament>) => {
    const { data } = await api.put<ApiResponse<Tournament>>(`/tournaments/${id}`, tournament);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<void>>(`/tournaments/${id}`);
    return data;
  },

  getStats: async (id: string) => {
    const { data } = await api.get<ApiResponse<TournamentStats>>(`/tournaments/${id}/stats`);
    return data;
  },
};

// Player API calls
export const playerAPI = {
  getAll: async (tournamentId?: string) => {
    const params = tournamentId ? { tournament: tournamentId } : {};
    const { data } = await api.get<ApiResponse<Player[]>>('/players', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Player>>(`/players/${id}`);
    return data;
  },

  create: async (player: { name: string; tournament: string }) => {
    const { data } = await api.post<ApiResponse<Player>>('/players', player);
    return data;
  },

  update: async (id: string, player: Partial<Player>) => {
    const { data } = await api.put<ApiResponse<Player>>(`/players/${id}`, player);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<void>>(`/players/${id}`);
    return data;
  },

  getMatches: async (id: string) => {
    const { data } = await api.get<ApiResponse<Match[]>>(`/players/${id}/matches`);
    return data;
  },
};

// Match API calls
export const matchAPI = {
  getAll: async (tournamentId?: string, status?: string) => {
    const params: any = {};
    if (tournamentId) params.tournament = tournamentId;
    if (status) params.status = status;
    const { data } = await api.get<ApiResponse<Match[]>>('/matches', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Match>>(`/matches/${id}`);
    return data;
  },

  create: async (match: {
    tournament: string;
    player1: string;
    player2: string;
    player1Character: string;
    player2Character: string;
    matchType: 'normal' | 'final';
    status?: 'live' | 'completed';
    winner?: string;
  }) => {
    const { data } = await api.post<ApiResponse<Match>>('/matches', match);
    return data;
  },

  update: async (id: string, match: Partial<Match>) => {
    const { data } = await api.put<ApiResponse<Match>>(`/matches/${id}`, match);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<void>>(`/matches/${id}`);
    return data;
  },

  complete: async (id: string, winnerId: string) => {
    const { data } = await api.put<ApiResponse<Match>>(`/matches/${id}/complete`, { winnerId });
    return data;
  },
};

export default api;
