'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export function GameHUD() {
  const { 
    score, 
    lives, 
    coinsCollected, 
    totalCoins, 
    isPaused, 
    isPlaying,
    togglePause 
  } = useGameStore();

  // Handle ESC key for pause
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape' && isPlaying) {
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, togglePause]);

  if (!isPlaying) return null;

  return (
    <>
      {/* Main HUD */}
      <div className="fixed top-4 left-4 right-4 z-30 pointer-events-none">
        <div className="flex justify-between items-start">
          {/* Left side - Score and Lives */}
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 text-lg">💰</span>
                <span className="text-white font-bold text-lg">
                  {score.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-400 text-lg">❤️</span>
                <div className="flex space-x-1">
                  {Array.from({ length: lives }, (_, i) => (
                    <span key={i} className="text-red-400">❤️</span>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - lives) }, (_, i) => (
                    <span key={i} className="text-gray-600">🖤</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Coins */}
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 text-lg">🪙</span>
              <span className="text-white font-bold text-lg">
                {coinsCollected}/{totalCoins}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls hint */}
      <div className="fixed bottom-4 left-4 z-30 pointer-events-none">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <div className="text-white text-sm space-y-1">
            <div><strong>WASD</strong> - Move</div>
            <div><strong>SPACE</strong> - Jump</div>
            <div><strong>ESC</strong> - Pause</div>
          </div>
        </div>
      </div>

      {/* Pause overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 pointer-events-auto">
          <div className="bg-black/80 rounded-lg p-8 border border-white/20 text-center max-w-md">
            <h2 className="text-white text-4xl font-bold mb-4">⏸️ PAUSED</h2>
            <p className="text-gray-300 mb-6">
              Press <strong>ESC</strong> to resume the game
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div>Score: {score.toLocaleString()}</div>
              <div>Coins: {coinsCollected}/{totalCoins}</div>
              <div>Lives: {lives}</div>
            </div>
          </div>
        </div>
      )}

      {/* Collection feedback */}
      {coinsCollected === totalCoins && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-2xl font-bold p-6 rounded-lg animate-bounce">
            🎉 ALL COINS COLLECTED! 🎉
          </div>
        </div>
      )}
    </>
  );
}