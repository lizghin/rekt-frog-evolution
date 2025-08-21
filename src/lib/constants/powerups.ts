import { PowerUpType, EffectType } from '@/types/game';

export const POWERUP_CONFIGS = {
  [PowerUpType.UNREKT_BOMB]: {
    name: 'Unrekt Bomb',
    description: 'Destroys all enemies on screen and deals massive damage',
    icon: '💣',
    color: '#FF4500',
    modelPath: '/models/powerups/unrekt-bomb.glb',
    rarity: 'epic',
    effect: {
      type: EffectType.DAMAGE_BOOST,
      value: 999,
      duration: 0,
      isStackable: false
    },
    abilities: ['screen_clear', 'instant_kill'],
    spawnWeight: 5,
    price: 100,
    sounds: {
      spawn: '/sounds/powerups/bomb-spawn.mp3',
      collect: '/sounds/powerups/bomb-collect.mp3',
      activate: '/sounds/powerups/bomb-explode.mp3'
    },
    particles: {
      spawn: 'fire_sparkle',
      collect: 'explosion_small',
      activate: 'mega_explosion'
    },
    visualEffects: {
      screenShake: true,
      flashEffect: true,
      slowMotion: { duration: 1000, factor: 0.3 }
    }
  },

  [PowerUpType.LEDGER_SHIELD]: {
    name: 'Ledger Shield',
    description: 'Provides temporary invulnerability against all damage',
    icon: '🛡️',
    color: '#4169E1',
    modelPath: '/models/powerups/ledger-shield.glb',
    rarity: 'rare',
    effect: {
      type: EffectType.SHIELD,
      value: 1,
      duration: 15000,
      isStackable: false
    },
    abilities: ['damage_immunity', 'knockback_resistance'],
    spawnWeight: 15,
    price: 150,
    sounds: {
      spawn: '/sounds/powerups/shield-spawn.mp3',
      collect: '/sounds/powerups/shield-collect.mp3',
      activate: '/sounds/powerups/shield-activate.mp3',
      block: '/sounds/powerups/shield-block.mp3',
      expire: '/sounds/powerups/shield-expire.mp3'
    },
    particles: {
      spawn: 'blue_sparkle',
      collect: 'shield_aura',
      activate: 'protective_barrier',
      block: 'deflection',
      expire: 'dissipation'
    },
    visualEffects: {
      playerAura: true,
      auraColor: '#4169E1',
      auraIntensity: 0.7
    }
  },

  [PowerUpType.MOON_LEAP]: {
    name: 'Moon Leap',
    description: 'Dramatically increases jump height and grants double jump',
    icon: '🌙',
    color: '#FFD700',
    modelPath: '/models/powerups/moon-leap.glb',
    rarity: 'common',
    effect: {
      type: EffectType.JUMP_BOOST,
      value: 2.5,
      duration: 10000,
      isStackable: false
    },
    abilities: ['super_jump', 'double_jump', 'reduced_fall_damage'],
    spawnWeight: 25,
    price: 75,
    sounds: {
      spawn: '/sounds/powerups/moon-spawn.mp3',
      collect: '/sounds/powerups/moon-collect.mp3',
      activate: '/sounds/powerups/moon-activate.mp3',
      jump: '/sounds/powerups/moon-jump.mp3'
    },
    particles: {
      spawn: 'moon_dust',
      collect: 'lunar_sparkle',
      activate: 'anti_gravity',
      jump: 'moon_trail'
    },
    visualEffects: {
      playerGlow: true,
      glowColor: '#FFD700',
      jumpTrail: true
    }
  },

  [PowerUpType.PUMP_MAGNET]: {
    name: 'Pump Magnet',
    description: 'Automatically attracts all coins and increases their value',
    icon: '🧲',
    color: '#32CD32',
    modelPath: '/models/powerups/pump-magnet.glb',
    rarity: 'rare',
    effect: {
      type: EffectType.COIN_MAGNET,
      value: 1.5,
      duration: 20000,
      isStackable: true
    },
    abilities: ['coin_attraction', 'value_multiplier', 'auto_collect'],
    spawnWeight: 20,
    price: 125,
    magnetRange: 8.0,
    valueMultiplier: 1.5,
    sounds: {
      spawn: '/sounds/powerups/magnet-spawn.mp3',
      collect: '/sounds/powerups/magnet-collect.mp3',
      activate: '/sounds/powerups/magnet-activate.mp3',
      attract: '/sounds/powerups/magnet-attract.mp3'
    },
    particles: {
      spawn: 'magnetic_field',
      collect: 'energy_surge',
      activate: 'magnetic_aura',
      attract: 'coin_stream'
    },
    visualEffects: {
      magneticField: true,
      fieldRadius: 8.0,
      pulseEffect: true
    }
  },

  [PowerUpType.DIAMOND_HANDS]: {
    name: 'Diamond Hands',
    description: 'Prevents losing coins on damage and grants damage resistance',
    icon: '💎',
    color: '#B9F2FF',
    modelPath: '/models/powerups/diamond-hands.glb',
    rarity: 'legendary',
    effect: {
      type: EffectType.DAMAGE_BOOST,
      value: 0.5,
      duration: 30000,
      isStackable: false
    },
    abilities: ['coin_protection', 'damage_reduction', 'status_immunity'],
    spawnWeight: 5,
    price: 200,
    damageReduction: 0.5,
    coinProtection: true,
    sounds: {
      spawn: '/sounds/powerups/diamond-spawn.mp3',
      collect: '/sounds/powerups/diamond-collect.mp3',
      activate: '/sounds/powerups/diamond-activate.mp3',
      resist: '/sounds/powerups/diamond-resist.mp3'
    },
    particles: {
      spawn: 'diamond_sparkle',
      collect: 'crystal_formation',
      activate: 'diamond_aura',
      resist: 'crystal_deflection'
    },
    visualEffects: {
      playerCrystals: true,
      crystalColor: '#B9F2FF',
      damageIndicator: false
    }
  },

  [PowerUpType.SPEED_BOOST]: {
    name: 'Speed Boost',
    description: 'Significantly increases movement speed and agility',
    icon: '⚡',
    color: '#FFFF00',
    modelPath: '/models/powerups/speed-boost.glb',
    rarity: 'common',
    effect: {
      type: EffectType.SPEED_BOOST,
      value: 2.0,
      duration: 8000,
      isStackable: true
    },
    abilities: ['super_speed', 'dash', 'afterimage'],
    spawnWeight: 30,
    price: 50,
    speedMultiplier: 2.0,
    maxStacks: 3,
    sounds: {
      spawn: '/sounds/powerups/speed-spawn.mp3',
      collect: '/sounds/powerups/speed-collect.mp3',
      activate: '/sounds/powerups/speed-activate.mp3',
      dash: '/sounds/powerups/speed-dash.mp3'
    },
    particles: {
      spawn: 'lightning_sparkle',
      collect: 'energy_burst',
      activate: 'speed_aura',
      movement: 'motion_blur'
    },
    visualEffects: {
      speedLines: true,
      afterimage: true,
      energyTrail: true
    }
  }
} as const;

