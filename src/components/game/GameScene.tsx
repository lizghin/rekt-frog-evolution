'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FrogCharacter } from '@/components/three/FrogCharacter';
import { Coin } from '@/components/three/Coin';
import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';

interface GameSceneProps {
  className?: string;
}

export function GameScene({ className }: GameSceneProps) {
  const togglePause = useGameStore((s) => s.togglePause);

  /* pause / resume with ESC */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Escape') togglePause();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePause]);

  const coinPositions: [number, number, number][] = [
    [2, 1, 0],
    [-2, 1, 0],
    [0, 1, 2],
    [0, 1, -2],
    [0, 1, 0],
  ];

  return (
    <div className={className}>
      <Canvas shadows camera={{ position: [0, 8, 12], fov: 60 }}>
        {/* lights */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        {/* ground */}
        <mesh
          receiveShadow
          position={[0, GAME_CONFIG.WORLD.GROUND_LEVEL - 0.5, 0]}
        >
          <boxGeometry args={[GAME_CONFIG.WORLD.WIDTH, 1, GAME_CONFIG.WORLD.DEPTH]} />
          <meshStandardMaterial color="#222222" />
        </mesh>

        {/* player */}
        <FrogCharacter position={[0, 1, 0]} />

        {/* coins */}
        {coinPositions.map((pos, i) => (
          <Coin key={i} position={pos} id={`coin-${i}`} />
        ))}

        {/* controls */}
        <OrbitControls enablePan={false} enableRotate enableZoom />
      </Canvas>
    </div>
  );
}
