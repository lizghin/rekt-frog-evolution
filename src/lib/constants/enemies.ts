import { EnemyType, MovePattern, EnemyBehavior } from '@/types/game';

export const ENEMY_CONFIGS = {
  [EnemyType.RUG_PULL]: {
    name: 'Rug Pull',
    description: 'Sneaky trap that appears as a safe platform but collapses when stepped on',
    health: 1,
    damage: 25,
    speed: 0,
    size: 2.0,
    color: '#8B4513',
    modelPath: '/models/enemies/rugpull.glb',
    behavior: {
      patrolRadius: 0,
      attackRange: 2.5,
      aggroRange: 3.0,
      movePattern: MovePattern.STATIONARY,
      attackCooldown: 0
    } as EnemyBehavior,
    abilities: ['trap_activation', 'area_damage'],
    spawnWeight: 40,
    scoreValue: 25,
    dropChance: 0.1,
    sounds: {
      spawn: '/sounds/enemies/rugpull-spawn.mp3',
      activate: '/sounds/enemies/rugpull-activate.mp3',
      destroy: '/sounds/enemies/rugpull-destroy.mp3'
    },
    particles: {
      spawn: 'dust',
      activate: 'explosion',
      destroy: 'debris'
    }
  },

  [EnemyType.BEAR_BOT]: {
    name: 'Bear Bot',
    description: 'Aggressive trading bot that spreads FUD and chases players relentlessly',
    health: 75,
    damage: 30,
    speed: 3.5,
    size: 1.8,
    color: '#8B0000',
    modelPath: '/models/enemies/bearbot.glb',
    behavior: {
      patrolRadius: 8.0,
      attackRange: 2.0,
      aggroRange: 10.0,
      movePattern: MovePattern.CHASE,
      attackCooldown: 1500
    } as EnemyBehavior,
    abilities: ['charge_attack', 'fud_spread'],
    spawnWeight: 30,
    scoreValue: 75,
    dropChance: 0.15,
    sounds: {
      spawn: '/sounds/enemies/bearbot-spawn.mp3',
      move: '/sounds/enemies/bearbot-move.mp3',
      attack: '/sounds/enemies/bearbot-attack.mp3',
      destroy: '/sounds/enemies/bearbot-destroy.mp3'
    },
    particles: {
      spawn: 'smoke',
      move: 'sparks',
      attack: 'red_energy',
      destroy: 'explosion'
    }
  },

  [EnemyType.PUMP_DUMP]: {
    name: 'Pump & Dump',
    description: 'Volatile enemy that rapidly changes between beneficial and harmful states',
    health: 50,
    damage: 40,
    speed: 2.0,
    size: 1.5,
    color: '#FFD700',
    modelPath: '/models/enemies/pumpdump.glb',
    behavior: {
      patrolRadius: 6.0,
      attackRange: 3.0,
      aggroRange: 8.0,
      movePattern: MovePattern.ZIGZAG,
      attackCooldown: 2000
    } as EnemyBehavior,
    abilities: ['phase_shift', 'value_manipulation'],
    spawnWeight: 15,
    scoreValue: 100,
    dropChance: 0.2,
    sounds: {
      spawn: '/sounds/enemies/pumpdump-spawn.mp3',
      pump: '/sounds/enemies/pumpdump-pump.mp3',
      dump: '/sounds/enemies/pumpdump-dump.mp3',
      destroy: '/sounds/enemies/pumpdump-destroy.mp3'
    },
    particles: {
      spawn: 'golden_sparkle',
      pump: 'green_energy',
      dump: 'red_energy',
      destroy: 'gold_explosion'
    },
    phases: {
      pump: {
        duration: 3000,
        speedMultiplier: 0.5,
        damageMultiplier: 0.5,
        color: '#00FF00'
      },
      dump: {
        duration: 2000,
        speedMultiplier: 2.0,
        damageMultiplier: 2.0,
        color: '#FF0000'
      }
    }
  },

  [EnemyType.WHALE_CRUSHER]: {
    name: 'Whale Crusher',
    description: 'Massive enemy that creates market-moving attacks and area damage',
    health: 200,
    damage: 60,
    speed: 1.5,
    size: 3.0,
    color: '#000080',
    modelPath: '/models/enemies/whalecrush.glb',
    behavior: {
      patrolRadius: 12.0,
      attackRange: 5.0,
      aggroRange: 15.0,
      movePattern: MovePattern.PATROL,
      attackCooldown: 3000
    } as EnemyBehavior,
    abilities: ['market_crash', 'area_slam', 'price_manipulation'],
    spawnWeight: 10,
    scoreValue: 200,
    dropChance: 0.3,
    sounds: {
      spawn: '/sounds/enemies/whale-spawn.mp3',
      move: '/sounds/enemies/whale-move.mp3',
      attack: '/sounds/enemies/whale-attack.mp3',
      slam: '/sounds/enemies/whale-slam.mp3',
      destroy: '/sounds/enemies/whale-destroy.mp3'
    },
    particles: {
      spawn: 'water_splash',
      move: 'ripples',
      attack: 'tsunami',
      slam: 'shockwave',
      destroy: 'massive_explosion'
    }
  },

  [EnemyType.FUD_SPREADER]: {
    name: 'FUD Spreader',
    description: 'Elusive enemy that creates fear zones and debuffs the player',
    health: 30,
    damage: 20,
    speed: 4.5,
    size: 1.2,
    color: '#800080',
    modelPath: '/models/enemies/fudspreader.glb',
    behavior: {
      patrolRadius: 15.0,
      attackRange: 8.0,
      aggroRange: 12.0,
      movePattern: MovePattern.WANDER,
      attackCooldown: 1000
    } as EnemyBehavior,
    abilities: ['fear_aura', 'speed_debuff', 'teleport'],
    spawnWeight: 5,
    scoreValue: 150,
    dropChance: 0.25,
    sounds: {
      spawn: '/sounds/enemies/fud-spawn.mp3',
      move: '/sounds/enemies/fud-move.mp3',
      teleport: '/sounds/enemies/fud-teleport.mp3',
      aura: '/sounds/enemies/fud-aura.mp3',
      destroy: '/sounds/enemies/fud-destroy.mp3'
    },
    particles: {
      spawn: 'dark_smoke',
      move: 'shadow_trail',
      teleport: 'purple_portal',
      aura: 'fear_waves',
      destroy: 'shadow_explosion'
    },
    fearAura: {
      radius: 5.0,
      slowEffect: 0.5,
      damageOverTime: 5
    }
  }
} as const;

