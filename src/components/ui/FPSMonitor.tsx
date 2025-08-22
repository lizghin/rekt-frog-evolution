'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';

interface FPSMonitorProps {
  position?: [number, number, number];
}

export function FPSMonitor({ position = [10, 10, 0] }: FPSMonitorProps) {
  const fpsRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const fpsHistoryRef = useRef<number[]>([]);
  const lastQualityChangeRef = useRef(0);
  
  const { graphicsQuality, setGraphicsQuality } = useGameStore();
  
  useFrame((state) => {
    frameCountRef.current++;
    const currentTime = state.clock.elapsedTime;
    
    if (currentTime - lastTimeRef.current >= 1) {
      const currentFPS = frameCountRef.current;
      fpsRef.current = currentFPS;
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
      
      // Update FPS history (keep last 10 seconds)
      fpsHistoryRef.current.push(currentFPS);
      if (fpsHistoryRef.current.length > 10) {
        fpsHistoryRef.current.shift();
      }
      
      // Adaptive quality adjustment
      const avgFPS = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
      const timeSinceLastChange = currentTime - lastQualityChangeRef.current;
      
      // Downgrade if FPS < 50 for 3 seconds
      if (avgFPS < 50 && timeSinceLastChange > 3) {
        const qualityLevels = ['ultra', 'high', 'medium', 'low'] as const;
        const currentIndex = qualityLevels.indexOf(graphicsQuality);
        if (currentIndex < qualityLevels.length - 1) {
          setGraphicsQuality(qualityLevels[currentIndex + 1]);
          lastQualityChangeRef.current = currentTime;
          console.log(`🔄 Auto-downgraded to ${qualityLevels[currentIndex + 1]} (FPS: ${avgFPS.toFixed(1)})`);
        }
      }
      
      // Upgrade if FPS > 58 for 5 seconds
      if (avgFPS > 58 && timeSinceLastChange > 5) {
        const qualityLevels = ['low', 'medium', 'high', 'ultra'] as const;
        const currentIndex = qualityLevels.indexOf(graphicsQuality);
        if (currentIndex > 0) {
          setGraphicsQuality(qualityLevels[currentIndex - 1]);
          lastQualityChangeRef.current = currentTime;
          console.log(`🔄 Auto-upgraded to ${qualityLevels[currentIndex - 1]} (FPS: ${avgFPS.toFixed(1)})`);
        }
      }
    }
  });

  const avgFPS = fpsHistoryRef.current.length > 0 
    ? fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length 
    : fpsRef.current;

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 45) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Html position={position}>
      <div className="text-white text-sm bg-black/50 px-2 py-1 rounded font-mono">
        <div className={`${getFPSColor(avgFPS)}`}>
          FPS: {avgFPS.toFixed(0)}
        </div>
        <div className="text-xs text-gray-400">
          Quality: {graphicsQuality}
        </div>
      </div>
    </Html>
  );
}
