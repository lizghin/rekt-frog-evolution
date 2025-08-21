'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FrogCharacter } from '@/components/three/FrogCharacter';
import { Coin } from '@/components/three/Coin';

export function GameScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        shadows
        camera={{ position: [0, 8, 12], fov: 60 }}
        style={{ background: 'radial-gradient(circle, #1a1a2e 0%, #16213e 50%, #0f0f1e 100%)' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight 
            position={[10, 15, 5]} 
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Ground */}
          <mesh receiveShadow position={[0, -0.5, 0]}>
            <boxGeometry args={[20, 1, 20]} />
            <meshStandardMaterial color="#2d3748" />
          </mesh>

          {/* Character */}
          <FrogCharacter position={[0, 1, 0]} />

          {/* Coins */}
          <Coin position={[3, 2, 1]} id="coin1" />
          <Coin position={[-2, 2, -1]} id="coin2" />
          <Coin position={[6, 2, 4]} id="coin3" />
          <Coin position={[-3, 2, -3]} id="coin4" />
          <Coin position={[1, 2, -6]} id="coin5" />

          {/* Camera Controls */}
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            enableRotate={true}
            maxDistance={25}
            minDistance={5}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
