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
  const meshRef = useRef<THREE.Mesh>(null!);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const keys = useRef<Record<string, boolean>>({});

  const paused = useGameStore((s) => s.paused);
  const setCharacterPosition = useGameStore((s) => s.setCharacterPosition);

  /* keyboard listeners */
  useEffect(() => {
    const down = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useFrame(() => {
    if (paused || !meshRef.current) return;

    /* horizontal movement */
    const speed = 0.12;
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) meshRef.current.position.x -= speed;
    if (keys.current['KeyD'] || keys.current['ArrowRight']) meshRef.current.position.x += speed;
    if (keys.current['KeyW'] || keys.current['ArrowUp']) meshRef.current.position.z -= speed;
    if (keys.current['KeyS'] || keys.current['ArrowDown']) meshRef.current.position.z += speed;

    /* jump */
    if ((keys.current['Space'] || keys.current['KeyJ']) && meshRef.current.position.y <= GAME_CONFIG.WORLD.GROUND_LEVEL + 0.51) {
      velocity.current.y = GAME_CONFIG.PLAYER.JUMP_FORCE * 0.02; // small boost
    }

    /* gravity */
    velocity.current.y += GAME_CONFIG.WORLD.GRAVITY * 0.001;
    meshRef.current.position.y += velocity.current.y;

    /* ground collision */
    if (meshRef.current.position.y < GAME_CONFIG.WORLD.GROUND_LEVEL + 0.5) {
      meshRef.current.position.y = GAME_CONFIG.WORLD.GROUND_LEVEL + 0.5;
      velocity.current.y = 0;
    }

    /* world bounds */
    const halfW = GAME_CONFIG.WORLD.WIDTH / 2;
    const halfD = GAME_CONFIG.WORLD.DEPTH / 2;
    meshRef.current.position.x = THREE.MathUtils.clamp(meshRef.current.position.x, -halfW, halfW);
    meshRef.current.position.z = THREE.MathUtils.clamp(meshRef.current.position.z, -halfD, halfD);

    /* write back to store */
    setCharacterPosition([
      meshRef.current.position.x,
      meshRef.current.position.y,
      meshRef.current.position.z,
    ]);
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <capsuleGeometry args={[0.5, 1, 8, 16]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
  );
}
