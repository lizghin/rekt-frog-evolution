import { create } from 'zustand';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface GameState {
  // Game state
  score: number;
  coins: number;
  lives: number;
  isPaused: boolean;
  isGameStarted: boolean;

  // Player state
  playerPosition: Vector3;
  playerVelocity: Vector3;
  isJumping: boolean;
  isGrounded: boolean;

  // Coin state
  collectedCoins: Set<number>;
  
  // Actions
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  setCoins: (coins: number) => void;
  addCoin: () => void;
  setLives: (lives: number) => void;
  decrementLives: () => void;
  setPaused: (paused: boolean) => void;
  togglePause: () => void;
  setGameStarted: (started: boolean) => void;
  
  // Player actions
  setPlayerPosition: (position: Partial<Vector3>) => void;
  setPlayerVelocity: (velocity: Partial<Vector3>) => void;
  setJumping: (jumping: boolean) => void;
  setGrounded: (grounded: boolean) => void;
  
  // Coin actions
  collectCoin: (coinIndex: number) => void;
  isCoinCollected: (coinIndex: number) => boolean;
  
  // Game actions
  resetGame: () => void;
  startGame: () => void;
}

const initialPlayerPosition: Vector3 = {
  x: GAME_CONFIG.PLAYER.START_POSITION[0],
  y: GAME_CONFIG.PLAYER.START_POSITION[1],
  z: GAME_CONFIG.PLAYER.START_POSITION[2],
};

const initialPlayerVelocity: Vector3 = {
  x: 0,
  y: 0,
  z: 0,
};

export const useGameStore = create<GameState>((set, get) => ({
  // Initial game state
  score: GAME_CONFIG.GAME.INITIAL_SCORE,
  coins: 0,
  lives: GAME_CONFIG.GAME.INITIAL_LIVES,
  isPaused: false,
  isGameStarted: false,

  // Initial player state
  playerPosition: { ...initialPlayerPosition },
  playerVelocity: { ...initialPlayerVelocity },
  isJumping: false,
  isGrounded: true,

  // Initial coin state
  collectedCoins: new Set<number>(),

  // Game actions
  setScore: (score) => set({ score }),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  setCoins: (coins) => set({ coins }),
  addCoin: () => set((state) => ({ coins: state.coins + 1 })),
  setLives: (lives) => set({ lives }),
  decrementLives: () => set((state) => ({ lives: Math.max(0, state.lives - 1) })),
  setPaused: (paused) => set({ isPaused: paused }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setGameStarted: (started) => set({ isGameStarted: started }),

  // Player actions
  setPlayerPosition: (position) =>
    set((state) => ({
      playerPosition: { ...state.playerPosition, ...position },
    })),
  setPlayerVelocity: (velocity) =>
    set((state) => ({
      playerVelocity: { ...state.playerVelocity, ...velocity },
    })),
  setJumping: (jumping) => set({ isJumping: jumping }),
  setGrounded: (grounded) => set({ isGrounded: grounded }),

  // Coin actions
  collectCoin: (coinIndex) => {
    const state = get();
    if (!state.collectedCoins.has(coinIndex)) {
      const newCollectedCoins = new Set(state.collectedCoins);
      newCollectedCoins.add(coinIndex);
      set({
        collectedCoins: newCollectedCoins,
        coins: state.coins + 1,
        score: state.score + GAME_CONFIG.GAME.COIN_SCORE_VALUE,
      });
    }
  },
  isCoinCollected: (coinIndex) => {
    return get().collectedCoins.has(coinIndex);
  },

  // Game management
  resetGame: () =>
    set({
      score: GAME_CONFIG.GAME.INITIAL_SCORE,
      coins: 0,
      lives: GAME_CONFIG.GAME.INITIAL_LIVES,
      isPaused: false,
      isGameStarted: false,
      playerPosition: { ...initialPlayerPosition },
      playerVelocity: { ...initialPlayerVelocity },
      isJumping: false,
      isGrounded: true,
      collectedCoins: new Set<number>(),
    }),
  
  startGame: () =>
    set({
      score: GAME_CONFIG.GAME.INITIAL_SCORE,
      coins: 0,
      lives: GAME_CONFIG.GAME.INITIAL_LIVES,
      isPaused: false,
      isGameStarted: true,
      playerPosition: { ...initialPlayerPosition },
      playerVelocity: { ...initialPlayerVelocity },
      isJumping: false,
      isGrounded: true,
      collectedCoins: new Set<number>(),
    }),
}));