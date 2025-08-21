import { EvolutionStage, PowerUpType, EnemyType } from '@/types/game';

export const GAME_CONFIG = {
  WORLD: {
    WIDTH: 20,
    HEIGHT: 10,
    DEPTH: 20,
    GRAVITY: -0.02,
    GROUND_LEVEL: 0
  },
  
  PLAYER: {
    SPEED: 0.1,
    JUMP_FORCE: 0.3,
    LIVES: 3
  },

  COIN: {
    COLLECTION_DISTANCE: 2,
    VALUE: 100
  },

  CONTROLS: {
    MOVE_LEFT: ['KeyA', 'ArrowLeft'],
    MOVE_RIGHT: ['KeyD', 'ArrowRight'],
    JUMP: ['Space'],
    PAUSE: ['Escape']
  }
} as const;

export const EVOLUTION_LEVELS: EvolutionStage[] = [
  {
    stage: 0,
    name: "Baby Pepe",
    description: "Just a small frog starting its journey to avoid getting rekt",
    requiredLevel: 0,
    healthBonus: 0,
    speedBonus: 0,
    sizeMultiplier: 1.0,
    modelPath: "/models/frog-baby.glb"
  },
  {
    stage: 1,
    name: "Chad Pepe",
    description: "Growing stronger, this frog learned to diamond hand through the dips",
    requiredLevel: 5,
    healthBonus: 25,
    speedBonus: 1,
    sizeMultiplier: 1.2,
    specialAbility: "Double Jump",
    modelPath: "/models/frog-chad.glb"
  },
  {
    stage: 2,
    name: "Alpha Pepe",
    description: "A seasoned trader who survived multiple rug pulls",
    requiredLevel: 15,
    healthBonus: 50,
    speedBonus: 2,
    sizeMultiplier: 1.5,
    specialAbility: "Damage Resistance",
    modelPath: "/models/frog-alpha.glb"
  },
  {
    stage: 3,
    name: "Degen Lord",
    description: "Master of the markets, immune to FUD and paper hands",
    requiredLevel: 30,
    healthBonus: 100,
    speedBonus: 3,
    sizeMultiplier: 2.0,
    specialAbility: "Coin Magnet",
    modelPath: "/models/frog-degen.glb"
  },
  {
    stage: 4,
    name: "Moon Pepe",
    description: "Transcended to the moon, this frog has achieved ultimate diamond hands",
    requiredLevel: 50,
    healthBonus: 200,
    speedBonus: 5,
    sizeMultiplier: 2.5,
    specialAbility: "Unstoppable Force",
    modelPath: "/models/frog-moon.glb"
  }
];

export const POWERUP_PRICES: Record<PowerUpType, number> = {
  [PowerUpType.UNREKT_BOMB]: 100,
  [PowerUpType.LEDGER_SHIELD]: 150,
  [PowerUpType.MOON_LEAP]: 75,
  [PowerUpType.PUMP_MAGNET]: 125,
  [PowerUpType.DIAMOND_HANDS]: 200,
  [PowerUpType.SPEED_BOOST]: 50
};

export const POWERUP_DURATIONS: Record<PowerUpType, number> = {
  [PowerUpType.UNREKT_BOMB]: 0, // Instant effect
  [PowerUpType.LEDGER_SHIELD]: 15000,
  [PowerUpType.MOON_LEAP]: 10000,
  [PowerUpType.PUMP_MAGNET]: 20000,
  [PowerUpType.DIAMOND_HANDS]: 30000,
  [PowerUpType.SPEED_BOOST]: 8000
};

export const ENEMY_SPAWN_RATES: Record<EnemyType, number> = {
  [EnemyType.RUG_PULL]: 0.4,
  [EnemyType.BEAR_BOT]: 0.3,
  [EnemyType.PUMP_DUMP]: 0.15,
  [EnemyType.WHALE_CRUSHER]: 0.1,
  [EnemyType.FUD_SPREADER]: 0.05
};

