'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

interface CoinProps {
  position: [number, number, number];
  id: string;
}

export function Coin({ position, id }: CoinProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [collected, setCollected] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { addScore, addTokens } = useGameStore();

  useFrame((state) => {
    if (meshRef.current && !collected) {
      // Быстрое вращение
      meshRef.current.rotation.y += 0.05;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Плавное покачивание
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.3;
      
      // Пульсация при наведении
      const scale = hovered ? 1.3 : 1.0;
      meshRef.current.scale.setScalar(scale + Math.sin(state.clock.elapsedTime * 8) * 0.1);
    }
  });

  if (collected) return null;

  const handleClick = () => {
    if (!collected) {
      setCollected(true);
      addScore(100);
      addTokens(1);
      console.log('💰 Coin collected! +100 points, +1 $REKT');
    }
  };

  return (
    <group 
      ref={meshRef} 
      position={position}
      onClick={handleClick}
      onPointerEnter={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* ОСНОВНАЯ ЗОЛОТАЯ МОНЕТА */}
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.15, 32]} />
        <meshStandardMaterial 
          color="#ffd700"
          roughness={0.1}
          metalness={0.9}
          emissive="#ffaa00"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* РЕЛЬЕФ НА МОНЕТЕ */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.02, 32]} />
        <meshStandardMaterial 
          color="#ffdd44"
          roughness={0.05}
          metalness={1.0}
        />
      </mesh>

      {/* ЦЕНТРАЛЬНЫЙ СИМВОЛ */}
      <Text
        position={[0, 0.1, 0]}
        fontSize={0.6}
        color="#cc8800"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
      >
        $
      </Text>

      {/* ЯРКОЕ СВЕЧЕНИЕ */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial 
          color="#ffd700" 
          transparent 
          opacity={hovered ? 0.4 : 0.2}
        />
      </mesh>

      {/* ВРАЩАЮЩИЕСЯ ЧАСТИЦЫ */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh 
          key={i}
          position={[
            Math.cos(i * Math.PI / 4) * 1.2,
            Math.sin(Date.now() * 0.002 + i) * 0.3,
            Math.sin(i * Math.PI / 4) * 1.2
          ]}
        >
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial 
            color="#ffff00" 
            transparent 
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* RING ЭФФЕКТ */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.0, 0.02, 8, 32]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={hovered ? 0.6 : 0.3}
        />
      </mesh>
    </group>
  );
}
