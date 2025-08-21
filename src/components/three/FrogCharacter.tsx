'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';

interface FrogCharacterProps {
  position?: [number, number, number];
}

export function FrogCharacter({ position = [0, 1, 0] }: FrogCharacterProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { 
    characterPosition, 
    characterVelocity, 
    updateCharacterPosition, 
    updateCharacterVelocity,
    isPaused 
  } = useGameStore();

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isPaused) return;
      
      const currentVelocity = [...characterVelocity] as [number, number, number];
      
      switch (event.code) {
        case 'KeyA':
        case 'ArrowLeft':
          currentVelocity[0] = -GAME_CONFIG.PLAYER.SPEED;
          break;
        case 'KeyD':
        case 'ArrowRight':
          currentVelocity[0] = GAME_CONFIG.PLAYER.SPEED;
          break;
        case 'Space':
          event.preventDefault();
          if (characterPosition[1] <= 1.1) { // Only jump if on ground
            currentVelocity[1] = GAME_CONFIG.PLAYER.JUMP_FORCE;
          }
          break;
      }
      
      updateCharacterVelocity(currentVelocity);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const currentVelocity = [...characterVelocity] as [number, number, number];
      
      switch (event.code) {
        case 'KeyA':
        case 'ArrowLeft':
        case 'KeyD':
        case 'ArrowRight':
          currentVelocity[0] = 0;
          break;
      }
      
      updateCharacterVelocity(currentVelocity);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [characterVelocity, characterPosition, isPaused, updateCharacterVelocity]);

  // Physics and animation
  useFrame(() => {
    if (!meshRef.current || isPaused) return;

    const currentPosition = [...characterPosition] as [number, number, number];
    const currentVelocity = [...characterVelocity] as [number, number, number];

    // Apply gravity
    currentVelocity[1] += GAME_CONFIG.WORLD.GRAVITY;

    // Update position
    currentPosition[0] += currentVelocity[0];
    currentPosition[1] += currentVelocity[1];

    // World bounds collision (X-axis)
    const worldBounds = GAME_CONFIG.WORLD.WIDTH / 2;
    if (currentPosition[0] < -worldBounds) {
      currentPosition[0] = -worldBounds;
      currentVelocity[0] = 0;
    } else if (currentPosition[0] > worldBounds) {
      currentPosition[0] = worldBounds;
      currentVelocity[0] = 0;
    }

    // Ground collision
    if (currentPosition[1] <= 1) {
      currentPosition[1] = 1;
      currentVelocity[1] = 0;
    }

    // Update store
    updateCharacterPosition(currentPosition);
    updateCharacterVelocity(currentVelocity);

    // Apply position to mesh
    meshRef.current.position.set(currentPosition[0], currentPosition[1], currentPosition[2]);
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      {/* Simple capsule-like body */}
      <capsuleGeometry args={[0.5, 1, 4, 8]} />
      <meshStandardMaterial color="#2d8f47" />
    </mesh>
  );
}
