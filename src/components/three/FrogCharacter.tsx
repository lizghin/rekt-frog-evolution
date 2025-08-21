'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';
import { useCollisions } from '@/hooks/game/useCollisions';

export function FrogCharacter() {
  const meshRef = useRef<THREE.Mesh>(null);
  const keysRef = useRef<Set<string>>(new Set());
  
  const { 
    player, 
    isPaused, 
    isPlaying,
    updatePlayerPosition, 
    updatePlayerVelocity,
    setPlayerGrounded,
    setPlayerJumping 
  } = useGameStore();

  const { applyGroundCollision, checkBoundaryCollision } = useCollisions();

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysRef.current.add(event.code.toLowerCase());
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.code.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useFrame((_, delta) => {
    if (!meshRef.current || !isPlaying || isPaused) return;

    const keys = keysRef.current;
    let newPosition = player.position.clone();
    let newVelocity = player.velocity.clone();

    // Handle horizontal movement (WASD)
    const moveSpeed = GAME_CONFIG.PLAYER.SPEED * delta;
    
    if (keys.has('keyw') || keys.has('arrowup')) {
      newPosition.z -= moveSpeed;
    }
    if (keys.has('keys') || keys.has('arrowdown')) {
      newPosition.z += moveSpeed;
    }
    if (keys.has('keya') || keys.has('arrowleft')) {
      newPosition.x -= moveSpeed;
    }
    if (keys.has('keyd') || keys.has('arrowright')) {
      newPosition.x += moveSpeed;
    }

    // Handle jumping (SPACE)
    if ((keys.has('space') || keys.has(' ')) && player.isGrounded && !player.isJumping) {
      newVelocity.y = GAME_CONFIG.PLAYER.JUMP_FORCE;
      setPlayerJumping(true);
      setPlayerGrounded(false);
    }

    // Apply gravity
    if (!player.isGrounded) {
      newVelocity.y += GAME_CONFIG.GRAVITY * delta;
    }

    // Update position based on velocity
    newPosition.add(newVelocity.clone().multiplyScalar(delta));

    // Apply collisions
    const collisionResult = applyGroundCollision(newPosition, newVelocity);
    newPosition = collisionResult.position;
    newVelocity = collisionResult.velocity;
    
    // Check boundaries
    newPosition = checkBoundaryCollision(newPosition);

    // Update ground state
    if (collisionResult.isGrounded && player.isJumping) {
      setPlayerJumping(false);
    }
    setPlayerGrounded(collisionResult.isGrounded);

    // Update store
    updatePlayerPosition(newPosition);
    updatePlayerVelocity(newVelocity);

    // Update mesh position
    meshRef.current.position.copy(newPosition);
  });

  // Initialize mesh position
  useEffect(() => {
    if (meshRef.current && player.position) {
      meshRef.current.position.copy(player.position);
    }
  }, [player.position]);

  if (!isPlaying) return null;

  return (
    <group>
      {/* Main frog body - simple capsule/cylinder */}
      <mesh ref={meshRef} position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[GAME_CONFIG.PLAYER.SIZE * 0.4, GAME_CONFIG.PLAYER.SIZE * 0.8, 4, 8]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.2, 1.4, 0.3]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.2, 1.4, 0.3]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Eye pupils */}
      <mesh position={[0.2, 1.4, 0.35]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.2, 1.4, 0.35]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}