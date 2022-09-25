import fs from "fs";

const words = [
  "bbox",
  "codelyzer",
  "codepoint",
  "compodoc",
  "compodocrc",
  "devkit",
  "devtool",
  "esnext",
  "flexbox",
  "fontfaceobserver",
  "gitbook",
  "glyphnames",
  "gpos",
  "gsub",
  "Helvetica",
  "hoverable",
  "Laravel",
  "lcov",
  "lerp",
  "lightgray",
  "macOS",
  "PIXI",
  "preprocessor",
  "pyplot",
  "range",
  "redist",
  "renderer",
  "Roboto",
  "sfdir",
  "shiki",
  "sloc",
  "smufl",
  "sourcemap",
  "sveltejs",
  "tinybench",
  "tsbuild",
  "tsbuildinfo",
  "tslib",
  "typechecking",
  "typedefs",
  "typedoc",
  "vite",
  "vitest",
  "woff",
  "eslint",
  "eslintignore",
  "eslintrc",
];

const today = new Date().toISOString().slice(0, 16).replace("T", " ");

function insertData(filename) {
  fs.writeFileSync(filename,
    fs.readFileSync(filename, "utf-8")
      .replace(/```json([\s\S]*?)```/m, () => {
        const body = JSON.stringify(words, null, 2).split("\n").map(l => `    ${l}`).join("\n");
        return `
    \`\`\`jsonc
    // updated ${today}
    // https://github.com/marr11317/vscode-cspell-tech-config
    "cSpellTech.enabled": true,
    "cSpellTech.expand": false,
    "cSpell.userWords": ${body.trimStart()},
\`\`\``.trim();
      }),
    "utf-8",
  );
}

insertData("README.md");
insertData("extension/README.md");
