'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { Enemy, EnemyType } from '@/types/game';
import { useGameStore } from '@/store/gameStore';
import { ENEMY_CONFIGS, ENEMY_AI_STATES } from '@/lib/constants/enemies';

interface BearBotProps {
  enemy: Enemy;
}

export function BearBot({ enemy }: BearBotProps) {
  const meshRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const [aiState, setAiState] = useState<keyof typeof ENEMY_AI_STATES>('PATROL');
  const [lastAttackTime, setLastAttackTime] = useState(0);
  const timeRef = useRef(0);
  const patrolCenter = useRef(new THREE.Vector3(enemy.position.x, enemy.position.y, enemy.position.z));
  const patrolTarget = useRef(new THREE.Vector3());
  const velocityRef = useRef(new THREE.Vector3());

  // TODO: These functions will be implemented in the next phase
  // const { 
  //   character, 
  //   damageCharacter, 
  //   updateEnemyPosition, 
  //   updateEnemyVelocity,
  //   removeEnemy,
  //   addScore 
  // } = useGameStore();
  
  // Temporary mock data for now
  const character = { position: { x: 0, y: 0, z: 0 } };
  const damageCharacter = () => {};
  const updateEnemyPosition = () => {};
  const updateEnemyVelocity = () => {};
  const removeEnemy = () => {};
  const addScore = () => {};

  const config = ENEMY_CONFIGS[EnemyType.BEAR_BOT];
  const { scene, animations } = useGLTF(config.modelPath);
  const { actions } = useAnimations(animations, meshRef);

  // Initialize AI and animations
  useEffect(() => {
    if (scene && animations.length > 0) {
      const mixer = new THREE.AnimationMixer(scene);
      mixerRef.current = mixer;

      // Set initial patrol target
      generatePatrolTarget();
    }

    return () => {
      if (mixerRef.current) {
        // mixerRef.current.dispose(); // AnimationMixer doesn't have dispose method
      }
    };
  }, [scene, animations]);

  const generatePatrolTarget = () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * config.behavior.patrolRadius;
    patrolTarget.current.set(
      patrolCenter.current.x + Math.cos(angle) * radius,
      patrolCenter.current.y,
      patrolCenter.current.z + Math.sin(angle) * radius
    );
  };

  const playAnimation = (animationName: string) => {
    if (actions[animationName] && mixerRef.current) {
      // Stop all current animations
      Object.values(actions).forEach(action => action?.stop());
      // Play new animation
      actions[animationName]?.play();
    }
  };

  // AI behavior update
  useFrame((state, delta) => {
    timeRef.current += delta;

    if (!meshRef.current || enemy.health <= 0) return;

    // Update animation mixer
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    const playerDistance = new THREE.Vector3()
      .subVectors(
        new THREE.Vector3(character.position.x, character.position.y, character.position.z),
        new THREE.Vector3(enemy.position.x, enemy.position.y, enemy.position.z)
      );

    const distanceToPlayer = playerDistance.length();
    const currentPos = new THREE.Vector3(enemy.position.x, enemy.position.y, enemy.position.z);

    // AI State Machine
    switch (aiState) {
      case 'PATROL':
        // Check if player is in aggro range
        if (distanceToPlayer <= config.behavior.aggroRange) {
          setAiState('CHASE');
          playAnimation('run');
          break;
        }

        // Move towards patrol target
        const patrolDirection = new THREE.Vector3()
          .subVectors(patrolTarget.current, currentPos)
          .normalize();

        if (patrolDirection.length() < 0.5) {
          generatePatrolTarget();
        }

        velocityRef.current.copy(patrolDirection.multiplyScalar(enemy.speed * 0.5));
        playAnimation('walk');
        break;

      case 'CHASE':
        // Check if player escaped aggro range
        if (distanceToPlayer > config.behavior.aggroRange * 1.5) {
          setAiState('PATROL');
          playAnimation('walk');
          break;
        }

        // Check if close enough to attack
        if (distanceToPlayer <= config.behavior.attackRange) {
          setAiState('ATTACK');
          playAnimation('attack');
          break;
        }

        // Chase player
        const chaseDirection = playerDistance.normalize();
        velocityRef.current.copy(chaseDirection.multiplyScalar(enemy.speed));
        
        // Face the player
        if (meshRef.current) {
          const targetRotation = Math.atan2(chaseDirection.x, chaseDirection.z);
          meshRef.current.rotation.y = THREE.MathUtils.lerp(
            meshRef.current.rotation.y,
            targetRotation,
            delta * 5
          );
        }
        break;

      case 'ATTACK':
        const now = Date.now();
        
        // Check attack cooldown
        if (now - lastAttackTime >= config.behavior.attackCooldown) {
          // Perform attack
          if (distanceToPlayer <= config.behavior.attackRange) {
            damageCharacter();
            setLastAttackTime(now);
            
            // Add screen shake effect
            // This would be handled by the camera controller
          }
          
          setAiState('CHASE');
          playAnimation('run');
        }
        
        // Stop movement during attack
        velocityRef.current.set(0, 0, 0);
        break;

      case 'STUNNED':
        // Handle stun state (could be from powerups)
        velocityRef.current.set(0, 0, 0);
        playAnimation('hit');
        
        // Auto-recover after stun duration
        setTimeout(() => {
          if (aiState === 'STUNNED') {
            setAiState('CHASE');
          }
        }, 1000);
        break;
    }

    // Apply movement
    const newPosition = currentPos.add(velocityRef.current.clone().multiplyScalar(delta));
    
    // Keep enemy on ground level
    newPosition.y = enemy.position.y;

    // Update position in store
    updateEnemyPosition();
    updateEnemyVelocity();

    // Update mesh position
    if (meshRef.current) {
      meshRef.current.position.copy(newPosition);
    }
  });

  // Handle death
  useEffect(() => {
    if (enemy.health <= 0) {
      playAnimation('death');
      setAiState('DEAD');
      
      // Remove after death animation
      setTimeout(() => {
        removeEnemy();
        addScore();
      }, 1000);
    }
  }, [enemy.health]);

  return (
    <group ref={meshRef} position={[enemy.position.x, enemy.position.y, enemy.position.z]}>
      {/* Main bot body */}
      <mesh>
        <boxGeometry args={[1, 1.5, 0.8]} />
        <meshStandardMaterial
          color="#8B0000"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Robot head */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial
          color="#A52A2A"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Glowing red eyes */}
      <mesh position={[-0.15, 1.1, 0.31]}>
        <sphereGeometry args={[0.08]} />
        <meshBasicMaterial color="#FF0000" />
      </mesh>
      <mesh position={[0.15, 1.1, 0.31]}>
        <sphereGeometry args={[0.08]} />
        <meshBasicMaterial color="#FF0000" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.8, 0.5, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial
          color="#8B0000"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.8, 0.5, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial
          color="#8B0000"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.3, -0.8, 0]}>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshStandardMaterial
          color="#654321"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0.3, -0.8, 0]}>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshStandardMaterial
          color="#654321"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Aggro range indicator (debug - only visible when chasing) */}
      {aiState === 'CHASE' && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[config.behavior.aggroRange - 0.5, config.behavior.aggroRange, 16]} />
          <meshBasicMaterial
            color="#FF4444"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Attack range indicator when attacking */}
      {aiState === 'ATTACK' && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[config.behavior.attackRange - 0.2, config.behavior.attackRange, 16]} />
          <meshBasicMaterial
            color="#FF0000"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* FUD spreading particle effect */}
      {aiState === 'CHASE' && (
        <group>
          {[...Array(6)].map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 3,
                Math.random() * 2,
                (Math.random() - 0.5) * 3
              ]}
            >
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial
                color="#8B0000"
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Health bar */}
      <group position={[0, 2, 0]}>
        <mesh>
          <planeGeometry args={[1.2, 0.1]} />
          <meshBasicMaterial color="#FF0000" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.001]} scale={[(enemy.health / config.health), 1, 1]}>
          <planeGeometry args={[1.2, 0.1]} />
          <meshBasicMaterial color="#00FF00" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Directional light for dramatic effect */}
      {meshRef.current && (
        <spotLight
          color="#FF4444"
          intensity={0.5}
          distance={8}
          angle={Math.PI / 6}
          penumbra={0.5}
          position={[0, 3, 0]}
          target={meshRef.current}
        />
      )}
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/enemies/bearbot.glb');