'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Проверяем что мы в браузере
const isBrowser = typeof window !== 'undefined';

// Базовые типы
interface Character {
  evolutionStage: number;
  name: string;
  emoji: string;
  abilities: string[];
}

interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  rektTokens: number;
  lives: number;
  level: number;
  character: Character;
  
  // Actions
  startGame: () => void;
  restartGame: () => void;
  gameOver: () => void;
  addScore: (points: number) => void;
  addTokens: (amount: number) => void;
  loseLife: () => void;
}

// Начальное состояние
const initialState = {
  isPlaying: false,
  isGameOver: false,
  score: 0,
  highScore: isBrowser ? parseInt(localStorage.getItem('rektfrog-highscore') || '0') : 0,
  rektTokens: isBrowser ? parseInt(localStorage.getItem('rektfrog-tokens') || '0') : 0,
  lives: 5,
  level: 1,
  character: {
    evolutionStage: 1,
    name: 'REKT Frog',
    emoji: '🐸',
    abilities: ['Jump', 'Survive']
  }
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      startGame: () => set({ 
        isPlaying: true, 
        isGameOver: false,
        lives: 5,
        score: 0
      }),

      restartGame: () => set({ 
        isPlaying: true, 
        isGameOver: false,
        lives: 5,
        score: 0,
        level: 1
      }),

      gameOver: () => {
        const state = get();
        const newHighScore = Math.max(state.score, state.highScore);
        
        set({ 
          isPlaying: false, 
          isGameOver: true,
          highScore: newHighScore
        });

        // Сохраняем в localStorage
        if (isBrowser) {
          localStorage.setItem('rektfrog-highscore', newHighScore.toString());
        }
      },

      addScore: (points) => set((state) => ({ 
        score: state.score + points 
      })),

      addTokens: (amount) => {
        const state = get();
        const newTokens = state.rektTokens + amount;
        
        set({ rektTokens: newTokens });
        
        // Сохраняем в localStorage
        if (isBrowser) {
          localStorage.setItem('rektfrog-tokens', newTokens.toString());
        }
      },

      loseLife: () => {
        const state = get();
        const newLives = state.lives - 1;
        
        if (newLives <= 0) {
          get().gameOver();
        } else {
          set({ lives: newLives });
        }
      }
    }),
    {
      name: 'rekt-frog-storage',
      skipHydration: true, // Пропускаем гидратацию для избежания SSR проблем
    }
  )
);
