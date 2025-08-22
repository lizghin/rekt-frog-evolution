'use client';

import { Suspense, useRef, Fragment } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  Grid,
  Sky,
  Stats,
  PerspectiveCamera,
  Html,
  useProgress,
  ContactShadows,
} from '@react-three/drei';
import * as THREE from 'three';

// Enhanced postprocessing
import { 
  EffectComposer, 
  Bloom, 
  Vignette, 
  Noise, 
  SMAA,
  DepthOfField,
  BrightnessContrast,
  HueSaturation,
} from '@react-three/postprocessing';

// Game Components
import { FrogCharacter } from '@/components/three/FrogCharacter';
import { Coin } from '@/components/three/Coin';
import { GameLoop } from '@/components/game/GameLoop';
import { FPSMonitor } from '@/components/ui/FPSMonitor';

// Game State
import { useGameStore, QUALITY_PRESETS } from '@/store/gameStore';

// Graphics constants
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
  const characterRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.Mesh>(null);

  const { 
    isPlaying, 
    graphicsQuality,
    focusDistance,
    focalLength
  } = useGameStore();

  // Get quality-based settings
  const qualityPreset = QUALITY_PRESETS[graphicsQuality];

  // 3-point lighting setup
  const keyLight = GRAPHICS.lights.key;
  const fillLight = GRAPHICS.lights.fill;
  const rimLight = GRAPHICS.lights.rim;
  const godRaysLight = GRAPHICS.lights.godRays;

  // Dynamic lighting based on game state
  const keyIntensity = isPlaying ? keyLight.intensity : keyLight.intensity * 0.85;
  const fillIntensity = isPlaying ? fillLight.intensity : fillLight.intensity * 0.9;

  return (
    <>
      {/* Camera with DoF */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={GRAPHICS.camera.startPos}
        fov={GRAPHICS.camera.fov}
        near={GRAPHICS.camera.near}
        far={GRAPHICS.camera.far}
      />

      {/* Camera controls */}
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

      {/* 3-Point Lighting Setup */}
      {/* Key Light */}
      <directionalLight
        position={keyLight.position}
        intensity={keyIntensity}
        color={keyLight.color}
        castShadow
        shadow-mapSize-width={keyLight.shadow.mapSize}
        shadow-mapSize-height={keyLight.shadow.mapSize}
        shadow-camera-far={keyLight.shadow.camera.far}
        shadow-camera-left={keyLight.shadow.camera.left}
        shadow-camera-right={keyLight.shadow.camera.right}
        shadow-camera-top={keyLight.shadow.camera.top}
        shadow-camera-bottom={keyLight.shadow.camera.bottom}
      />

      {/* Fill Light */}
      <directionalLight
        position={fillLight.position}
        intensity={fillIntensity}
        color={fillLight.color}
      />

      {/* Rim Light */}
      <directionalLight
        position={rimLight.position}
        intensity={rimLight.intensity}
        color={rimLight.color}
      />

      {/* God Rays Light (behind character) */}
      {qualityPreset.dof && (
        <directionalLight
          position={godRaysLight.position}
          intensity={godRaysLight.intensity}
          color={godRaysLight.color}
        />
      )}

      {/* Sun mesh for GodRays effect */}
      {qualityPreset.dof && (
        <mesh ref={sunRef} position={godRaysLight.position} visible={false}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color={godRaysLight.color} />
        </mesh>
      )}

      {/* Environment */}
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

      {/* Fog for depth */}
      <fog attach="fog" args={[GRAPHICS.fog.color, GRAPHICS.fog.near, GRAPHICS.fog.far]} />

      {/* Ground with contact shadows */}
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

      {/* Contact Shadows under character */}
      {qualityPreset.contactShadows && (
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.4}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />
      )}

      {/* Grid for reference */}
      <Grid
        position={[0, 0.02, 0]}
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

      {/* Character with ref for DoF */}
      <group ref={characterRef}>
        <FrogCharacter />
      </group>

      {/* Example coins */}
      <Coin id="c1" position={[3, 2, 1]} />
      <Coin id="c2" position={[-2, 3, -1]} />
      <Coin id="c3" position={[6, 1.5, 4]} />

      {/* FPS Monitor */}
      <FPSMonitor />

      {/* Performance stats for ultra quality */}
      {graphicsQuality === 'ultra' && <Stats />}

      {/* Game Loop */}
      <GameLoop />
    </>
  );
}

interface CinematicGameSceneProps {
  className?: string;
}

export function CinematicGameScene({ className = '' }: CinematicGameSceneProps) {
  const { graphicsQuality, focusDistance, focalLength } = useGameStore();

  // Quality-based renderer settings
  const qualityPreset = QUALITY_PRESETS[graphicsQuality];
  const dpr = qualityPreset.dpr;
  const shadows = qualityPreset.shadows;
  const antialias = graphicsQuality === 'high' || graphicsQuality === 'ultra';

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
          powerPreference: graphicsQuality === 'low' ? 'low-power' : 'high-performance',
          preserveDrawingBuffer: false,
        }}
        camera={{ 
          fov: GRAPHICS.camera.fov, 
          near: GRAPHICS.camera.near, 
          far: GRAPHICS.camera.far 
        }}
      >
        <Suspense fallback={<Loader />}>
          <GameWorld />

          {/* Enhanced Postprocessing Pipeline */}
          <EffectComposer>
            <Bloom
              intensity={qualityPreset.bloomIntensity}
              luminanceThreshold={0.85}
              luminanceSmoothing={0.2}
            />
            <Vignette
              eskil={false}
              offset={0.2}
              darkness={qualityPreset.vignetteDarkness}
            />
            <Noise
              premultiply={true}
              opacity={0.02}
            />
            <BrightnessContrast brightness={0.05} contrast={0.1} />
            <HueSaturation hue={0} saturation={0.1} />
            {qualityPreset.smaa ? <SMAA /> : <Fragment />}
            {qualityPreset.dof ? (
              <DepthOfField
                focusDistance={focusDistance}
                focalLength={focalLength}
                bokehScale={GRAPHICS.camera.dof.bokehScale}
                height={GRAPHICS.camera.dof.height}
              />
            ) : (
              <Fragment />
            )}
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
