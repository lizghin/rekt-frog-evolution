'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';

interface CoinProps {
  position: [number, number, number];
  onCollect?: () => void;
  isCollected?: boolean;
}

export function Coin({ position, onCollect, isCollected = false }: CoinProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current && !isCollected) {
      // Rotate the coin
      meshRef.current.rotation.y += GAME_CONFIG.COIN.ROTATION_SPEED * delta;
      
      // Slight bobbing effect
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  // Don't render if collected
  if (isCollected) return null;

  return (
    <mesh ref={meshRef} position={position}>
      {/* Coin geometry - cylinder shape */}
      <cylinderGeometry args={[GAME_CONFIG.COIN.SIZE, GAME_CONFIG.COIN.SIZE, 0.1, 16]} />
      <meshStandardMaterial 
        color="#FFD700" 
        metalness={0.8} 
        roughness={0.2}
        emissive="#FFD700"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}