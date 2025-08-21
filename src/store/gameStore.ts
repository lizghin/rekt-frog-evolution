'use client';

import { create } from 'zustand';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';

interface GameState {
  // Game state
  isPlaying: boolean;
  isPaused: boolean;
  score: number;
  coins: number;
  lives: number;
  
  // Character state
  characterPosition: [number, number, number];
  characterVelocity: [number, number, number];
  
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  addScore: (points: number) => void;
  addCoins: (amount: number) => void;
  loseLife: () => void;
  updateCharacterPosition: (position: [number, number, number]) => void;
  updateCharacterVelocity: (velocity: [number, number, number]) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  isPlaying: false,
  isPaused: false,
  score: 0,
  coins: 0,
  lives: GAME_CONFIG.PLAYER.LIVES,
  characterPosition: [0, 1, 0],
  characterVelocity: [0, 0, 0],

  // Actions
  startGame: () => set({ 
    isPlaying: true, 
    isPaused: false,
    score: 0,
    coins: 0,
    lives: GAME_CONFIG.PLAYER.LIVES,
    characterPosition: [0, 1, 0],
    characterVelocity: [0, 0, 0]
  }),

  pauseGame: () => set({ isPaused: true }),
  
  resumeGame: () => set({ isPaused: false }),

  addScore: (points) => set((state) => ({ 
    score: state.score + points 
  })),

  addCoins: (amount) => set((state) => ({ 
    coins: state.coins + amount 
  })),

  loseLife: () => {
    const state = get();
    const newLives = state.lives - 1;
    
    if (newLives <= 0) {
      set({ isPlaying: false, lives: 0 });
    } else {
      set({ lives: newLives });
    }
  },

  updateCharacterPosition: (position) => set({ characterPosition: position }),
  
  updateCharacterVelocity: (velocity) => set({ characterVelocity: velocity })
}));
