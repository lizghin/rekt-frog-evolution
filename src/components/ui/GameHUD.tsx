'use client';

import { useGameStore } from '@/store/gameStore';

export function GameHUD() {
  const { score, coins, lives, isPaused } = useGameStore();

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-auto">
        {/* Left Stats */}
        <div className="bg-black/70 rounded-lg p-4 backdrop-blur-sm border border-gray-500/30">
          <div className="flex items-center space-x-4 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{score.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Score</div>
            </div>
            <div className="w-px h-8 bg-gray-500"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{coins}</div>
              <div className="text-xs text-gray-400">Coins</div>
            </div>
          </div>
        </div>

        {/* Right Stats */}
        <div className="bg-black/70 rounded-lg p-4 backdrop-blur-sm border border-gray-500/30">
          <div className="flex items-center space-x-4 text-white">
            <div className="text-center">
              <div className="flex space-x-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-lg ${i < lives ? 'text-red-500' : 'text-gray-600'}`}
                  >
                    ❤️
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-400">Lives</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto">
          <div className="bg-black/80 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Game Paused</h2>
            <p className="text-gray-300">Press ESC to resume</p>
          </div>
        </div>
      )}

      {/* Game Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3 backdrop-blur-sm border border-gray-500/30 pointer-events-auto">
        <div className="text-white text-sm space-y-1">
          <div><span className="font-bold">A/D</span> - Move</div>
          <div><span className="font-bold">SPACE</span> - Jump</div>
          <div><span className="font-bold">ESC</span> - Pause</div>
        </div>
      </div>
    </div>
  );
}