export const ENEMY_DIFFICULTY_SCALING: Record<EnemyType, { health: number; damage: number; speed: number }> = {
  [EnemyType.RUG_PULL]: { health: 1.1, damage: 1.05, speed: 1.02 },
  [EnemyType.BEAR_BOT]: { health: 1.15, damage: 1.1, speed: 1.05 },
  [EnemyType.PUMP_DUMP]: { health: 1.2, damage: 1.15, speed: 1.1 },
  [EnemyType.WHALE_CRUSHER]: { health: 1.3, damage: 1.25, speed: 1.08 },
  [EnemyType.FUD_SPREADER]: { health: 1.25, damage: 1.2, speed: 1.15 }
};

export const ACHIEVEMENTS_CONFIG = [
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Defeat your first enemy',
    condition: { type: 'enemiesdefeated', target: 1 },
    reward: 50,
    rarity: 'common'
  },
  {
    id: 'collector',
    name: 'Coin Collector',
    description: 'Collect 100 coins',
    condition: { type: 'coinscollected', target: 100 },
    reward: 100,
    rarity: 'common'
  },
  {
    id: 'survivor',
    name: 'Diamond Survivor',
    description: 'Survive for 5 minutes',
    condition: { type: 'timesurvived', target: 300 },
    reward: 200,
    rarity: 'rare'
  },
  {
    id: 'untouchable',
    name: 'Untouchable',
    description: 'Survive 60 seconds without taking damage',
    condition: { type: 'nodamagetaken', target: 60 },
    reward: 500,
    rarity: 'epic'
  },
  {
    id: 'evolution_master',
    name: 'Evolution Master',
    description: 'Reach the final evolution stage',
    condition: { type: 'evolutionreached', target: 4 },
    reward: 1000,
    rarity: 'legendary'
  },
  {
    id: 'high_roller',
    name: 'High Roller',
    description: 'Score 100,000 points',
    condition: { type: 'scorereached', target: 100000 },
    reward: 750,
    rarity: 'epic'
  },
  {
    id: 'enemy_slayer',
    name: 'Enemy Slayer',
    description: 'Defeat 500 enemies',
    condition: { type: 'enemiesdefeated', target: 500 },
    reward: 300,
    rarity: 'rare'
  }
] as const;

export const CONTROLS_CONFIG = {
  DEFAULT: {
    moveLeft: 'KeyA',
    moveRight: 'KeyD',
    jump: 'Space',
    use: 'KeyE'
  },
  ALTERNATIVE: {
    moveLeft: 'ArrowLeft',
    moveRight: 'ArrowRight',
    jump: 'ArrowUp',
    use: 'Enter'
  }
} as const;

export const AUDIO_CONFIG = {
  MASTER_VOLUME: 0.7,
  MUSIC_VOLUME: 0.5,
  SFX_VOLUME: 0.8,
  SOUNDS: {
    JUMP: '/sounds/jump.mp3',
    COIN_COLLECT: '/sounds/coin.mp3',
    ENEMY_HIT: '/sounds/hit.mp3',
    POWERUP_COLLECT: '/sounds/powerup.mp3',
    EVOLUTION: '/sounds/evolution.mp3',
    DEATH: '/sounds/death.mp3',
    BACKGROUND_MUSIC: '/sounds/background.mp3',
    MENU_MUSIC: '/sounds/menu.mp3'
  }
} as const;

export const WEB3_CONFIG = {
  REKT_TOKEN_ADDRESS: '0x...', // Replace with actual contract address
  CHAIN_ID: 1, // Ethereum mainnet
  REQUIRED_NETWORK: 'ethereum',
  GAS_LIMIT: 300000,
  LEADERBOARD_UPDATE_INTERVAL: 60000, // 1 minute
  SCORE_VERIFICATION_THRESHOLD: 10000
} as const;

export const UI_CONFIG = {
  HUD: {
    FADE_DURATION: 300,
    UPDATE_INTERVAL: 100,
    HEALTH_BAR_ANIMATION_SPEED: 0.5
  },
  SHOP: {
    ITEMS_PER_PAGE: 6,
    PURCHASE_COOLDOWN: 1000
  },
  EFFECTS: {
    PARTICLE_COUNT: 50,
    EXPLOSION_PARTICLES: 20,
    COIN_SPARKLE_COUNT: 5
  }
} as const;