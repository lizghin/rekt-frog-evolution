import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import js from '@eslint/js';

export default [
  { ignores: ['node_modules/**', '.next/**', 'public/**', '_backup_root_dupes/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaVersion: 2023,
        sourceType: 'module',
      },
      globals: {
        JSX: 'readonly',
        React: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
      },
    },
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: { version: 'detect' }, // для предупреждения плагина
    },
    rules: {
      // React 17+ / 19 — новая трансформация JSX, импорта React не требуется
      'react/react-in-jsx-scope': 'off',

      // В R3F часто используем нестандартные пропы на JSX-примитивах
      'react/no-unknown-property': 'off',

      // Чуть смягчённые правила, чтобы не мешали разработке
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off', // временно, пока MVP
      '@typescript-eslint/consistent-type-imports': 'warn',
      'no-case-declarations': 'warn',
      'no-prototype-builtins': 'off',
    },
  },
];

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
        version: 'detect',
      },
    },
    rules: {
      // React
      'react/react-in-jsx-scope': 'off',

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
    },
  },
];
