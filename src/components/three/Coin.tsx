'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

interface CoinProps {
  position: [number, number, number];
  id: string;
}

export function Coin({ position, id }: CoinProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [collected, setCollected] = useState(false);

  const { paused, characterPosition, addScore, addCoins } = useGameStore();

  useFrame(() => {
    if (collected || paused) return;
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.05;
    }

    const [cx, , cz] = characterPosition;
    const dx = cx - position[0];
    const dz = cz - position[2];
    const dist = Math.hypot(dx, dz);
    if (dist < 1) {
      setCollected(true);
      addScore(10);
      addCoins(1);
    }
  });

  if (collected) return null;

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
      <meshStandardMaterial color={'gold'} />
    </mesh>
  );
}
