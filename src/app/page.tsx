'use client';

import { useEffect } from 'react';
import { GameScene } from '@/components/game/GameScene';
import { GameHUD } from '@/components/ui/GameHUD';
import { useGameStore } from '@/store/gameStore';

export default function HomePage() {
  const { isPlaying, isPaused, startGame, pauseGame, resumeGame } = useGameStore();

  // Handle ESC key for pause/resume
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape' && isPlaying) {
        if (isPaused) {
          resumeGame();
        } else {
          pauseGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, pauseGame, resumeGame]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* 3D Game Scene - Always rendered */}
      <GameScene className="absolute inset-0" />

      {/* Game HUD - Only shown during gameplay */}
      {isPlaying && <GameHUD />}

      {/* Main Menu */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="max-w-2xl w-full mx-4">
            <div className="text-center mb-8">
              {/* Game Logo */}
              <div className="mb-6">
                <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                  REKT FROG
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  EVOLUTION
                </h2>
                <p className="text-gray-400 text-lg">
                  The Ultimate Web3 Survival Game
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Start Game Button */}
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 
                         hover:from-green-600 hover:to-blue-600 
                         text-white font-bold py-4 px-8 rounded-lg text-xl
                         transition-all duration-300 transform hover:scale-105"
              >
                START GAME
              </button>

              {/* Game Info */}
              <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-gray-500/30">
                <h3 className="text-white font-bold mb-2">🎮 How to Play</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Use A/D keys to move left/right</li>
                  <li>• Press SPACE to jump</li>
                  <li>• Collect coins to increase your score</li>
                  <li>• Press ESC to pause/resume</li>
                </ul>
              </div>

              {/* Web3 Features (stub) */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 
                            border border-yellow-500/50 rounded-lg p-4">
                <h3 className="text-yellow-400 font-bold mb-2">💰 Web3 Features</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Earn real $REKT tokens while playing</li>
                  <li>• Purchase power-ups with crypto</li>
                  <li>• Compete in leaderboards</li>
                  <li>• Trade achievements as NFTs</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>Built with Next.js, Three.js, and Web3 • Press ESC to pause during gameplay</p>
              <p className="mt-2">
                🐸 Survive the crypto chaos and evolve into the ultimate diamond-handed frog! 💎
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}