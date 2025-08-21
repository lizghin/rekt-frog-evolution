"use client";

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export function GameHUD() {
  const { score, coins, lives, paused, togglePause } = useGameStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') togglePause();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePause]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <div className="absolute top-4 left-4 bg-black/70 text-white rounded px-3 py-2 pointer-events-auto">
        <div className="flex gap-4 text-sm">
          <div>Score: <span className="text-yellow-300 font-semibold">{score}</span></div>
          <div>Coins: <span className="text-emerald-300 font-semibold">{coins}</span></div>
          <div>Lives: <span className="text-red-300 font-semibold">{lives}</span></div>
        </div>
      </div>
      {paused && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto">
          <div className="text-white text-xl">Paused (ESC to resume)</div>
        </div>
      )}
    </div>
  );
}
