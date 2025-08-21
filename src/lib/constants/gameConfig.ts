export const GAME_CONFIG = {
  // World dimensions
  WORLD: {
    WIDTH: 50,
    HEIGHT: 20,
    DEPTH: 50,
  },

  // Physics
  GRAVITY: -25,
  GROUND_Y: 0,

  // Player movement
  PLAYER: {
    SPEED: 8,
    JUMP_FORCE: 12,
    SIZE: 1,
  },

  // Boundaries
  BOUNDS: {
    MIN_X: -20,
    MAX_X: 20,
    MIN_Z: -20,
    MAX_Z: 20,
  },

  // Coin collection
  COIN: {
    COLLECTION_DISTANCE: 2,
    POINTS: 100,
    SPIN_SPEED: 0.02,
  },

  // Game mechanics
  INITIAL_LIVES: 3,
  INITIAL_COINS: 5,
} as const;