"use client";

export const GAME_CONFIG = {
  world: {
    width: 40,
    depth: 40,
    groundY: 0,
  },
  physics: {
    gravity: -30,
    moveSpeed: 8,
    jumpVelocity: 12,
    friction: 12,
  },
  bounds: {
    minX: -18,
    maxX: 18,
    minZ: -18,
    maxZ: 18,
  },
} as const;

export type GameConfig = typeof GAME_CONFIG;