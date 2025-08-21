'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Безопасная проверка браузера (SSR не упадёт)
const isBrowser = typeof window !== 'undefined';

/** Базовые типы */
interface Character {
  evolutionStage: number;
  name: string;
  emoji: string;
  abilities: string[];
}

interface GameState {
  // состояние
  isPlaying: boolean;
  isPaused: boolean;      // ← добавили
  isGameOver: boolean;
  score: number;
  highScore: number;
  rektTokens: number;
  lives: number;
  level: number;
  gameTime: number;       // ← добавили (мс с начала рана)
  character: Character;

  // действия
  startGame: () => void;
  restartGame: () => void;
  gameOver: () => void;

  addScore: (points: number) => void;
  addTokens: (amount: number) => void;
  loseLife: () => void;

  pauseGame: () => void;      // ← добавили
  resumeGame: () => void;     // ← добавили
  togglePause: () => void;    // ← добавили
  tick: (deltaMs: number) => void; // ← добавили, наращивает gameTime
}

/** Начальное состояние */
const initialState: Omit<
  GameState,
  | 'startGame'
  | 'restartGame'
  | 'gameOver'
  | 'addScore'
  | 'addTokens'
  | 'loseLife'
  | 'pauseGame'
  | 'resumeGame'
  | 'togglePause'
  | 'tick'
> = {
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  score: 0,
  highScore: isBrowser ? parseInt(localStorage.getItem('rektfrog-highscore') || '0') : 0,
  rektTokens: isBrowser ? parseInt(localStorage.getItem('rektfrog-tokens') || '0') : 0,
  lives: 5,
  level: 1,
  gameTime: 0,
  character: {
    evolutionStage: 1,
    name: 'REKT Frog',
    emoji: '🐸',
    abilities: ['Jump', 'Survive'],
  },
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      /** Запуск новой игры */
      startGame: () =>
        set({
          isPlaying: true,
          isPaused: false,
          isGameOver: false,
          lives: 5,
          score: 0,
          gameTime: 0,
          level: 1,
        }),

      /** Рестарт после Game Over */
      restartGame: () =>
        set({
          isPlaying: true,
          isPaused: false,
          isGameOver: false,
          lives: 5,
          score: 0,
          level: 1,
          gameTime: 0,
        }),

      /** Завершение игры */
      gameOver: () => {
        const state = get();
        const newHighScore = Math.max(state.score, state.highScore);

        set({
          isPlaying: false,
          isPaused: false,
          isGameOver: true,
          highScore: newHighScore,
        });

        if (isBrowser) {
          localStorage.setItem('rektfrog-highscore', String(newHighScore));
        }
      },

      /** Очки */
      addScore: (points) => set((s) => ({ score: s.score + points })),

      /** Токены */
      addTokens: (amount) => {
        const newTokens = get().rektTokens + amount;
        set({ rektTokens: newTokens });
        if (isBrowser) {
          localStorage.setItem('rektfrog-tokens', String(newTokens));
        }
      },

      /** Потеря жизни */
      loseLife: () => {
        const newLives = get().lives - 1;
        if (newLives <= 0) {
          get().gameOver();
        } else {
          set({ lives: newLives });
        }
      },

      /** Пауза/резюм */
      pauseGame: () => set({ isPaused: true, isPlaying: false }),
      resumeGame: () => set({ isPaused: false, isPlaying: true }),
      togglePause: () => {
        const paused = get().isPaused;
        set({ isPaused: !paused, isPlaying: paused });
      },

      /** Апдейт таймера — вызывать в игровом цикле */
      tick: (deltaMs) => {
        if (!get().isPlaying) return;
        set((s) => ({ gameTime: s.gameTime + deltaMs }));
      },
    }),
    {
      name: 'rekt-frog-storage',
      skipHydration: true, // избегаем SSR-гидрации стора
      // Храним в персисте только то, что реально нужно между сессиями
      partialize: (state) => ({
        highScore: state.highScore,
        rektTokens: state.rektTokens,
      }),
    }
  )
);