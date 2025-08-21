'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as THREE from 'three';

// Check if we're in browser
const isBrowser = typeof window !== 'undefined';

// Types
interface Character {
  evolutionStage: number;
  name: string;
  emoji: string;
  abilities: string[];
}

interface PlayerState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  isGrounded: boolean;
  isJumping: boolean;
}

interface GameState {
  // Game state
  isPlaying: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  score: number;
  highScore: number;
  rektTokens: number;
  lives: number;
  level: number;
  coinsCollected: number;
  totalCoins: number;
  
  // Character
  character: Character;
  
  // Player physics
  player: PlayerState;
  
  // Actions
  startGame: () => void;
  restartGame: () => void;
  gameOver: () => void;
  togglePause: () => void;
  addScore: (points: number) => void;
  addTokens: (amount: number) => void;
  loseLife: () => void;
  collectCoin: () => void;
  updatePlayerPosition: (position: THREE.Vector3) => void;
  updatePlayerVelocity: (velocity: THREE.Vector3) => void;
  setPlayerGrounded: (grounded: boolean) => void;
  setPlayerJumping: (jumping: boolean) => void;
}

// Initial state
const initialState = {
  isPlaying: false,
  isGameOver: false,
  isPaused: false,
  score: 0,
  highScore: isBrowser ? parseInt(localStorage.getItem('rektfrog-highscore') || '0') : 0,
  rektTokens: isBrowser ? parseInt(localStorage.getItem('rektfrog-tokens') || '0') : 0,
  lives: 3,
  level: 1,
  coinsCollected: 0,
  totalCoins: 5,
  character: {
    evolutionStage: 1,
    name: 'REKT Frog',
    emoji: '🐸',
    abilities: ['Jump', 'Survive']
  },
  player: {
    position: new THREE.Vector3(0, 1, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    isGrounded: true,
    isJumping: false,
  }
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      startGame: () => set({ 
        isPlaying: true, 
        isGameOver: false,
        isPaused: false,
        lives: 3,
        score: 0,
        coinsCollected: 0,
        player: {
          position: new THREE.Vector3(0, 1, 0),
          velocity: new THREE.Vector3(0, 0, 0),
          isGrounded: true,
          isJumping: false,
        }
      }),

      restartGame: () => set({ 
        isPlaying: true, 
        isGameOver: false,
        isPaused: false,
        lives: 3,
        score: 0,
        level: 1,
        coinsCollected: 0,
        player: {
          position: new THREE.Vector3(0, 1, 0),
          velocity: new THREE.Vector3(0, 0, 0),
          isGrounded: true,
          isJumping: false,
        }
      }),

      togglePause: () => set((state) => ({ 
        isPaused: !state.isPaused 
      })),

      gameOver: () => {
        const state = get();
        const newHighScore = Math.max(state.score, state.highScore);
        
        set({ 
          isPlaying: false, 
          isGameOver: true,
          isPaused: false,
          highScore: newHighScore
        });

        // Save to localStorage
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
        
        // Save to localStorage
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
      },

      collectCoin: () => {
        const state = get();
        const newCoinsCollected = state.coinsCollected + 1;
        
        set({ 
          coinsCollected: newCoinsCollected,
          score: state.score + 100
        });

        // Check if all coins collected
        if (newCoinsCollected >= state.totalCoins) {
          // Could trigger level up or victory condition
          console.log('All coins collected!');
        }
      },

      updatePlayerPosition: (position) => set((state) => ({
        player: { ...state.player, position }
      })),

      updatePlayerVelocity: (velocity) => set((state) => ({
        player: { ...state.player, velocity }
      })),

      setPlayerGrounded: (grounded) => set((state) => ({
        player: { ...state.player, isGrounded: grounded }
      })),

      setPlayerJumping: (jumping) => set((state) => ({
        player: { ...state.player, isJumping: jumping }
      })),
    }),
    {
      name: 'rekt-frog-storage',
      skipHydration: true,
      // Only persist certain fields
      partialize: (state) => ({
        highScore: state.highScore,
        rektTokens: state.rektTokens,
      }),
    }
  )
);