const { ESLint } = require("eslint");

(async function main() {
  const eslint = new ESLint();

  const results = await eslint.lintFiles(["."]);

  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  console.log(resultText);

  const errorCount = results.reduce((sum, res) => sum + res.errorCount, 0);

  if (errorCount > 0) {
    process.exitCode = 1;
    console.log("❌ Найдены ошибки! Исправь их и повтори.");
  } else {
    console.log("✅ Ошибок не найдено. Проект в порядке!");
  }
})();