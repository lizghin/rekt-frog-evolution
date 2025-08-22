// src/lib/audio/soundManager.ts
interface SoundManager {
  playCoin: () => void;
  playJump: () => void;
  playEvolution: () => void;
  playHit: () => void;
  initSounds: () => void;
}

class AudioManager implements SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isInitialized = false;

  async initSounds(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
      console.log('🎵 Audio manager initialized');
    } catch (error) {
      console.warn('Failed to initialize audio context:', error);
    }
  }

  private async loadSound(frequency: number, duration: number): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 2);
    }

    return buffer;
  }

  private async playSound(frequency: number, duration: number): Promise<void> {
    if (!this.audioContext || this.audioContext.state === 'suspended') {
      await this.audioContext?.resume();
    }

    if (!this.audioContext) return;

    try {
      const buffer = await this.loadSound(frequency, duration);
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Fade out effect
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      source.start();
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }

  async playCoin(): Promise<void> {
    await this.playSound(800, 0.1);
  }

  async playJump(): Promise<void> {
    await this.playSound(400, 0.15);
  }

  async playEvolution(): Promise<void> {
    // Ascending tone sequence
    await this.playSound(400, 0.1);
    setTimeout(() => this.playSound(600, 0.1), 100);
    setTimeout(() => this.playSound(800, 0.2), 200);
  }

  async playHit(): Promise<void> {
    await this.playSound(200, 0.2);
  }
}

// Singleton instance
export const soundManager = new AudioManager();

// Hook for easy access
export const useSoundManager = () => soundManager;
