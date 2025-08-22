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
      // Depth of Field settings
      dof: {
        focusDistance: 10,
        focalLength: 50,
        bokehScale: 2,
        height: 480,
      },
    },
  
    lights: {
      // 3-point lighting setup
      key: {
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
      fill: {
        position: [-20, 20, -10] as [number, number, number],
        intensity: 0.4,
        color: '#87CEEB',
      },
      rim: {
        position: [0, 30, -30] as [number, number, number],
        intensity: 0.6,
        color: '#FF6B6B',
      },
      // God rays light (behind character)
      godRays: {
        position: [0, 20, -20] as [number, number, number],
        intensity: 0.8,
        color: '#FFD700',
        volumetric: true,
      },
    },
  
    postfx: {
      bloom: {
        intensity: 0.8,
        luminanceThreshold: 0.85,
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
      // Quality-based settings
      quality: {
        low: {
          bloom: { intensity: 0.5, luminanceThreshold: 0.9 },
          vignette: { offset: 0.1, darkness: 0.6 },
          smaa: false,
          dof: false,
          godRays: false,
        },
        medium: {
          bloom: { intensity: 0.6, luminanceThreshold: 0.8 },
          vignette: { offset: 0.15, darkness: 0.7 },
          smaa: true,
          dof: false,
          godRays: false,
        },
        high: {
          bloom: { intensity: 0.8, luminanceThreshold: 0.85 },
          vignette: { offset: 0.2, darkness: 0.8 },
          smaa: true,
          dof: true,
          godRays: true,
        },
        ultra: {
          bloom: { intensity: 1.0, luminanceThreshold: 0.8 },
          vignette: { offset: 0.25, darkness: 0.9 },
          smaa: true,
          dof: true,
          godRays: true,
        },
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