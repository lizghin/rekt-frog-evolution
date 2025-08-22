'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Enemy } from '@/types/game';
// import { useGameStore } from '@/store/gameStore'; // TODO: Implement when game logic is ready
import { ENEMY_CONFIGS } from '@/lib/constants/enemies';

interface RugPullProps {
  enemy: Enemy;
}

export function RugPull({ enemy }: RugPullProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [isActivated, setIsActivated] = useState(false);
  const [playerInRange, setPlayerInRange] = useState(false);
  const timeRef = useRef(0);
  const activationRef = useRef(false);

  // TODO: These functions will be implemented in the next phase
  // const { character, damageCharacter, removeEnemy } = useGameStore();
  
  // Temporary mock data for now
  const character = { position: { x: 0, y: 0, z: 0 }, isGrounded: true };
  const damageCharacter = () => {};
  const removeEnemy = () => {};
  const config = ENEMY_CONFIGS.rugpull;

  // Trap detection - check if player is close enough
  useFrame((state, delta) => {
    timeRef.current += delta;

    if (!meshRef.current || enemy.health <= 0) return;

    const playerDistance = Math.sqrt(
      Math.pow(character.position.x - enemy.position.x, 2) +
      Math.pow(character.position.z - enemy.position.z, 2)
    );

    const inRange = playerDistance <= config.behavior.attackRange;
    setPlayerInRange(inRange);

    // Trigger activation if player steps on the trap
    if (inRange && character.isGrounded && !activationRef.current) {
      activationRef.current = true;
      setIsActivated(true);
      
      // Deal damage to player
      damageCharacter();
      
      // Remove the trap after activation
      setTimeout(() => {
        removeEnemy();
      }, 1000);
    }

    // Update mesh position and animations
    if (meshRef.current) {
      meshRef.current.position.set(
        enemy.position.x,
        enemy.position.y,
        enemy.position.z
      );

      // Subtle breathing animation when not activated
      if (!isActivated) {
        meshRef.current.scale.y = 1 + Math.sin(timeRef.current * 2) * 0.05;
      }

      // Warning glow when player is near
      if (playerInRange && !isActivated) {
        const warningIntensity = Math.sin(timeRef.current * 10) * 0.5 + 0.5;
        meshRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive.setHex(0x440000);
            child.material.emissiveIntensity = warningIntensity * 0.3;
          }
        });
      }
    }
  });

  // Activation animation
  useEffect(() => {
    if (isActivated && meshRef.current) {
      // Collapse animation
      const targetScale = new THREE.Vector3(1.2, 0.1, 1.2);
      
      const animateCollapse = () => {
        if (meshRef.current) {
          meshRef.current.scale.lerp(targetScale, 0.1);
          
          // Add destruction particles
          if (meshRef.current.scale.y > 0.2) {
            requestAnimationFrame(animateCollapse);
          }
        }
      };
      
      animateCollapse();
    }
  }, [isActivated]);

  return (
    <group ref={meshRef} position={[enemy.position.x, enemy.position.y, enemy.position.z]}>
      {/* Main trap platform */}
      <mesh>
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial
          color={isActivated ? '#654321' : '#8B4513'}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Decorative edges to make it look like a rug */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[2.2, 0.02, 2.2]} />
        <meshStandardMaterial
          color={isActivated ? '#443322' : '#A0522D'}
          roughness={0.9}
        />
      </mesh>

      {/* Warning indicators (only visible when player is near) */}
      {playerInRange && !isActivated && (
        <group>
          {/* Corner warning lights */}
          {          [
            [-0.9, 0, -0.9] as [number, number, number],
            [0.9, 0, -0.9] as [number, number, number],
            [-0.9, 0, 0.9] as [number, number, number],
            [0.9, 0, 0.9] as [number, number, number]
          ].map((pos, index) => (
            <mesh key={index} position={pos}>
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial
                color="#FF0000"
                transparent
                opacity={Math.sin(timeRef.current * 10) * 0.5 + 0.5}
              />
            </mesh>
          ))}

          {/* Warning circle */}
          <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 2, 16]} />
            <meshBasicMaterial
              color="#FF4444"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* Activation particles */}
      {isActivated && (
        <group>
          {/* Dust cloud particles */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 1 + Math.random() * 0.5;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  0.1 + Math.random() * 0.3,
                  Math.sin(angle) * radius
                ]}
              >
                <sphereGeometry args={[0.1]} />
                <meshBasicMaterial
                  color="#8B4513"
                  transparent
                  opacity={0.6}
                />
              </mesh>
            );
          })}

          {/* Central explosion effect */}
          <mesh>
            <sphereGeometry args={[0.5]} />
            <meshBasicMaterial
              color="#FF4500"
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      )}

      {/* Hidden collision detection sphere */}
      <mesh visible={false} position={[0, 0.5, 0]}>
        <sphereGeometry args={[config.behavior.attackRange]} />
      </mesh>

      {/* Fake valuable appearance (to lure players) */}
      {!isActivated && !playerInRange && (
        <group>
          {/* Fake coins on the platform */}
          {[
            [-0.3, 0, -0.3],
            [0.3, 0, -0.3],
            [0, 0, 0.3]
          ].map((pos, index) => (
            <mesh
              key={index}
              position={[pos[0], 0.15, pos[2]]}
              rotation={[0, timeRef.current + index, 0]}
            >
              <cylinderGeometry args={[0.1, 0.1, 0.02]} />
              <meshStandardMaterial
                color="#FFD700"
                emissive="#FFA500"
                emissiveIntensity={0.2}
                metalness={0.8}
              />
            </mesh>
          ))}

          {/* Subtle glow to make it attractive */}
          <pointLight
            color="#FFD700"
            intensity={0.3}
            distance={3}
            position={[0, 0.5, 0]}
          />
        </group>
      )}

      {/* Sound effect trigger areas */}
      <mesh
        visible={false}
        onPointerEnter={() => {
          // Trigger warning sound when player approaches
          // This would integrate with the sound manager
        }}
      >
        <sphereGeometry args={[3]} />
      </mesh>
    </group>
  );
}