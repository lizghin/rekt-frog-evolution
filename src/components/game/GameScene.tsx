'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { FrogCharacter } from '@/components/three/FrogCharacter';
import { Coin } from '@/components/three/Coin';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';

interface GameSceneProps {
  className?: string;
}

// Fixed coin positions for the MVP
const COIN_POSITIONS: Array<[number, number, number]> = [
  [5, 1, 5],
  [-5, 1, 5],
  [5, 1, -5],
  [-5, 1, -5],
  [0, 1, 8],
];

export function GameScene({ className }: GameSceneProps) {
  return (
    <div className={className}>
      <Canvas
        shadows
        camera={{
          position: [10, 10, 10],
          fov: 60,
        }}
        gl={{
          antialias: true,
          alpha: false,
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        
        {/* Environment for better lighting */}
        <Environment preset="sunset" />

        {/* Ground plane */}
        <mesh 
          position={[0, GAME_CONFIG.GROUND_Y - 0.1, 0]} 
          receiveShadow
        >
          <planeGeometry args={[GAME_CONFIG.WORLD.WIDTH, GAME_CONFIG.WORLD.DEPTH]} />
          <meshStandardMaterial 
            color="#2d5a2d" 
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* World boundaries visualization (optional) */}
        {/* Left wall */}
        <mesh position={[GAME_CONFIG.BOUNDS.MIN_X, 2, 0]}>
          <boxGeometry args={[0.2, 4, GAME_CONFIG.WORLD.DEPTH]} />
          <meshStandardMaterial color="#8b4513" transparent opacity={0.3} />
        </mesh>
        
        {/* Right wall */}
        <mesh position={[GAME_CONFIG.BOUNDS.MAX_X, 2, 0]}>
          <boxGeometry args={[0.2, 4, GAME_CONFIG.WORLD.DEPTH]} />
          <meshStandardMaterial color="#8b4513" transparent opacity={0.3} />
        </mesh>
        
        {/* Back wall */}
        <mesh position={[0, 2, GAME_CONFIG.BOUNDS.MIN_Z]}>
          <boxGeometry args={[GAME_CONFIG.WORLD.WIDTH, 4, 0.2]} />
          <meshStandardMaterial color="#8b4513" transparent opacity={0.3} />
        </mesh>
        
        {/* Front wall */}
        <mesh position={[0, 2, GAME_CONFIG.BOUNDS.MAX_Z]}>
          <boxGeometry args={[GAME_CONFIG.WORLD.WIDTH, 4, 0.2]} />
          <meshStandardMaterial color="#8b4513" transparent opacity={0.3} />
        </mesh>

        {/* Coins */}
        {COIN_POSITIONS.map((position, index) => (
          <Coin
            key={`coin-${index}`}
            id={`coin-${index}`}
            position={position}
          />
        ))}

        {/* Frog Character */}
        <FrogCharacter />

        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          target={[0, 1, 0]}
        />

        {/* Fog for atmosphere */}
        <fog attach="fog" args={['#87CEEB', 20, 50]} />
      </Canvas>
    </div>
  );
}