'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

type CoinProps = {
  position: [number, number, number];
  radius?: number;
};

export function Coin({ position, radius = 0.5 }: CoinProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [collected, setCollected] = useState(false);
  const { addScore, addCoin, playerPosition } = useGameStore();

  useFrame((state) => {
    if (!groupRef.current || collected) return;
    groupRef.current.rotation.y += 0.06;
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.2;

    const dx = playerPosition.x - position[0];
    const dy = playerPosition.y - groupRef.current.position.y;
    const dz = playerPosition.z - position[2];
    const distSq = dx * dx + dy * dy + dz * dz;
    if (distSq <= (radius + 0.8) * (radius + 0.8)) {
      setCollected(true);
      addScore(10);
      addCoin(1);
    }
  });

  if (collected) return null;

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius, 0.15, 24]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}
