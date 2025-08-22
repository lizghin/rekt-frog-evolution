import js from '@eslint/js';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      '*.config.js',
      '*.config.ts',
    ],
    plugins: {
      react,
    },
    settings: {
      react: {
        version: '19.0.0',
      },
    },
    rules: {
      // React 19
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-this-alias': 'off',

      // Base JS
      'no-prototype-builtins': 'off',
      'no-undef': 'off',

      // Allow R3F props
      'react/no-unknown-property': [
        'error',
        {
          ignore: [
            'args',
            'transparent',
            'castShadow',
            'receiveShadow',
            'shadow-mapSize-width',
            'shadow-mapSize-height',
            'shadow-camera-far',
            'shadow-camera-left',
            'shadow-camera-right',
            'shadow-camera-top',
            'shadow-camera-bottom',
            'makeDefault',
            'fov',
            'near',
            'far',
            'position',
            'rotation',
            'scale',
            'color',
            'intensity',
            'distance',
            'sunPosition',
            'inclination',
            'azimuth',
            'rayleigh',
            'turbidity',
            'mieCoefficient',
            'mieDirectionalG',
            'cellSize',
            'cellThickness',
            'cellColor',
            'sectionSize',
            'sectionThickness',
            'sectionColor',
            'fadeDistance',
            'fadeStrength',
            'eskil',
            'offset',
            'darkness',
            'premultiply',
            'opacity',
            'luminanceThreshold',
            'luminanceSmoothing',
            'background',
            'blur',
            'attach',
            'roughness',
            'metalness',
            'emissive',
            'emissiveIntensity',
            'side',
            'visible',
            'angle',
            'penumbra',
            'decay',
          ],
        },
      ],

      // Allow case declarations
      'no-case-declarations': 'off',

      // Allow constant binary expressions
      'no-constant-binary-expression': 'off',
    },
  },
];
