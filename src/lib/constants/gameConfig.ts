export const GAME_CONFIG = {
  // World dimensions
  WORLD: {
    WIDTH: 100,
    HEIGHT: 50,
    DEPTH: 100,
    GROUND_Y: 0,
  },

  // Physics
  PHYSICS: {
    GRAVITY: -30,
    TERMINAL_VELOCITY: -50,
    GROUND_FRICTION: 0.95,
    AIR_FRICTION: 0.98,
  },

  // Player movement
  PLAYER: {
    MOVE_SPEED: 10,
    JUMP_FORCE: 15,
    SIZE: {
      WIDTH: 1,
      HEIGHT: 2,
      DEPTH: 1,
    },
    START_POSITION: [0, 1, 0] as [number, number, number],
  },

  // Coin settings
  COIN: {
    COLLECT_DISTANCE: 2,
    ROTATION_SPEED: 2,
    SIZE: 0.5,
    POSITIONS: [
      [5, 1, 5],
      [-5, 1, 5],
      [5, 1, -5],
      [-5, 1, -5],
      [0, 1, 0],
    ] as [number, number, number][],
  },

  // Game mechanics
  GAME: {
    INITIAL_LIVES: 3,
    INITIAL_SCORE: 0,
    COIN_SCORE_VALUE: 10,
  },

  // Camera
  CAMERA: {
    FOV: 75,
    NEAR: 0.1,
    FAR: 1000,
    POSITION: [10, 10, 10] as [number, number, number],
  },
} as const;

export type GameConfigType = typeof GAME_CONFIG;