export const ENEMY_SPAWN_PATTERNS = {
  EARLY_GAME: {
    maxLevel: 5,
    spawnRates: {
      [EnemyType.RUG_PULL]: 0.6,
      [EnemyType.BEAR_BOT]: 0.4,
      [EnemyType.PUMP_DUMP]: 0.0,
      [EnemyType.WHALE_CRUSHER]: 0.0,
      [EnemyType.FUD_SPREADER]: 0.0
    }
  },
  MID_GAME: {
    maxLevel: 15,
    spawnRates: {
      [EnemyType.RUG_PULL]: 0.4,
      [EnemyType.BEAR_BOT]: 0.35,
      [EnemyType.PUMP_DUMP]: 0.2,
      [EnemyType.WHALE_CRUSHER]: 0.05,
      [EnemyType.FUD_SPREADER]: 0.0
    }
  },
  LATE_GAME: {
    maxLevel: 30,
    spawnRates: {
      [EnemyType.RUG_PULL]: 0.3,
      [EnemyType.BEAR_BOT]: 0.25,
      [EnemyType.PUMP_DUMP]: 0.25,
      [EnemyType.WHALE_CRUSHER]: 0.15,
      [EnemyType.FUD_SPREADER]: 0.05
    }
  },
  END_GAME: {
    maxLevel: 999,
    spawnRates: {
      [EnemyType.RUG_PULL]: 0.2,
      [EnemyType.BEAR_BOT]: 0.2,
      [EnemyType.PUMP_DUMP]: 0.3,
      [EnemyType.WHALE_CRUSHER]: 0.2,
      [EnemyType.FUD_SPREADER]: 0.1
    }
  }
} as const;

export const BOSS_CONFIGS = {
  MEGA_WHALE: {
    name: 'Mega Whale',
    description: 'The ultimate market manipulator that appears every 10 levels',
    health: 500,
    damage: 80,
    speed: 2.0,
    size: 5.0,
    color: '#001122',
    modelPath: '/models/bosses/megawhale.glb',
    abilities: ['market_tsunami', 'mass_liquidation', 'price_crash'],
    spawnCondition: { type: 'level_multiple', value: 10 },
    scoreValue: 1000,
    dropChance: 0.8,
    phases: [
      {
        healthThreshold: 1.0,
        abilities: ['market_tsunami'],
        speedMultiplier: 1.0
      },
      {
        healthThreshold: 0.6,
        abilities: ['market_tsunami', 'mass_liquidation'],
        speedMultiplier: 1.2
      },
      {
        healthThreshold: 0.3,
        abilities: ['market_tsunami', 'mass_liquidation', 'price_crash'],
        speedMultiplier: 1.5
      }
    ]
  }
} as const;

export const ENEMY_AI_STATES = {
  IDLE: 'idle',
  PATROL: 'patrol',
  CHASE: 'chase',
  ATTACK: 'attack',
  RETREAT: 'retreat',
  STUNNED: 'stunned',
  DEAD: 'dead'
} as const;

export const ENEMY_ANIMATIONS = {
  [EnemyType.RUG_PULL]: {
    idle: 'idle',
    activate: 'activate',
    destroy: 'destroy'
  },
  [EnemyType.BEAR_BOT]: {
    idle: 'idle',
    walk: 'walk',
    run: 'run',
    attack: 'attack',
    hit: 'hit',
    death: 'death'
  },
  [EnemyType.PUMP_DUMP]: {
    idle: 'idle',
    move: 'move',
    pump: 'pump',
    dump: 'dump',
    transform: 'transform',
    death: 'death'
  },
  [EnemyType.WHALE_CRUSHER]: {
    idle: 'idle',
    swim: 'swim',
    slam: 'slam',
    roar: 'roar',
    hit: 'hit',
    death: 'death'
  },
  [EnemyType.FUD_SPREADER]: {
    idle: 'idle',
    float: 'float',
    teleport: 'teleport',
    cast: 'cast',
    vanish: 'vanish'
  }
} as const;