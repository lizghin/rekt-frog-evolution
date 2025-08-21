'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export function GameHUD() {
  const [mounted, setMounted] = useState(false);
  
  const {
    score,
    lives,
    level,
    rektTokens,
    character
  } = useGameStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-auto">
        {/* Left Stats */}
        <div className="bg-black/70 rounded-lg p-4 backdrop-blur-sm border border-gray-500/30">
          <div className="flex items-center space-x-4 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{score?.toLocaleString() || 0}</div>
              <div className="text-xs text-gray-400">Score</div>
            </div>
            <div className="w-px h-8 bg-gray-500"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{rektTokens?.toLocaleString() || 0}</div>
              <div className="text-xs text-gray-400">$REKT</div>
            </div>
            <div className="w-px h-8 bg-gray-500"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{level || 1}</div>
              <div className="text-xs text-gray-400">Level</div>
            </div>
          </div>
        </div>

        {/* Right Stats */}
        <div className="bg-black/70 rounded-lg p-4 backdrop-blur-sm border border-gray-500/30">
          <div className="flex items-center space-x-4 text-white">
            {/* Character Info */}
            <div className="text-center">
              <div className="text-2xl">{character?.emoji || '🐸'}</div>
              <div className="text-xs text-gray-400">{character?.name || 'Frog'}</div>
            </div>
            
            <div className="w-px h-8 bg-gray-500"></div>
            
            {/* Lives */}
            <div className="text-center">
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-lg ${i < (lives || 0) ? 'text-red-500' : 'text-gray-600'}`}
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

      {/* Power-ups Display */}
      <div className="absolute top-24 right-4 space-y-2 pointer-events-auto">
        {/* Временно пустой - добавим power-ups позже */}
      </div>

      {/* Mini Map (placeholder) */}
      <div className="absolute bottom-4 right-4 w-32 h-32 bg-black/70 rounded-lg border border-gray-500/30 pointer-events-auto">
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
          Mini Map
        </div>
      </div>

      {/* Game Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3 backdrop-blur-sm border border-gray-500/30 pointer-events-auto">
        <div className="text-white text-sm space-y-1">
          <div><span className="font-bold">A/D</span> - Move</div>
          <div><span className="font-bold">SPACE</span> - Jump</div>
          <div><span className="font-bold">E</span> - Special Ability</div>
          <div><span className="font-bold">ESC</span> - Pause</div>
        </div>
      </div>
    </div>
  );
}

      {/* Menu Button */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <button
          onClick={() => window.location.reload()}
          className="bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-lg border border-gray-500/30"
        >
          🏠 Main Menu
        </button>
      </div>
