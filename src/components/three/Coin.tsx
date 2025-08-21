'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';
import { useCollisions } from '@/hooks/game/useCollisions';

interface CoinProps {
  position: [number, number, number];
  id: string;
}

export function Coin({ position }: CoinProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [collected, setCollected] = useState(false);
  
  const { player, collectCoin, isPlaying, isPaused } = useGameStore();
  const { checkCoinCollision } = useCollisions();

  // Animation and collision detection
  useFrame((_, delta) => {
    if (!meshRef.current || collected || !isPlaying || isPaused) return;

    // Spin the coin
    meshRef.current.rotation.y += GAME_CONFIG.COIN.SPIN_SPEED * 60 * delta;
    
    // Bob up and down slightly
    meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.2;

    // Check collision with player
    const coinPosition = new THREE.Vector3(...position);
    if (checkCoinCollision(player.position, coinPosition)) {
      setCollected(true);
      collectCoin();
      
      // Simple collection animation - could be enhanced
      if (meshRef.current) {
        meshRef.current.visible = false;
      }
    }
  });

  if (collected || !isPlaying) return null;

  return (
    <group position={position}>
      {/* Main coin body */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 8]} />
        <meshStandardMaterial 
          color="#ffd700" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#ffaa00"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Inner detail */}
      <mesh position={[0, 0, 0.06]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 8]} />
        <meshStandardMaterial 
          color="#ffed4a" 
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.05, 8]} />
        <meshStandardMaterial 
          color="#ffd700" 
          transparent 
          opacity={0.3}
          emissive="#ffaa00"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Sparkle particles could be added here */}
      <pointLight 
        color="#ffd700" 
        intensity={0.5} 
        distance={3} 
        decay={2}
      />
    </group>
  );
}