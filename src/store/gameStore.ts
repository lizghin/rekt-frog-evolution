'use client';

import { create } from 'zustand';

type Vec3 = {
  x: number;
  y: number;
  z: number;
};

interface GameState {
  score: number;
  coins: number;
  lives: number;
  paused: boolean;
  playerPosition: Vec3;
  playerVelocity: Vec3;

  setPaused: (paused: boolean) => void;
  togglePause: () => void;
  addScore: (amount: number) => void;
  addCoin: (amount?: number) => void;
  setPlayerPosition: (position: Vec3) => void;
  setPlayerVelocity: (velocity: Vec3) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  coins: 0,
  lives: 3,
  paused: true,
  playerPosition: { x: 0, y: 1, z: 0 },
  playerVelocity: { x: 0, y: 0, z: 0 },

  setPaused: (paused) => set({ paused }),
  togglePause: () => set((s) => ({ paused: !s.paused })),
  addScore: (amount) => set((s) => ({ score: s.score + amount })),
  addCoin: (amount = 1) => set((s) => ({ coins: s.coins + amount })),
  setPlayerPosition: (position) => set({ playerPosition: position }),
  setPlayerVelocity: (velocity) => set({ playerVelocity: velocity }),
  reset: () =>
    set({
      score: 0,
      coins: 0,
      lives: 3,
      paused: false,
      playerPosition: { x: 0, y: 1, z: 0 },
      playerVelocity: { x: 0, y: 0, z: 0 },
    }),
}));
