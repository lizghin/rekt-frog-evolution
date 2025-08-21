'use client';

import { useGameStore } from '@/store/gameStore';

export function GameHUD() {
  const { score, coins, lives } = useGameStore();

  return (
    <div className="absolute top-4 left-4 z-30 bg-black/60 rounded px-4 py-2 text-white space-x-4 pointer-events-none">
      <span>Score: {score}</span>
      <span>Coins: {coins}</span>
      <span>Lives: {lives}</span>
    </div>
  );
}
