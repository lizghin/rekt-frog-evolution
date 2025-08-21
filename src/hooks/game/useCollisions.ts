import { useEffect, useCallback } from 'react';
import { useGameStore, Vector3 } from '@/store/gameStore';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';

export function useCollisions() {
  const {
    playerPosition,
    collectCoin,
    isCoinCollected,
  } = useGameStore();

  // Calculate distance between two 3D points
  const calculateDistance = useCallback((pos1: Vector3, pos2: [number, number, number]) => {
    const dx = pos1.x - pos2[0];
    const dy = pos1.y - pos2[1];
    const dz = pos1.z - pos2[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }, []);

  // Check coin collisions
  const checkCoinCollisions = useCallback(() => {
    GAME_CONFIG.COIN.POSITIONS.forEach((coinPos, index) => {
      if (!isCoinCollected(index)) {
        const distance = calculateDistance(playerPosition, coinPos);
        if (distance < GAME_CONFIG.COIN.COLLECT_DISTANCE) {
          collectCoin(index);
        }
      }
    });
  }, [playerPosition, calculateDistance, collectCoin, isCoinCollected]);

  // Run collision checks
  useEffect(() => {
    checkCoinCollisions();
  }, [playerPosition, checkCoinCollisions]);

  return {
    checkCoinCollisions,
    calculateDistance,
  };
}