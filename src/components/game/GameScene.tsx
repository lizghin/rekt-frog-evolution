'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { FrogCharacter } from '@/components/three/FrogCharacter';
import { Coin } from '@/components/three/Coin';
import { useGameStore } from '@/store/gameStore';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';
import { useCollisions } from '@/hooks/game/useCollisions';

function Ground() {
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, GAME_CONFIG.WORLD.GROUND_Y, 0]}
      receiveShadow
    >
      <planeGeometry args={[GAME_CONFIG.WORLD.WIDTH, GAME_CONFIG.WORLD.DEPTH]} />
      <meshStandardMaterial color="#8B7355" roughness={0.8} />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
    </>
  );
}

function GameContent() {
  const { isCoinCollected, collectCoin } = useGameStore();
  useCollisions();

  return (
    <>
      <Lights />
      <Ground />
      <FrogCharacter />
      
      {/* Render coins */}
      {GAME_CONFIG.COIN.POSITIONS.map((position, index) => (
        <Coin
          key={`coin-${index}`}
          position={position}
          isCollected={isCoinCollected(index)}
          onCollect={() => collectCoin(index)}
        />
      ))}

      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  );
}

export function GameScene() {
  const { isPaused } = useGameStore();

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{
          fov: GAME_CONFIG.CAMERA.FOV,
          near: GAME_CONFIG.CAMERA.NEAR,
          far: GAME_CONFIG.CAMERA.FAR,
          position: GAME_CONFIG.CAMERA.POSITION,
        }}
        shadows
      >
        <Suspense fallback={null}>
          <GameContent />
        </Suspense>
      </Canvas>
      
      {isPaused && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Game Paused</h2>
            <p className="text-gray-600">Press ESC to resume</p>
          </div>
        </div>
      )}
    </div>
  );
}