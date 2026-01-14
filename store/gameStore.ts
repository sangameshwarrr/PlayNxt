// ============================================
// PlayNxt - Game Store (Zustand)
// ============================================

import { create } from 'zustand';
import { Game, GameFilters, CreateGameForm } from '@/types';
import { gamesApi } from '@/services/api';

interface GameState {
  games: Game[];
  myGames: Game[];
  selectedGame: Game | null;
  filters: GameFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchGames: (filters?: GameFilters) => Promise<void>;
  fetchGameById: (id: string) => Promise<void>;
  fetchMyGames: () => Promise<void>;
  createGame: (form: CreateGameForm) => Promise<boolean>;
  joinGame: (gameId: string) => Promise<boolean>;
  leaveGame: (gameId: string) => Promise<boolean>;
  setFilters: (filters: GameFilters) => void;
  clearFilters: () => void;
  clearError: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  games: [],
  myGames: [],
  selectedGame: null,
  filters: {},
  isLoading: false,
  error: null,

  fetchGames: async (filters?: GameFilters) => {
    set({ isLoading: true, error: null });

    try {
      const response = await gamesApi.getGames(filters || get().filters);

      if (response.success && response.data) {
        set({ games: response.data, isLoading: false });
      } else {
        set({ error: response.error || 'Failed to fetch games', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Something went wrong', isLoading: false });
    }
  },

  fetchGameById: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await gamesApi.getGameById(id);

      if (response.success && response.data) {
        set({ selectedGame: response.data, isLoading: false });
      } else {
        set({ error: response.error || 'Game not found', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Something went wrong', isLoading: false });
    }
  },

  fetchMyGames: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await gamesApi.getMyGames();

      if (response.success && response.data) {
        set({ myGames: response.data, isLoading: false });
      } else {
        set({ error: response.error || 'Failed to fetch games', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Something went wrong', isLoading: false });
    }
  },

  createGame: async (form: CreateGameForm) => {
    set({ isLoading: true, error: null });

    try {
      const response = await gamesApi.createGame(form);

      if (response.success && response.data) {
        const games = get().games;
        set({
          games: [response.data, ...games],
          isLoading: false,
        });
        return true;
      } else {
        set({ error: response.error || 'Failed to create game', isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Something went wrong', isLoading: false });
      return false;
    }
  },

  joinGame: async (gameId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await gamesApi.joinGame(gameId);

      if (response.success && response.data) {
        // Update the game in the list
        const games = get().games.map(g =>
          g.id === gameId ? response.data! : g
        );
        set({
          games,
          selectedGame: response.data,
          isLoading: false,
        });
        return true;
      } else {
        set({ error: response.error || 'Failed to join game', isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Something went wrong', isLoading: false });
      return false;
    }
  },

  leaveGame: async (gameId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await gamesApi.leaveGame(gameId);

      if (response.success) {
        await get().fetchGameById(gameId);
        return true;
      } else {
        set({ error: response.error || 'Failed to leave game', isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Something went wrong', isLoading: false });
      return false;
    }
  },

  setFilters: (filters: GameFilters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  clearError: () => {
    set({ error: null });
  },
}));

