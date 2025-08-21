'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FrogCharacter } from '@/components/three/FrogCharacter';
import { Coin } from '@/components/three/Coin';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';

export function GameScene({ className }: { className?: string }) {
  const halfW = GAME_CONFIG.world.width / 2;
  const halfD = GAME_CONFIG.world.depth / 2;

  return (
    <div className={className}>
      <Canvas shadows camera={{ position: [0, 10, 16], fov: 55 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />

          <FrogCharacter position={[0, 1, 0]} />

          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, GAME_CONFIG.world.groundY, 0]}>
            <planeGeometry args={[GAME_CONFIG.world.width, GAME_CONFIG.world.depth]} />
            <meshStandardMaterial color="#2d3748" />
          </mesh>

          <Coin position={[0, 1.2, 0]} />
          <Coin position={[halfW - 3, 1.2, halfD - 3]} />
          <Coin position={[-halfW + 3, 1.2, halfD - 3]} />
          <Coin position={[halfW - 3, 1.2, -halfD + 3]} />
          <Coin position={[-halfW + 3, 1.2, -halfD + 3]} />

          <OrbitControls enablePan={false} enableRotate enableZoom />
        </Suspense>
      </Canvas>
    </div>
  );
}
