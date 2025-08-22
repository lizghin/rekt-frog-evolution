// src/lib/constants/graphics.ts
export const GRAPHICS = {
    camera: {
      fov: 60,
      near: 0.1,
      far: 1000,
      startPos: [0, 10, 15] as [number, number, number],
      orbit: {
        enablePan: false,
        enableZoom: true,
        enableRotate: true,
        minDistance: 5,
        maxDistance: 25,
        maxPolarAngle: Math.PI / 2.2,
        autoRotate: false,
        autoRotateSpeed: 0.5,
      },
    },
  
    lights: {
      ambient: { intensity: 0.6, color: '#87CEEB' },
      directional: {
        position: [30, 40, 20] as [number, number, number],
        intensity: 1.2,
        color: '#FFD700',
        shadow: {
          mapSize: 2048,
          camera: {
            far: 120,
            left: -60,
            right: 60,
            top: 60,
            bottom: -60,
          },
        },
      },
    },
  
    postfx: {
      bloom: {
        intensity: 0.7,
        luminanceThreshold: 0.7,
        luminanceSmoothing: 0.2,
      },
      vignette: {
        eskil: false,
        offset: 0.2,
        darkness: 0.8,
      },
      noise: {
        premultiply: true,
        opacity: 0.04,
      },
    },
  
    renderer: {
      // подстройка под “качество” из стора, если есть
      dprByQuality: {
        low: 1,
        medium: 1.5,
        high: 2,
        ultra: 2,
      } as Record<'low' | 'medium' | 'high' | 'ultra', number>,
      shadows: {
        low: false,
        medium: true,
        high: true,
        ultra: true,
      } as Record<'low' | 'medium' | 'high' | 'ultra', boolean>,
    },
  
    ground: {
      size: { width: 100, depth: 50 },
      color: '#2F4F2F',
      roughness: 0.8,
      metalness: 0.1,
    },

    fog: {
      color: '#87CEEB',
      near: 10,
      far: 80,
    },
  } as const;