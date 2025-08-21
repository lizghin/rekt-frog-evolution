import { GAME_CONFIG } from '@/lib/constants/gameConfig';

export function useCollisions() {
  const checkGroundCollision = (position: [number, number, number]): boolean => {
    return position[1] <= GAME_CONFIG.WORLD.GROUND_LEVEL + 1;
  };

  const checkWorldBounds = (position: [number, number, number]): [number, number, number] => {
    const worldBounds = GAME_CONFIG.WORLD.WIDTH / 2;
    const clampedPosition: [number, number, number] = [...position];
    
    if (clampedPosition[0] < -worldBounds) {
      clampedPosition[0] = -worldBounds;
    } else if (clampedPosition[0] > worldBounds) {
      clampedPosition[0] = worldBounds;
    }
    
    return clampedPosition;
  };

  return {
    checkGroundCollision,
    checkWorldBounds
  };
}