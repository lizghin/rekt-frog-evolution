'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PowerUp } from '@/types/game';
// import { useGameStore } from '@/store/gameStore'; // TODO: Implement when game logic is ready
// import { POWERUP_CONFIGS } from '@/lib/constants/powerups'; // TODO: Use when powerup logic is implemented

interface UnrektBombProps {
  powerUp: PowerUp;
}

export function UnrektBomb({ powerUp }: UnrektBombProps) {
  const meshRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const pulseRef = useRef(0);
  
  // TODO: These functions will be implemented in the next phase
  // const { collectPowerUp, character, clearAllEnemies, addScore } = useGameStore();
  
  // Temporary mock data for now
  const character = { position: { x: 0, y: 0, z: 0 } };
  const collectPowerUp = () => {};
  const clearAllEnemies = () => {};
  // const addScore = () => {}; // TODO: Use when scoring logic is implemented
  // const config = POWERUP_CONFIGS[PowerUpType.UNREKT_BOMB]; // TODO: Use when powerup logic is implemented

  // Check for collection
  useFrame((state, delta) => {
    timeRef.current += delta;
    pulseRef.current += delta * 3;

    if (!meshRef.current) return;

    // Floating animation
    const floatHeight = Math.sin(timeRef.current * 2 + powerUp.spawnTime) * 0.3;
    meshRef.current.position.y = powerUp.position.y + floatHeight;

    // Rotation animation
    meshRef.current.rotation.y += delta * 1.5;
    meshRef.current.rotation.x = Math.sin(timeRef.current) * 0.2;

    // Pulsing scale effect
    const pulse = 1 + Math.sin(pulseRef.current) * 0.1;
    meshRef.current.scale.setScalar(pulse);

    // Check distance to player for collection
    const playerDistance = Math.sqrt(
      Math.pow(character.position.x - powerUp.position.x, 2) +
      Math.pow(character.position.y - powerUp.position.y, 2) +
      Math.pow(character.position.z - powerUp.position.z, 2)
    );

    if (playerDistance < 1.0) {
      handleCollection();
    }

    // Warning flash when about to despawn (last 5 seconds)
    const timeAlive = Date.now() - powerUp.spawnTime;
    const timeUntilDespawn = 30000 - timeAlive; // 30 seconds lifetime
    
    if (timeUntilDespawn < 5000 && timeUntilDespawn > 0) {
      const flashRate = 1 - (timeUntilDespawn / 5000); // Faster as time runs out
      const flash = Math.sin(timeRef.current * (5 + flashRate * 15)) * 0.5 + 0.5;
      
      meshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.emissiveIntensity = flash * 0.8;
        }
      });
    }
  });

  const handleCollection = () => {
    if (powerUp.isCollected) return;
    
    // Trigger explosion effect
    createExplosionEffect();
    
    // Clear all enemies and add score
    clearAllEnemies();
    
    // Collect the powerup
    collectPowerUp();
  };

  const createExplosionEffect = () => {
    // This would trigger screen shake, sound effects, and visual effects
    // For now, we'll create a simple visual explosion
    if (meshRef.current) {
      // Create expanding shockwave
      const shockwave = new THREE.Mesh(
        new THREE.RingGeometry(0, 1, 32),
        new THREE.MeshBasicMaterial({
          color: '#FF4500',
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide
        })
      );
      
      shockwave.rotation.x = -Math.PI / 2;
      shockwave.position.copy(meshRef.current.position);
      
      // Add to scene (this would be handled by the scene manager)
      // scene.add(shockwave);
      
      // Animate expansion
      let scale = 0;
      const expandShockwave = () => {
        scale += 0.5;
        shockwave.scale.setScalar(scale);
        shockwave.material.opacity = Math.max(0, 0.8 - scale * 0.1);
        
        if (scale < 20) {
          requestAnimationFrame(expandShockwave);
        } else {
          // Remove from scene
          // scene.remove(shockwave);
        }
      };
      
      expandShockwave();
    }
  };

  return (
    <group 
      ref={meshRef} 
      position={[powerUp.position.x, powerUp.position.y, powerUp.position.z]}
    >
      {/* Main bomb body */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#2F2F2F"
          metalness={0.8}
          roughness={0.2}
          emissive="#FF4500"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Bomb fuse */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.8}
        />
      </mesh>

      {/* Fuse spark */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.08]} />
        <meshBasicMaterial
          color="#FFFF00"
          transparent
          opacity={Math.sin(timeRef.current * 10) * 0.5 + 0.5}
        />
      </mesh>

      {/* Warning stripes */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[0, 0, 0]}
          rotation={[0, (i * Math.PI) / 2, 0]}
        >
          <boxGeometry args={[0.1, 0.6, 0.01]} />
          <meshBasicMaterial color="#FFFF00" />
        </mesh>
      ))}

      {/* Explosion symbol */}
      <mesh position={[0, 0, 0.41]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshBasicMaterial
          color="#FF0000"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Energy core glow */}
      <mesh>
        <sphereGeometry args={[0.2]} />
        <meshBasicMaterial
          color="#FF4500"
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Orbiting energy particles */}
      {[...Array(6)].map((_, i) => {
        const angle = (timeRef.current * 2 + (i * Math.PI * 2) / 6);
        const radius = 0.8;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 0.2,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial
              color="#FF4500"
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}

      {/* Power indicator rings */}
      {[1, 2, 3].map((ring) => (
        <mesh
          key={ring}
          rotation={[Math.PI / 2, 0, timeRef.current * ring]}
        >
          <torusGeometry args={[0.5 + ring * 0.2, 0.02, 8, 16]} />
          <meshBasicMaterial
            color="#FF4500"
            transparent
            opacity={0.4 / ring}
          />
        </mesh>
      ))}

      {/* Danger aura */}
      <mesh>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial
          color="#FF0000"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Collection area */}
      <mesh visible={false}>
        <sphereGeometry args={[1.0]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Point lights for dramatic effect */}
      <pointLight
        color="#FF4500"
        intensity={1}
        distance={5}
        decay={2}
      />
      
      <pointLight
        color="#FFFF00"
        intensity={0.5}
        distance={3}
        decay={2}
        position={[0, 0.6, 0]}
      />

      {/* Sparks animation */}
      {[...Array(8)].map((_, i) => {
        const sparkTime = timeRef.current * 5 + i;
        const sparkRadius = 0.5 + Math.sin(sparkTime) * 0.3;
        const sparkAngle = sparkTime * 3;
        
        return (
          <mesh
            key={`spark-${i}`}
            position={[
              Math.cos(sparkAngle) * sparkRadius,
              0.6 + Math.sin(sparkTime * 2) * 0.2,
              Math.sin(sparkAngle) * sparkRadius
            ]}
          >
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial
              color="#FFFF00"
              transparent
              opacity={Math.sin(sparkTime * 4) * 0.5 + 0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}