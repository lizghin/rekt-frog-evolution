#!/bin/bash
echo "🔍 Запускается полная проверка ESLint..."

npx eslint . --ext .ts,.tsx,.js,.jsx,.json,.css,.md --format stylish

echo "✅ Проверка завершена."
