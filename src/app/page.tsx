"use client";

import { useState } from 'react';
import { GameScene } from '@/components/game/GameScene';
import { GameHUD } from '@/components/ui/GameHUD';
import { useGameStore } from '@/store/gameStore';

export default function HomePage() {
  const [started, setStarted] = useState(false);
  const { setPaused, paused, reset } = useGameStore();

  const startGame = () => {
    setStarted(true);
    reset();
    setPaused(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <GameScene className="absolute inset-0" />
      <GameHUD />
      {!started || paused ? (
        <div className="absolute inset-0 flex items-center justify-center z-40">
          <button
            onClick={startGame}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
          >
            {started ? 'Resume' : 'Start Game'}
          </button>
        </div>
      ) : null}
    </div>
  );
}