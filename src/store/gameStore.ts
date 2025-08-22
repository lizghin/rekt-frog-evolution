'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const isBrowser = typeof window !== 'undefined';

interface Character {
  evolutionStage: number;
  name: string;
  emoji: string;
  abilities: string[];
}

interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  rektTokens: number;
  lives: number;
  level: number;
  gameTime: number;
  character: Character;
  
  // Graphics settings
  graphicsQuality: 'low' | 'medium' | 'high' | 'ultra';
  
  // Camera settings for DoF
  focusDistance: number;
  focalLength: number;

  startGame: () => void;
  restartGame: () => void;
  gameOver: () => void;

  addScore: (points: number) => void;
  addTokens: (amount: number) => void;
  loseLife: () => void;

  pauseGame: () => void;
  resumeGame: () => void;
  togglePause: () => void;

  tick: (deltaMs: number) => void;
  
  // Graphics controls
  setGraphicsQuality: (quality: 'low' | 'medium' | 'high' | 'ultra') => void;
  setFocusDistance: (distance: number) => void;
  setFocalLength: (length: number) => void;
}

const initialState: Omit<GameState,
  | 'startGame' | 'restartGame' | 'gameOver'
  | 'addScore' | 'addTokens' | 'loseLife'
  | 'pauseGame' | 'resumeGame' | 'togglePause'
  | 'tick'
  | 'setGraphicsQuality' | 'setFocusDistance' | 'setFocalLength'
> = {
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  score: 0,
  highScore: isBrowser ? parseInt(window.localStorage.getItem('rektfrog-highscore') || '0') : 0,
  rektTokens: isBrowser ? parseInt(window.localStorage.getItem('rektfrog-tokens') || '0') : 0,
  lives: 5,
  level: 1,
  gameTime: 0,
  character: {
    evolutionStage: 1,
    name: 'REKT Frog',
    emoji: '🐸',
    abilities: ['Jump', 'Survive'],
  },
  graphicsQuality: 'high' as const,
  focusDistance: 10,
  focalLength: 50,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      startGame: () => set({
        isPlaying: true, isPaused: false, isGameOver: false,
        lives: 5, score: 0, gameTime: 0, level: 1,
      }),

      restartGame: () => set({
        isPlaying: true, isPaused: false, isGameOver: false,
        lives: 5, score: 0, level: 1, gameTime: 0,
      }),

      gameOver: () => {
        const s = get();
        const newHigh = Math.max(s.score, s.highScore);
        set({ isPlaying: false, isPaused: false, isGameOver: true, highScore: newHigh });
        if (isBrowser) window.localStorage.setItem('rektfrog-highscore', String(newHigh));
      },

      addScore: (p) => set((s) => ({ score: s.score + p })),

      addTokens: (amount) => {
        const newTokens = get().rektTokens + amount;
        set({ rektTokens: newTokens });
        if (isBrowser) window.localStorage.setItem('rektfrog-tokens', String(newTokens));
      },

      loseLife: () => {
        const newLives = get().lives - 1;
        if (newLives <= 0) get().gameOver();
        else set({ lives: newLives });
      },

      pauseGame: () => set({ isPaused: true, isPlaying: false }),
      resumeGame: () => set({ isPaused: false, isPlaying: true }),
      togglePause: () => {
        const paused = get().isPaused;
        set({ isPaused: !paused, isPlaying: paused });
      },

      tick: (deltaMs) => {
        if (!get().isPlaying) return;
        set((s) => ({ gameTime: s.gameTime + deltaMs }));
      },

      setGraphicsQuality: (quality) => set({ graphicsQuality: quality }),
      setFocusDistance: (distance) => set({ focusDistance: distance }),
      setFocalLength: (length) => set({ focalLength: length }),
    }),
    {
      name: 'rekt-frog-storage',
      skipHydration: true,
      partialize: (s) => ({ highScore: s.highScore, rektTokens: s.rektTokens }),
    },
  )
);

/** Узкие селекторы — меньше лишних ререндеров */
export const useIsPlaying = () => useGameStore(s => s.isPlaying);
export const useIsPaused  = () => useGameStore(s => s.isPaused);
export const useScore     = () => useGameStore(s => s.score);
export const useHighScore = () => useGameStore(s => s.highScore);
export const useTokens    = () => useGameStore(s => s.rektTokens);
export const useLives     = () => useGameStore(s => s.lives);
export const useLevel     = () => useGameStore(s => s.level);
export const useGameTime  = () => useGameStore(s => s.gameTime);
export const useCharacter = () => useGameStore(s => s.character);
export const useGraphicsQuality = () => useGameStore(s => s.graphicsQuality);
export const useFocusDistance = () => useGameStore(s => s.focusDistance);
export const useFocalLength = () => useGameStore(s => s.focalLength);

// Quality presets for performance optimization
export const QUALITY_PRESETS = {
  low: {
    dpr: 1,
    shadows: false,
    smaa: false,
    dof: false,
    contactShadows: false,
    bloomIntensity: 0.5,
    vignetteDarkness: 0.6,
  },
  medium: {
    dpr: 1.5,
    shadows: true,
    smaa: true,
    dof: false,
    contactShadows: true,
    bloomIntensity: 0.6,
    vignetteDarkness: 0.7,
  },
  high: {
    dpr: 2,
    shadows: true,
    smaa: true,
    dof: true,
    contactShadows: true,
    bloomIntensity: 0.8,
    vignetteDarkness: 0.8,
  },
  ultra: {
    dpr: 2,
    shadows: true,
    smaa: true,
    dof: true,
    contactShadows: true,
    bloomIntensity: 1.0,
    vignetteDarkness: 0.9,
  },
} as const;

export const useActions = () => useGameStore(s => ({
  startGame: s.startGame,
  restartGame: s.restartGame,
  gameOver: s.gameOver,
  addScore: s.addScore,
  addTokens: s.addTokens,
  loseLife: s.loseLife,
  pauseGame: s.pauseGame,
  resumeGame: s.resumeGame,
  togglePause: s.togglePause,
  tick: s.tick,
  setGraphicsQuality: s.setGraphicsQuality,
  setFocusDistance: s.setFocusDistance,
  setFocalLength: s.setFocalLength,
}));