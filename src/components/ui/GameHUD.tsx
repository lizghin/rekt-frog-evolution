'use client';

import { useGameStore } from '@/store/gameStore';

export function GameHUD() {
  const { score, coins, lives } = useGameStore();

  return (
    <div className="fixed top-0 left-0 right-0 p-4 z-40 pointer-events-none">
      <div className="flex justify-between items-start">
        {/* Left side - Score and Coins */}
        <div className="bg-black bg-opacity-70 text-white p-4 rounded-lg pointer-events-auto">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-xl">⭐</span>
              <span className="text-xl font-bold">Score: {score}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-xl">🪙</span>
              <span className="text-xl font-bold">Coins: {coins}</span>
            </div>
          </div>
        </div>

        {/* Right side - Lives */}
        <div className="bg-black bg-opacity-70 text-white p-4 rounded-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-xl">❤️</span>
            <span className="text-xl font-bold">Lives: {lives}</span>
          </div>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg pointer-events-auto">
        <div className="text-sm">
          <p>WASD: Move | SPACE: Jump | ESC: Pause</p>
          <p>Mouse: Rotate Camera | Scroll: Zoom</p>
        </div>
      </div>
    </div>
  );
}