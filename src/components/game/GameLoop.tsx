'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/gameStore';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';
import { EnemyType, CoinType, PowerUpType } from '@/types/game';
import { ENEMY_SPAWN_RATES } from '@/lib/constants/gameConfig';

export function GameLoop() {
  const gameTimeRef = useRef(0);
  const lastSpawnTime = useRef({
    enemy: 0,
    coin: 0,
    powerup: 0
  });
  const difficultyRef = useRef(1);
  
  const {
    isPlaying,
    isPaused,
    gameTime,
    level,
    character,
    enemies,
    coins,
    powerUps,
    activePowerUps,
    updateActivePowerUps,
    spawnEnemy,
    spawnCoin,
    spawnPowerUp,
    removeCoin,
    removePowerUp,
    addExperience,
    nextLevel,
    endGame,
    evolveCharacter,
    checkAchievements
  } = useGameStore();

  // Main game loop
  useFrame((state, delta) => {
    if (!isPlaying || isPaused || character.isDead) return;

    gameTimeRef.current += delta;
    
    // Update active powerups
    updateActivePowerUps(delta * 1000);
    
    // Spawn entities
    handleSpawning(delta);
    
    // Update difficulty scaling
    updateDifficulty();
    
    // Clean up old entities
    cleanupEntities();
    
    // Check level progression
    checkLevelProgression();
    
    // Check evolution requirements
    checkEvolutionRequirements();
    
    // Check achievements
    checkAchievements();
    
    // Game over conditions
    checkGameOverConditions();
  });

  const handleSpawning = (delta: number) => {
    const now = gameTimeRef.current;
    
    // Enemy spawning
    if (enemies.length < GAME_CONFIG.SPAWNING.MAX_ENEMIES && 
        now - lastSpawnTime.current.enemy > getEnemySpawnInterval()) {
      spawnRandomEnemy();
      lastSpawnTime.current.enemy = now;
    }
    
    // Coin spawning
    if (coins.length < GAME_CONFIG.SPAWNING.MAX_COINS && 
        now - lastSpawnTime.current.coin > getCoinSpawnInterval()) {
      spawnRandomCoin();
      lastSpawnTime.current.coin = now;
    }
    
    // PowerUp spawning
    if (powerUps.length < GAME_CONFIG.SPAWNING.MAX_POWERUPS && 
        now - lastSpawnTime.current.powerup > getPowerUpSpawnInterval()) {
      spawnRandomPowerUp();
      lastSpawnTime.current.powerup = now;
    }
  };

  const getEnemySpawnInterval = (): number => {
    const baseInterval = 1 / GAME_CONFIG.SPAWNING.ENEMY_BASE_SPAWN_RATE;
    return baseInterval / difficultyRef.current;
  };

  const getCoinSpawnInterval = (): number => {
    const baseInterval = 1 / GAME_CONFIG.SPAWNING.COIN_SPAWN_RATE;
    return baseInterval;
  };

  const getPowerUpSpawnInterval = (): number => {
    const baseInterval = 1 / GAME_CONFIG.SPAWNING.POWERUP_SPAWN_RATE;
    return baseInterval;
  };

  const spawnRandomEnemy = () => {
    const enemyTypes = Object.values(EnemyType);
    const weights = Object.values(ENEMY_SPAWN_RATES);
    const selectedType = getWeightedRandomChoice(enemyTypes, weights);
    
    const spawnPosition = getRandomSpawnPosition();
    spawnEnemy(selectedType, spawnPosition);
  };

  const spawnRandomCoin = () => {
    const coinTypes = Object.values(CoinType);
    const weights = [60, 20, 15, 5]; // Weighted by rarity
    const selectedType = getWeightedRandomChoice(coinTypes, weights);
    
    const spawnPosition = getRandomSpawnPosition();
    spawnCoin(selectedType, spawnPosition);
  };

  const spawnRandomPowerUp = () => {
    const powerUpTypes = Object.values(PowerUpType);
    const weights = [5, 15, 25, 20, 5, 30]; // Based on rarity
    const selectedType = getWeightedRandomChoice(powerUpTypes, weights);
    
    const spawnPosition = getRandomSpawnPosition();
    spawnPowerUp(selectedType, spawnPosition);
  };

  const getWeightedRandomChoice = <T>(items: T[], weights: number[]): T => {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }
    
    return items[items.length - 1];
  };

  const getRandomSpawnPosition = () => {
    const playerX = character.position.x;
    const playerZ = character.position.z;
    
    // Spawn within game world bounds but not too close to player
    const minDistance = 5;
    const maxDistance = 15;
    const angle = Math.random() * Math.PI * 2;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    
    const x = playerX + Math.cos(angle) * distance;
    const z = playerZ + Math.sin(angle) * distance;
    
    // Clamp to world bounds
    const clampedX = Math.max(-GAME_CONFIG.WORLD.WIDTH / 2, 
                             Math.min(GAME_CONFIG.WORLD.WIDTH / 2, x));
    const clampedZ = Math.max(-GAME_CONFIG.WORLD.DEPTH / 2, 
                             Math.min(GAME_CONFIG.WORLD.DEPTH / 2, z));
    
    return {
      x: clampedX,
      y: GAME_CONFIG.WORLD.GROUND_LEVEL + 1,
      z: clampedZ
    };
  };

  const updateDifficulty = () => {
    const timeFactor = gameTimeRef.current / GAME_CONFIG.DIFFICULTY.LEVEL_DURATION;
    const levelFactor = level - 1;
    
    difficultyRef.current = Math.min(
      1 + (timeFactor + levelFactor) * GAME_CONFIG.DIFFICULTY.SCALE_FACTOR,
      GAME_CONFIG.DIFFICULTY.MAX_DIFFICULTY
    );
  };

  const cleanupEntities = () => {
    const now = Date.now();
    
    // Remove old coins
    coins.forEach(coin => {
      if (now - coin.spawnTime > 45000) { // 45 seconds lifetime
        removeCoin(coin.id);
      }
    });
    
    // Remove old powerups
    powerUps.forEach(powerUp => {
      if (now - powerUp.spawnTime > 30000) { // 30 seconds lifetime
        removePowerUp(powerUp.id);
      }
    });
  };

  const checkLevelProgression = () => {
    const timeForNextLevel = level * GAME_CONFIG.DIFFICULTY.LEVEL_DURATION;
    
    if (gameTimeRef.current >= timeForNextLevel) {
      nextLevel();
      addExperience(50); // Bonus experience for completing level
    }
  };

  const checkEvolutionRequirements = () => {
    const nextEvolutionStage = character.evolutionStage + 1;
    const evolutionRequirement = GAME_CONFIG.PLAYER.EVOLUTION_EXP_BASE * Math.pow(1.5, nextEvolutionStage);
    
    if (character.level >= evolutionRequirement && nextEvolutionStage < 5) {
      evolveCharacter();
    }
  };

  const checkGameOverConditions = () => {
    if (character.isDead || character.health <= 0) {
      endGame();
    }
  };

  // Input handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPlaying || isPaused) return;
      
      // This would be handled by the input system
      // For now, we'll just prevent default behavior
      const gameKeys = ['KeyA', 'KeyD', 'Space', 'KeyE'];
      if (gameKeys.includes(event.code)) {
        event.preventDefault();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!isPlaying || isPaused) return;
      
      // Handle key release events
      const gameKeys = ['KeyA', 'KeyD', 'Space', 'KeyE'];
      if (gameKeys.includes(event.code)) {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, isPaused]);

  // Performance monitoring
  useEffect(() => {
    const checkPerformance = () => {
      const entityCount = enemies.length + coins.length + powerUps.length;
      
      if (entityCount > 100) {
        console.warn('High entity count detected:', entityCount);
        // Could implement entity culling or LOD here
      }
    };

    const performanceInterval = setInterval(checkPerformance, 5000);
    
    return () => clearInterval(performanceInterval);
  }, [enemies.length, coins.length, powerUps.length]);

  // Wave system for special events
  useEffect(() => {
    const checkSpecialWaves = () => {
      if (level % 10 === 0 && level > 0) {
        // Boss wave every 10 levels
        triggerBossWave();
      } else if (level % 5 === 0 && level > 0) {
        // Bonus wave every 5 levels
        triggerBonusWave();
      }
    };

    checkSpecialWaves();
  }, [level]);

  const triggerBossWave = () => {
    // Spawn boss enemy
    const bossPosition = getRandomSpawnPosition();
    // spawnBoss(bossPosition); // Would implement boss spawning
    console.log('Boss wave triggered at level', level);
  };

  const triggerBonusWave = () => {
    // Spawn extra coins and powerups
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        spawnRandomCoin();
      }, i * 1000);
    }
    
    setTimeout(() => {
      spawnRandomPowerUp();
    }, 3000);
    
    console.log('Bonus wave triggered at level', level);
  };

  // Magnetic attraction effect for coins (when magnet powerup is active)
  useFrame(() => {
    if (!isPlaying || isPaused) return;
    
    const magnetPowerUp = activePowerUps.find(p => p.type === PowerUpType.PUMP_MAGNET);
    if (magnetPowerUp) {
      const magnetRange = 8.0; // Range of magnetic effect
      
      coins.forEach(coin => {
        const distance = Math.sqrt(
          Math.pow(coin.position.x - character.position.x, 2) +
          Math.pow(coin.position.z - character.position.z, 2)
        );
        
        if (distance <= magnetRange) {
          // Move coin towards player
          const direction = {
            x: character.position.x - coin.position.x,
            z: character.position.z - coin.position.z
          };
          
          const normalizedDirection = {
            x: direction.x / distance,
            z: direction.z / distance
          };
          
          const attractionSpeed = 5.0;
          const newPosition = {
            x: coin.position.x + normalizedDirection.x * attractionSpeed * 0.016,
            y: coin.position.y,
            z: coin.position.z + normalizedDirection.z * attractionSpeed * 0.016
          };
          
          // Update coin position (this would be handled by the coin component)
          // updateCoinPosition(coin.id, newPosition);
        }
      });
    }
  });

  return null; // This component doesn't render anything
}