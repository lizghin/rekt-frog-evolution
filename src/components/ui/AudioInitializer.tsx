'use client';

import { useEffect } from 'react';
import { soundManager } from '@/lib/audio/soundManager';

export function AudioInitializer() {
  useEffect(() => {
    // Initialize audio on first user interaction
    const initAudio = async () => {
      await soundManager.initSounds();
    };

    // Try to initialize immediately
    initAudio();

    // Also initialize on first user interaction (for browsers that require it)
    const handleUserInteraction = async () => {
      await initAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return null; // This component doesn't render anything
}
