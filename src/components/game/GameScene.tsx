'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  Sparkles,
  Stars
} from '@react-three/drei';
import { FrogCharacter } from '@/components/three/FrogCharacter';
import { Coin } from '@/components/three/Coin';

export function GameScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        shadows
        camera={{ position: [0, 8, 12], fov: 60 }}
        style={{ background: 'radial-gradient(circle, #1a1a2e 0%, #16213e 50%, #0f0f1e 100%)' }}
      >
        <Suspense fallback={null}>
          {/* ПРОДВИНУТОЕ ОСВЕЩЕНИЕ */}
          <ambientLight intensity={0.3} color="#4a5568" />
          <directionalLight 
            position={[10, 15, 5]} 
            intensity={1.2}
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          
          {/* ЦВЕТНЫЕ ACCENT LIGHTS */}
          <pointLight position={[-10, 5, -10]} intensity={0.5} color="#ff6b6b" />
          <pointLight position={[10, 5, 10]} intensity={0.5} color="#4ecdc4" />
          <pointLight position={[0, 10, 0]} intensity={0.3} color="#ffe66d" />

          {/* ГЛАВНЫЙ ПЕРСОНАЖ */}
          <FrogCharacter position={[0, 1, 0]} />

          {/* СТИЛЬНЫЕ ПЛАТФОРМЫ */}
          <mesh receiveShadow position={[0, -1, 0]}>
            <boxGeometry args={[40, 1, 20]} />
            <meshStandardMaterial 
              color="#2d3748"
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>

          {/* ВЫСОКИЕ ПЛАТФОРМЫ */}
          <mesh receiveShadow position={[5, 0, 3]} castShadow>
            <boxGeometry args={[3, 0.5, 3]} />
            <meshStandardMaterial 
              color="#4a5568"
              roughness={0.6}
              metalness={0.4}
              emissive="#1a365d"
              emissiveIntensity={0.1}
            />
          </mesh>
          
          <mesh receiveShadow position={[-4, 1, -2]} castShadow>
            <boxGeometry args={[2, 0.5, 2]} />
            <meshStandardMaterial 
              color="#4a5568"
              roughness={0.6}
              metalness={0.4}
              emissive="#2d1b69"
              emissiveIntensity={0.1}
            />
          </mesh>

          <mesh receiveShadow position={[2, 2, -5]} castShadow>
            <boxGeometry args={[4, 0.5, 2]} />
            <meshStandardMaterial 
              color="#4a5568"
              roughness={0.6}
              metalness={0.4}
              emissive="#553c9a"
              emissiveIntensity={0.1}
            />
          </mesh>

          {/* СУПЕР МОНЕТЫ */}
          <Coin position={[3, 2.5, 1]} id="coin1" />
          <Coin position={[-2, 3.5, -1]} id="coin2" />
          <Coin position={[6, 2, 4]} id="coin3" />
          <Coin position={[-3, 3, -3]} id="coin4" />
          <Coin position={[1, 4, -6]} id="coin5" />

          {/* PARTICLE EFFECTS */}
          <Sparkles 
            count={100}
            scale={[20, 10, 20]}
            size={2}
            speed={0.4}
            color="#ffd700"
          />
          
          <Stars 
            radius={100}
            depth={50}
            count={500}
            factor={4}
            saturation={0}
            fade
          />

          {/* ПРОФЕССИОНАЛЬНЫЕ ТЕНИ */}
          <ContactShadows 
            position={[0, -0.99, 0]} 
            opacity={0.8} 
            scale={30} 
            blur={3} 
            far={6}
            color="#1a365d"
          />
          
          {/* КРАСИВОЕ ОКРУЖЕНИЕ */}
          <Environment preset="night" />
          
          {/* УПРАВЛЕНИЕ КАМЕРОЙ */}
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            enableRotate={true}
            maxDistance={25}
            minDistance={5}
            maxPolarAngle={Math.PI / 2.2}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
