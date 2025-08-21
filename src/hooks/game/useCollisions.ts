import { GAME_CONFIG } from '@/lib/constants/gameConfig';

export function clampToWorldBounds(x: number, z: number) {
  const halfW = GAME_CONFIG.WORLD.WIDTH / 2;
  const halfD = GAME_CONFIG.WORLD.DEPTH / 2;
  return {
    x: Math.max(-halfW, Math.min(halfW, x)),
    z: Math.max(-halfD, Math.min(halfD, z)),
  };
}