export const POWERUP_COMBINATIONS = {
  SPEED_JUMP: {
    powerups: [PowerUpType.SPEED_BOOST, PowerUpType.MOON_LEAP],
    name: 'Rocket Frog',
    description: 'Combining speed and jump creates the ultimate mobility',
    bonus: {
      type: EffectType.SPEED_BOOST,
      value: 0.5,
      duration: 5000
    },
    particles: 'rocket_trail'
  },
  SHIELD_DIAMOND: {
    powerups: [PowerUpType.LEDGER_SHIELD, PowerUpType.DIAMOND_HANDS],
    name: 'Fortress Mode',
    description: 'Ultimate defense with extended shield duration',
    bonus: {
      type: EffectType.SHIELD,
      value: 1,
      duration: 10000
    },
    particles: 'fortress_aura'
  },
  MAGNET_BOMB: {
    powerups: [PowerUpType.PUMP_MAGNET, PowerUpType.UNREKT_BOMB],
    name: 'Wealth Destroyer',
    description: 'Collect all coins before obliterating enemies',
    bonus: {
      type: EffectType.COIN_MAGNET,
      value: 2.0,
      duration: 3000
    },
    particles: 'wealth_explosion'
  }
} as const;

export const POWERUP_SPAWN_RULES = {
  MIN_DISTANCE_FROM_PLAYER: 5.0,
  MAX_DISTANCE_FROM_PLAYER: 15.0,
  MIN_DISTANCE_FROM_ENEMIES: 3.0,
  SPAWN_HEIGHT_RANGE: { min: 1.0, max: 5.0 },
  LIFETIME: 30000, // 30 seconds before despawn
  DESPAWN_WARNING_TIME: 5000, // Flash for last 5 seconds
  
  RARITY_WEIGHTS: {
    common: 60,
    rare: 25,
    epic: 12,
    legendary: 3
  },

  LEVEL_SCALING: {
    spawnRateIncrease: 0.001, // Increase spawn rate by 0.1% per level
    rarityBonus: 0.005 // Increase rare powerup chance by 0.5% per level
  }
} as const;

export const POWERUP_VISUAL_EFFECTS = {
  FLOATING_ANIMATION: {
    amplitude: 0.5,
    frequency: 2.0,
    rotationSpeed: 45 // degrees per second
  },
  
  COLLECTION_EFFECT: {
    duration: 1000,
    particles: 50,
    sparkleIntensity: 0.8
  },
  
  ACTIVATION_EFFECT: {
    screenFlash: true,
    flashDuration: 200,
    particleBurst: true
  },
  
  DURATION_WARNING: {
    flashInterval: 500, // Flash every 500ms when about to expire
    warningTime: 3000 // Start warning 3 seconds before expiry
  }
} as const;

export const POWERUP_SHOP_CONFIG = {
  CATEGORIES: {
    COMBAT: [PowerUpType.UNREKT_BOMB, PowerUpType.LEDGER_SHIELD, PowerUpType.DIAMOND_HANDS],
    MOBILITY: [PowerUpType.MOON_LEAP, PowerUpType.SPEED_BOOST],
    UTILITY: [PowerUpType.PUMP_MAGNET]
  },
  
  DAILY_DEALS: {
    count: 2,
    discountRange: { min: 0.2, max: 0.5 },
    resetHour: 0 // Reset at midnight UTC
  },
  
  BUNDLE_OFFERS: [
    {
      name: 'Starter Pack',
      items: [PowerUpType.SPEED_BOOST, PowerUpType.MOON_LEAP],
      price: 100, // 25 tokens discount
      discount: 0.2
    },
    {
      name: 'Defense Bundle',
      items: [PowerUpType.LEDGER_SHIELD, PowerUpType.DIAMOND_HANDS],
      price: 280, // 70 tokens discount
      discount: 0.2
    },
    {
      name: 'Ultimate Pack',
      items: Object.values(PowerUpType),
      price: 450, // 250 tokens discount
      discount: 0.35
    }
  ]
} as const;