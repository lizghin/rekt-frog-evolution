'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useGameStore } from '@/store/gameStore';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';

export function FrogCharacter() {
  const meshRef = useRef<Mesh>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  
  const {
    playerPosition,
    playerVelocity,
    isGrounded,
    setPlayerPosition,
    setPlayerVelocity,
    setJumping,
    setGrounded,
    isPaused,
  } = useGameStore();

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      
      // Handle jump on space press
      if (e.key === ' ' && isGrounded && !isPaused) {
        setPlayerVelocity({ y: GAME_CONFIG.PLAYER.JUMP_FORCE });
        setJumping(true);
        setGrounded(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGrounded, isPaused, setPlayerVelocity, setJumping, setGrounded]);

  // Game loop update
  useFrame((state, delta) => {
    if (!meshRef.current || isPaused) return;

    const velocity = { ...playerVelocity };
    const position = { ...playerPosition };

    // Apply movement based on keys pressed
    const moveSpeed = GAME_CONFIG.PLAYER.MOVE_SPEED * delta;
    
    if (keysPressed.current.has('w')) {
      position.z -= moveSpeed;
    }
    if (keysPressed.current.has('s')) {
      position.z += moveSpeed;
    }
    if (keysPressed.current.has('a')) {
      position.x -= moveSpeed;
    }
    if (keysPressed.current.has('d')) {
      position.x += moveSpeed;
    }

    // Apply gravity
    if (!isGrounded) {
      velocity.y += GAME_CONFIG.PHYSICS.GRAVITY * delta;
      velocity.y = Math.max(velocity.y, GAME_CONFIG.PHYSICS.TERMINAL_VELOCITY);
    }

    // Update position with velocity
    position.y += velocity.y * delta;

    // Ground collision
    const groundLevel = GAME_CONFIG.WORLD.GROUND_Y + GAME_CONFIG.PLAYER.SIZE.HEIGHT / 2;
    if (position.y <= groundLevel) {
      position.y = groundLevel;
      velocity.y = 0;
      setGrounded(true);
      setJumping(false);
    }

    // World bounds
    const halfWidth = GAME_CONFIG.WORLD.WIDTH / 2;
    const halfDepth = GAME_CONFIG.WORLD.DEPTH / 2;
    position.x = Math.max(-halfWidth, Math.min(halfWidth, position.x));
    position.z = Math.max(-halfDepth, Math.min(halfDepth, position.z));

    // Apply friction
    if (isGrounded) {
      velocity.x *= GAME_CONFIG.PHYSICS.GROUND_FRICTION;
      velocity.z *= GAME_CONFIG.PHYSICS.GROUND_FRICTION;
    } else {
      velocity.x *= GAME_CONFIG.PHYSICS.AIR_FRICTION;
      velocity.z *= GAME_CONFIG.PHYSICS.AIR_FRICTION;
    }

    // Update mesh position
    meshRef.current.position.set(position.x, position.y, position.z);

    // Update store
    setPlayerPosition(position);
    setPlayerVelocity(velocity);
  });

  return (
    <mesh 
      ref={meshRef} 
      position={[playerPosition.x, playerPosition.y, playerPosition.z]}
      castShadow
    >
      {/* Simple capsule-like shape using a box for now */}
      <boxGeometry args={[
        GAME_CONFIG.PLAYER.SIZE.WIDTH,
        GAME_CONFIG.PLAYER.SIZE.HEIGHT,
        GAME_CONFIG.PLAYER.SIZE.DEPTH
      ]} />
      <meshStandardMaterial 
        color="#4CAF50" 
        roughness={0.7}
        metalness={0.3}
      />
      
      {/* Eyes */}
      <mesh position={[0.2, 0.5, 0.5]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.2, 0.5, 0.5]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </mesh>
  );
}