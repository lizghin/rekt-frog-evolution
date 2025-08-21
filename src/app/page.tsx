'use client';

import { useGameStore } from '@/store/gameStore';
import { GameScene } from '@/components/game/GameScene';
import { GameHUD } from '@/components/ui/GameHUD';

export default function HomePage() {
  const { isPlaying, startGame } = useGameStore();

  return (
    <main className="relative w-screen h-screen bg-black">
      {/* always render scene */}
      <GameScene className="absolute inset-0" />

      {/* hud when playing */}
      {isPlaying && <GameHUD />}

      {/* start menu */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
          <button
            onClick={startGame}
            className="px-8 py-4 rounded-lg bg-green-600 text-white text-2xl hover:bg-green-700"
          >
            START GAME
          </button>
        </div>
      )}
    </main>
  );
}