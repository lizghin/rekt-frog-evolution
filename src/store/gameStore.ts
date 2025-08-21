'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  /* core gameplay flags */
  isPlaying: boolean;
  isGameOver: boolean;
  paused: boolean;

  /* stats */
  score: number;
  coins: number;
  rektTokens: number; // backward-compat for old components
  lives: number;
  highScore: number;
  level: number;

  /* character physics */
  characterPosition: [number, number, number];

  /* actions */
  startGame: () => void;
  togglePause: () => void;
  addScore: (points: number) => void;
  addCoins: (amount: number) => void;
  /* legacy alias */
  addTokens: (amount: number) => void;
  loseLife: () => void;
  setCharacterPosition: (pos: [number, number, number]) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      /* initial state */
      isPlaying: false,
      isGameOver: false,
      paused: false,
      score: 0,
      coins: 0,
      rektTokens: 0,
      lives: 3,
      highScore: 0,
      level: 1,
      characterPosition: [0, 0, 0],

      /* gameplay helpers */
      startGame: () =>
        set({
          isPlaying: true,
          isGameOver: false,
          paused: false,
          score: 0,
          coins: 0,
          rektTokens: 0,
          lives: 3,
          characterPosition: [0, 1, 0],
        }),

      togglePause: () => set((s) => ({ paused: !s.paused })),

      addScore: (points) => set((s) => ({ score: s.score + points })),

      addCoins: (amount) =>
        set((s) => ({ coins: s.coins + amount, rektTokens: s.rektTokens + amount })),

      /* legacy alias so existing components keep working */
      addTokens: (amount) =>
        set((s) => ({ rektTokens: s.rektTokens + amount, coins: s.coins + amount })),

      loseLife: () =>
        set((s) => {
          const newLives = s.lives - 1;
          return newLives <= 0
            ? { lives: 0, isPlaying: false, isGameOver: true }
            : { lives: newLives };
        }),

      setCharacterPosition: (pos) => set({ characterPosition: pos }),
    }),
    {
      name: 'game-store',
      skipHydration: true,
    },
  ),
);
