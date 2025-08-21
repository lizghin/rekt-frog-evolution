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
