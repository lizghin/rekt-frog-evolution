'use client';

import { useFrame } from '@react-three/fiber';
import { useActions, useIsPlaying } from '@/store/gameStore';

export function GameLoop() {
  const isPlaying = useIsPlaying();
  const { tick } = useActions();

  useFrame((state, delta) => {
    if (isPlaying) {
      // Convert delta from seconds to milliseconds
      const deltaMs = delta * 1000;
      tick(deltaMs);
    }
  });

  return null; // This component doesn't render anything
}