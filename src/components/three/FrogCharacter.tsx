'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';

type FrogCharacterProps = {
  position?: [number, number, number];
};

export function FrogCharacter({ position = [0, 1, 0] }: FrogCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const { paused, playerPosition, setPlayerPosition, playerVelocity, setPlayerVelocity } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      if (e.code === 'Space') e.preventDefault();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, dt) => {
    if (!groupRef.current || paused) return;
    const delta = Math.min(dt, 1 / 30);

    const speed = GAME_CONFIG.physics.moveSpeed;
    const gravity = GAME_CONFIG.physics.gravity;
    const friction = GAME_CONFIG.physics.friction;
    const jumpV = GAME_CONFIG.physics.jumpVelocity;

    let vx = playerVelocity.x;
    let vy = playerVelocity.y;
    let vz = playerVelocity.z;

    let moveX = 0;
    let moveZ = 0;
    if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) moveX -= 1;
    if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) moveX += 1;
    if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) moveZ -= 1;
    if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) moveZ += 1;

    const len = Math.hypot(moveX, moveZ);
    if (len > 0) {
      moveX /= len;
      moveZ /= len;
    }

    vx = moveX * speed;
    vz = moveZ * speed;

    // gravity
    vy += gravity * delta;

    // integrate
    let nx = playerPosition.x + vx * delta;
    let ny = playerPosition.y + vy * delta;
    let nz = playerPosition.z + vz * delta;

    // ground collision
    const ground = GAME_CONFIG.world.groundY + 1; // mesh half-height ~1
    if (ny <= ground) {
      ny = ground;
      if (vy < 0) vy = 0;
      if (keysRef.current['Space']) {
        vy = jumpV;
      }
    }

    // simple friction on ground horizontal
    if (ny === ground && len === 0) {
      vx = THREE.MathUtils.damp(vx, 0, friction, delta);
      vz = THREE.MathUtils.damp(vz, 0, friction, delta);
      nx = playerPosition.x + vx * delta;
      nz = playerPosition.z + vz * delta;
    }

    // world bounds
    nx = Math.min(GAME_CONFIG.bounds.maxX, Math.max(GAME_CONFIG.bounds.minX, nx));
    nz = Math.min(GAME_CONFIG.bounds.maxZ, Math.max(GAME_CONFIG.bounds.minZ, nz));

    setPlayerVelocity({ x: vx, y: vy, z: vz });
    setPlayerPosition({ x: nx, y: ny, z: nz });

    groupRef.current.position.set(nx, ny, nz);
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow>
        <capsuleGeometry args={[0.6, 0.8, 8, 16]} />
        <meshStandardMaterial color="#2d8f47" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
