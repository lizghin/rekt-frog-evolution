#!/bin/bash

echo "📦 Updating ESLint config..."

# Создаём минимальный ESLint конфиг, если его нет
if [ ! -f ".eslintrc.js" ]; then
  echo "module.exports = {
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};" > .eslintrc.js
  echo "✅ Создан .eslintrc.js с нужными правилами"
else
  echo "⚠️ Файл .eslintrc.js уже существует. Убедись, что в нём отключено 'react/react-in-jsx-scope'."
fi

echo "🧹 Запуск автофикса ESLint..."
npx eslint . --ext .ts,.tsx --fix

echo "✅ Готово! Проверь проект и запусти его снова:"
echo "   npm run dev"
