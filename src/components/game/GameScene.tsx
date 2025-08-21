'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  Grid,
  Sky,
  Stats,
  PerspectiveCamera,
  Html,
  useProgress,
} from '@react-three/drei';
import * as THREE from 'three';

// NEW: постобработка
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';

// Game Components
import { FrogCharacter } from '@/components/three/FrogCharacter';
import { Coin } from '@/components/three/Coin';
// Если есть враги/пауэрапы — вернёшь позже
// import { RugPull } from '@/components/game/enemies/RugPull';
// import { BearBot } from '@/components/game/enemies/BearBot';
// import { UnrektBomb } from '@/components/game/powerups/UnrektBomb';
// import { LedgerShield } from '@/components/game/powerups/LedgerShield';
// import { GameLoop } from '@/components/game/GameLoop';

// Game State
import { useGameStore } from '@/store/gameStore';
// import { EnemyType, PowerUpType } from '@/types/game';

// NEW: наши графические константы
import { GRAPHICS } from '@/lib/constants/graphics';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-white text-center">
        <div className="text-2xl font-bold mb-4">🐸 Loading REKT Frog...</div>
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-400">{Math.round(progress)}%</div>
      </div>
    </Html>
  );
}

function GameWorld() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const { character, /*enemies, coins, powerUps,*/ isPlaying, settings } = useGameStore();

  // СВЕТ — читаем из констант
  const ambient = GRAPHICS.lights.ambient;
  const dir = GRAPHICS.lights.directional;

  // Режимы можно подправлять в зависимости от gameplay-состояния
  const ambientIntensity = isPlaying ? ambient.intensity : ambient.intensity + 0.1;
  const directionalIntensity = isPlaying ? dir.intensity : dir.intensity * 0.85;

  return (
    <>
      {/* Камера */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={GRAPHICS.camera.startPos}
        fov={GRAPHICS.camera.fov}
        near={GRAPHICS.camera.near}
        far={GRAPHICS.camera.far}
      />

      {/* Управление камерой */}
      <OrbitControls
        enablePan={GRAPHICS.camera.orbit.enablePan}
        enableZoom={GRAPHICS.camera.orbit.enableZoom}
        enableRotate={GRAPHICS.camera.orbit.enableRotate}
        minDistance={GRAPHICS.camera.orbit.minDistance}
        maxDistance={GRAPHICS.camera.orbit.maxDistance}
        maxPolarAngle={GRAPHICS.camera.orbit.maxPolarAngle}
        autoRotate={GRAPHICS.camera.orbit.autoRotate && !isPlaying}
        autoRotateSpeed={GRAPHICS.camera.orbit.autoRotateSpeed}
      />

      {/* Свет */}
      <ambientLight intensity={ambientIntensity} color={ambient.color} />
      <directionalLight
        position={dir.position}
        intensity={directionalIntensity}
        color={dir.color}
        castShadow
        shadow-mapSize-width={dir.shadow.mapSize}
        shadow-mapSize-height={dir.shadow.mapSize}
        shadow-camera-far={dir.shadow.camera.far}
        shadow-camera-left={dir.shadow.camera.left}
        shadow-camera-right={dir.shadow.camera.right}
        shadow-camera-top={dir.shadow.camera.top}
        shadow-camera-bottom={dir.shadow.camera.bottom}
      />

      {/* Окружение / HDRI
         Позже можно заменить на файл из /public/hdr/*.hdr через <Environment files="/hdr/xxx.hdr" />
      */}
      <Environment preset="city" background blur={0.6} />
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
        rayleigh={0.5}
        turbidity={10}
        mieCoefficient={0.005}
        mieDirectionalG={0.7}
      />

      {/* Земля */}
      <mesh
        receiveShadow
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[GRAPHICS.ground.size.width, GRAPHICS.ground.size.depth]} />
        <meshStandardMaterial
          color={GRAPHICS.ground.color}
          roughness={GRAPHICS.ground.roughness}
          metalness={GRAPHICS.ground.metalness}
        />
      </mesh>

      {/* Сетка для ориентира (можно скрыть позже) */}
      <Grid
        position={[0, 0.01, 0]}
        args={[GRAPHICS.ground.size.width, GRAPHICS.ground.size.depth]}
        cellSize={5}
        cellThickness={0.5}
        cellColor="#3b3b3b"
        sectionSize={25}
        sectionThickness={1}
        sectionColor="#555"
        fadeDistance={100}
        fadeStrength={1}
      />

      {/* Главный персонаж */}
      <FrogCharacter />

      {/* Пример монет (если у тебя есть генерация — оставь её) */}
      <Coin id="c1" position={[3, 2, 1]} />
      <Coin id="c2" position={[-2, 3, -1]} />
      <Coin id="c3" position={[6, 1.5, 4]} />

      {/* Производительность (оставим для high/ultra) */}
      {settings?.graphics === 'ultra' && <Stats />}

      {/* Если у тебя был главный цикл — вернёшь позже */}
      {/* <GameLoop /> */}
    </>
  );
}

interface GameSceneProps {
  className?: string;
}

export function GameScene({ className = '' }: GameSceneProps) {
  const { settings } = useGameStore();

  // DPR и тени из конфига
  const quality = (settings?.graphics ?? 'high') as 'low' | 'medium' | 'high' | 'ultra';
  const dpr = GRAPHICS.renderer.dprByQuality[quality];
  const shadows = GRAPHICS.renderer.shadows[quality];
  const antialias = quality === 'high' || quality === 'ultra';

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows={shadows}
        dpr={dpr}
        gl={{
          antialias,
          alpha: false,
          stencil: false,
          depth: true,
          powerPreference: quality === 'low' ? 'low-power' : 'high-performance',
          preserveDrawingBuffer: false,
        }}
        camera={{ fov: GRAPHICS.camera.fov, near: GRAPHICS.camera.near, far: GRAPHICS.camera.far }}
      >
        <Suspense fallback={<Loader />}>
          <GameWorld />

          {/* Пост-обработка */}
          <EffectComposer>
            <Bloom
              intensity={GRAPHICS.postfx.bloom.intensity}
              luminanceThreshold={GRAPHICS.postfx.bloom.luminanceThreshold}
              luminanceSmoothing={GRAPHICS.postfx.bloom.luminanceSmoothing}
            />
            <Vignette
              eskil={GRAPHICS.postfx.vignette.eskil}
              offset={GRAPHICS.postfx.vignette.offset}
              darkness={GRAPHICS.postfx.vignette.darkness}
            />
            <Noise
              premultiply={GRAPHICS.postfx.noise.premultiply}
              opacity={GRAPHICS.postfx.noise.opacity}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}