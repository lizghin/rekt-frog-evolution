'use client';

import { useEffect } from 'react';
import { GameScene } from '@/components/game/GameScene';
import { GameHUD } from '@/components/ui/GameHUD';
import { useGameStore } from '@/store/gameStore';

export default function HomePage() {
  const { isGameStarted, isPaused, startGame, togglePause, resetGame } = useGameStore();

  // Handle ESC key for pause
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isGameStarted) {
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGameStarted, togglePause]);

  // Main menu
  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 flex items-center justify-center">
        <div className="bg-white bg-opacity-90 p-12 rounded-2xl shadow-2xl max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
            🐸 Frog Evolution
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Collect coins and evolve your frog!
          </p>
          
          <div className="space-y-4">
            <button
              onClick={startGame}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Game
            </button>
            
            <div className="border-t pt-4 mt-6">
              <h3 className="font-semibold text-gray-700 mb-2">How to Play:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use WASD to move around</li>
                <li>• Press SPACE to jump</li>
                <li>• Collect coins to increase your score</li>
                <li>• Press ESC to pause the game</li>
                <li>• Use mouse to rotate camera</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game view
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <GameScene />
      <GameHUD />
    </div>
  );
}