#!/bin/bash

echo "🧼 Удаляем старую конфигурацию ESLint (.eslintrc.js)..."
rm -f .eslintrc.js

echo "🧾 Создаём новую конфигурацию eslint.config.mjs..."

cat > eslint.config.mjs << 'EOF'
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**'],
    plugins: {
      react,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-this-alias': 'off',
      'no-prototype-builtins': 'off',
    },
  },
];
EOF

echo "📦 Устанавливаем зависимости (если ещё не установлены)..."
pnpm add -D eslint @eslint/js typescript typescript-eslint eslint-plugin-react

echo "🧹 Запускаем автофиксацию ESLint..."
npx eslint . --ext .ts,.tsx --fix

echo "✅ Готово! Запусти проект: npm run dev или pnpm dev"
