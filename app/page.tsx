'use client';

import dynamic from 'next/dynamic';

// Динамический импорт игры без SSR
const GameComponent = dynamic(() => import('@/components/game/GameWrapper'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-6xl mb-4 animate-bounce">🐸</div>
        <div className="text-2xl font-bold mb-2">REKT FROG EVOLUTION</div>
        <div className="text-lg">Loading...</div>
      </div>
    </div>
  )
});

export default function HomePage() {
  return <GameComponent />;
}
