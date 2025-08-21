'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface FrogCharacterProps {
  position?: [number, number, number];
}

export function FrogCharacter({ position = [0, 1, 0] }: FrogCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const frogPosition = useRef({ x: 0, y: 1, z: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const isJumping = useRef(false);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyA':
        case 'ArrowLeft':
          velocity.current.x = -0.1;
          break;
        case 'KeyD':
        case 'ArrowRight':
          velocity.current.x = 0.1;
          break;
        case 'Space':
          event.preventDefault();
          if (!isJumping.current) {
            velocity.current.y = 0.3;
            isJumping.current = true;
          }
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyA':
        case 'ArrowLeft':
        case 'KeyD':
        case 'ArrowRight':
          velocity.current.x = 0;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Физика и анимация
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Гравитация
    velocity.current.y -= 0.02;

    // Обновляем позицию
    frogPosition.current.x += velocity.current.x;
    frogPosition.current.y += velocity.current.y;

    // Ограничиваем движение по X
    frogPosition.current.x = Math.max(-10, Math.min(10, frogPosition.current.x));

    // Проверяем землю
    if (frogPosition.current.y <= 1) {
      frogPosition.current.y = 1;
      velocity.current.y = 0;
      isJumping.current = false;
    }

    // Применяем позицию
    groupRef.current.position.set(
      frogPosition.current.x,
      frogPosition.current.y,
      frogPosition.current.z
    );

    // Анимация покачивания
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* РЕАЛИСТИЧНОЕ ТЕЛО ЛЯГУШКИ */}
      <mesh castShadow>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial 
          color="#2d8f47"
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* БОЛЬШИЕ РЕАЛИСТИЧНЫЕ ГЛАЗА */}
      <mesh position={[-0.4, 0.6, 0.8]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      <mesh position={[0.4, 0.6, 0.8]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffff"
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* БЛЕСТЯЩИЕ ЗРАЧКИ */}
      <mesh position={[-0.4, 0.6, 1.1]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#000000"
          roughness={0.0}
          metalness={1.0}
        />
      </mesh>
      <mesh position={[0.4, 0.6, 1.1]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#000000"
          roughness={0.0}
          metalness={1.0}
        />
      </mesh>

      {/* БЛИКИ НА ГЛАЗАХ */}
      <mesh position={[-0.35, 0.65, 1.2]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.45, 0.65, 1.2]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* УЛЫБКА */}
      <mesh position={[0, 0.2, 1.0]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.05, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#1a4d2e" />
      </mesh>

      {/* МОЩНЫЕ ПЕРЕДНИЕ ЛАПЫ */}
      <mesh position={[-0.8, -0.3, 0.5]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#1f5f3f" />
      </mesh>
      <mesh position={[0.8, -0.3, 0.5]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#1f5f3f" />
      </mesh>
      
      {/* ЗАДНИЕ ЛАПЫ (используем сплющенные сферы вместо ellipsoid) */}
      <mesh position={[-0.6, -0.6, -0.4]} castShadow scale={[0.8, 0.5, 1.5]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#1f5f3f" />
      </mesh>
      <mesh position={[0.6, -0.6, -0.4]} castShadow scale={[0.8, 0.5, 1.5]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#1f5f3f" />
      </mesh>

      {/* ПЯТНА НА СПИНЕ */}
      <mesh position={[0, 0.8, -0.2]} castShadow>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#1a4d2e" />
      </mesh>
      <mesh position={[-0.3, 0.7, 0.1]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#1a4d2e" />
      </mesh>
      <mesh position={[0.4, 0.6, -0.1]} castShadow>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#1a4d2e" />
      </mesh>

      {/* ДОПОЛНИТЕЛЬНЫЕ ДЕТАЛИ - ПЕРЕПОНКИ НА ЛАПАХ */}
      <mesh position={[-0.8, -0.5, 0.7]} castShadow rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.2, 0.1, 3]} />
        <meshStandardMaterial color="#0f3f2f" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.8, -0.5, 0.7]} castShadow rotation={[0, 0, -Math.PI / 4]}>
        <coneGeometry args={[0.2, 0.1, 3]} />
        <meshStandardMaterial color="#0f3f2f" transparent opacity={0.7} />
      </mesh>

      {/* ЭМОДЗИ НАД ГОЛОВОЙ */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={1.0}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        🐸
      </Text>

      {/* ИМЯ С КРУТЫМ ШРИФТОМ */}
      <Text
        position={[0, 2.8, 0]}
        fontSize={0.4}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
        fontWeight={800}
      >
        REKT FROG
      </Text>

      {/* АУРА СВЕЧЕНИЯ */}
      <mesh>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshBasicMaterial 
          color="#00ff88" 
          transparent 
          opacity={0.1}
        />
      </mesh>

      {/* ЭНЕРГЕТИЧЕСКИЕ КОЛЬЦА */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.05, 8, 32]} />
        <meshBasicMaterial 
          color="#00ffaa" 
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[2.2, 0.03, 8, 32]} />
        <meshBasicMaterial 
          color="#aaffff" 
          transparent 
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}
