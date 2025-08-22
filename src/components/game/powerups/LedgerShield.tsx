'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PowerUp, PowerUpType } from '@/types/game';
import { useGameStore } from '@/store/gameStore';
import { POWERUP_CONFIGS } from '@/lib/constants/powerups';

interface LedgerShieldProps {
  powerUp: PowerUp;
}

export function LedgerShield({ powerUp }: LedgerShieldProps) {
  const meshRef = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  
  // TODO: These functions will be implemented in the next phase
  // const { collectPowerUp, character } = useGameStore();
  
  // Temporary mock data for now
  const character = { position: { x: 0, y: 0, z: 0 } };
  const collectPowerUp = () => {};
  const config = POWERUP_CONFIGS[PowerUpType.LEDGER_SHIELD];

  // Animation and collection logic
  useFrame((state, delta) => {
    timeRef.current += delta;

    if (!meshRef.current) return;

    // Floating animation
    const floatHeight = Math.sin(timeRef.current * 1.5 + powerUp.spawnTime) * 0.25;
    meshRef.current.position.y = powerUp.position.y + floatHeight;

    // Gentle rotation
    meshRef.current.rotation.y += delta * 0.8;

    // Shield breathing effect
    if (shieldRef.current) {
      const breathe = 1 + Math.sin(timeRef.current * 3) * 0.08;
      shieldRef.current.scale.setScalar(breathe);
    }

    // Check distance to player for collection
    const playerDistance = Math.sqrt(
      Math.pow(character.position.x - powerUp.position.x, 2) +
      Math.pow(character.position.y - powerUp.position.y, 2) +
      Math.pow(character.position.z - powerUp.position.z, 2)
    );

    if (playerDistance < 1.0) {
      collectPowerUp();
    }

    // Warning flash when about to despawn
    const timeAlive = Date.now() - powerUp.spawnTime;
    const timeUntilDespawn = 30000 - timeAlive;
    
    if (timeUntilDespawn < 5000 && timeUntilDespawn > 0) {
      const flashRate = 1 - (timeUntilDespawn / 5000);
      const flash = Math.sin(timeRef.current * (5 + flashRate * 15)) * 0.5 + 0.5;
      
      meshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.emissiveIntensity = flash * 0.6;
        }
      });
    }
  });

  return (
    <group 
      ref={meshRef} 
      position={[powerUp.position.x, powerUp.position.y, powerUp.position.z]}
    >
      {/* Main shield device */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.25, 0.15, 8]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.1}
          emissive="#4169E1"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Shield projector core */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#4169E1"
          emissive="#4169E1"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Holographic shield projection */}
      <mesh ref={shieldRef}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial
          color="#4169E1"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          emissive="#4169E1"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Ledger branding elements */}
      <mesh position={[0, 0.08, 0.31]}>
        <planeGeometry args={[0.2, 0.1]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Security pattern rings */}
      {[1, 2, 3].map((ring) => (
        <mesh
          key={ring}
          rotation={[Math.PI / 2, 0, timeRef.current * ring * 0.5]}
        >
          <torusGeometry args={[0.4 + ring * 0.1, 0.01, 8, 32]} />
          <meshBasicMaterial
            color="#4169E1"
            transparent
            opacity={0.5 - ring * 0.1}
          />
        </mesh>
      ))}

      {/* Data flow particles */}
      {[...Array(12)].map((_, i) => {
        const angle = (timeRef.current + (i * Math.PI * 2) / 12) * 2;
        const radius = 0.5;
        const height = Math.sin(timeRef.current * 3 + i) * 0.3;
        
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ]}
          >
            <boxGeometry args={[0.02, 0.02, 0.1]} />
            <meshBasicMaterial
              color="#87CEEB"
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}

      {/* Protective field indicators */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const pulseTime = timeRef.current * 2 + i;
        const pulseIntensity = Math.sin(pulseTime) * 0.5 + 0.5;
        
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.8,
              Math.sin(pulseTime) * 0.2,
              Math.sin(angle) * 0.8
            ]}
          >
            <octahedronGeometry args={[0.05]} />
            <meshBasicMaterial
              color="#4169E1"
              transparent
              opacity={pulseIntensity}
            />
          </mesh>
        );
      })}

      {/* Base platform */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.05, 8]} />
        <meshStandardMaterial
          color="#2F2F2F"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Status lights */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI) / 2) * 0.35,
            -0.05,
            Math.sin((i * Math.PI) / 2) * 0.35
          ]}
        >
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial
            color="#00FF00"
          />
        </mesh>
      ))}

      {/* Quantum field visualization */}
      <mesh>
        <torusGeometry args={[0.7, 0.05, 8, 32]} />
        <meshBasicMaterial
          color="#4169E1"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Energy discharge effects */}
      {[...Array(8)].map((_, i) => {
        const dischargeTime = timeRef.current * 4 + i;
        const dischargeAngle = dischargeTime * 2;
        const dischargeRadius = 0.3 + Math.sin(dischargeTime) * 0.2;
        
        return (
          <mesh
            key={`discharge-${i}`}
            position={[
              Math.cos(dischargeAngle) * dischargeRadius,
              0.1,
              Math.sin(dischargeAngle) * dischargeRadius
            ]}
          >
            <sphereGeometry args={[0.015]} />
            <meshBasicMaterial
              color="#87CEEB"
              transparent
              opacity={Math.sin(dischargeTime * 3) * 0.7 + 0.3}
            />
          </mesh>
        );
      })}

      {/* Collection area */}
      <mesh visible={false}>
        <sphereGeometry args={[1.0]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Lighting effects */}
      <pointLight
        color="#4169E1"
        intensity={0.8}
        distance={4}
        decay={2}
      />
      
      <pointLight
        color="#87CEEB"
        intensity={0.3}
        distance={2}
        decay={2}
        position={[0, 0.5, 0]}
      />

      {/* Ambient shield glow */}
      <ambientLight intensity={0.1} color="#4169E1" />
    </group>
  );
}