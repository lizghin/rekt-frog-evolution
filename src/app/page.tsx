'use client';

import { useState, useEffect } from 'react';
import { GameScene } from '@/components/game/GameScene';
import { GameHUD } from '@/components/ui/GameHUD';
import { useGameStore } from '@/store/gameStore';

export default function HomePage() {
  const [showMenu, setShowMenu] = useState(true);

  const {
    isPlaying,
    isGameOver,
    score,
    highScore,
    coinsCollected,
    totalCoins,
    startGame,
    restartGame,
  } = useGameStore();

  useEffect(() => {
    if (isPlaying) {
      setShowMenu(false);
    }
  }, [isPlaying]);

  const handleStartGame = () => {
    startGame();
    setShowMenu(false);
  };

  const handleBackToMenu = () => {
    setShowMenu(true);
  };

  return (
    <div className="relative w-screen h-screen bg-gradient-to-b from-sky-400 to-green-300 overflow-hidden">
      {/* 3D Game Scene - Always rendered */}
      <GameScene className="absolute inset-0" />

      {/* Game HUD - Only shown during gameplay */}
      {isPlaying && <GameHUD />}

      {/* Main Menu */}
      {showMenu && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="max-w-2xl w-full mx-4 text-center">
            {/* Game Logo */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                🐸 FROG GAME
              </h1>
              <p className="text-gray-300 text-lg">
                Collect all the coins and avoid falling off the world!
              </p>
            </div>

            {/* Game Stats */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{highScore.toLocaleString()}</div>
                <div className="text-sm text-gray-400">High Score</div>
              </div>
              {isGameOver && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{coinsCollected}/{totalCoins}</div>
                  <div className="text-sm text-gray-400">Coins Collected</div>
                </div>
              )}
            </div>

            {/* Game Controls */}
            <div className="space-y-4 mb-8">
              {!isGameOver ? (
                <button
                  onClick={handleStartGame}
                  className="w-full max-w-md mx-auto bg-gradient-to-r from-green-500 to-blue-500 
                           hover:from-green-600 hover:to-blue-600 
                           text-white font-bold py-4 px-8 rounded-lg text-xl
                           transition-all duration-300 transform hover:scale-105 block"
                >
                  {isPlaying ? 'RESUME GAME' : 'START GAME'}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center max-w-md mx-auto">
                    <h3 className="text-red-400 font-bold text-xl mb-2">GAME OVER</h3>
                    <p className="text-white text-lg">Final Score: {score.toLocaleString()}</p>
                    {score > 0 && score === highScore && (
                      <p className="text-yellow-400 font-bold">NEW HIGH SCORE!</p>
                    )}
                  </div>
                  <button
                    onClick={restartGame}
                    className="w-full max-w-md mx-auto bg-gradient-to-r from-red-500 to-orange-500 
                             hover:from-red-600 hover:to-orange-600 
                             text-white font-bold py-4 px-8 rounded-lg text-xl
                             transition-all duration-300 transform hover:scale-105 block"
                  >
                    RESTART GAME
                  </button>
                </div>
              )}
            </div>

            {/* Game Instructions */}
            <div className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-gray-500/30 max-w-md mx-auto">
              <h3 className="text-white font-bold mb-4">🎮 How to Play</h3>
              <div className="text-gray-300 text-sm space-y-2 text-left">
                <div><strong>WASD</strong> or <strong>Arrow Keys</strong> - Move around</div>
                <div><strong>SPACE</strong> - Jump</div>
                <div><strong>ESC</strong> - Pause/Resume game</div>
                <div><strong>Mouse</strong> - Rotate camera view</div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="text-yellow-400 font-bold mb-2">🎯 Objective</div>
                <div className="text-gray-300 text-sm">
                  Collect all {totalCoins} golden coins scattered around the world!
                </div>
              </div>
            </div>

            {/* Back to menu button for game over state */}
            {isGameOver && (
              <button
                onClick={handleBackToMenu}
                className="mt-4 text-gray-400 hover:text-white underline"
              >
                Back to Menu
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isPlaying && !showMenu && (
        <div className="absolute bottom-4 right-4 z-30">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2 text-white text-sm">
            Game Running...
          </div>
        </div>
      )}
    </div>
  );
}