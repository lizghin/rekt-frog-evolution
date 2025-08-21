'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';

interface CoinProps {
  position: [number, number, number];
  id: string;
}

export function Coin({ position }: CoinProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [collected, setCollected] = useState(false);
  const { addScore, addCoins, characterPosition } = useGameStore();

  useFrame(() => {
    if (meshRef.current && !collected) {
      // Spinning animation
      meshRef.current.rotation.y += 0.05;
      
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.3;
    }
  });

  // Check for proximity collection
  useFrame(() => {
    if (collected) return;
    
    const distance = Math.sqrt(
      Math.pow(characterPosition[0] - position[0], 2) +
      Math.pow(characterPosition[1] - position[1], 2) +
      Math.pow(characterPosition[2] - position[2], 2)
    );
    
    if (distance < GAME_CONFIG.COIN.COLLECTION_DISTANCE) {
      setCollected(true);
      addScore(GAME_CONFIG.COIN.VALUE);
      addCoins(1);
    }
  });

  if (collected) return null;

  return (
    <group ref={meshRef} position={position}>
      {/* Simple coin mesh */}
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
        <meshStandardMaterial 
          color="#ffd700"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}
