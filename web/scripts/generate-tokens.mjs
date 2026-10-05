#!/usr/bin/env node
// Lê o frontmatter YAML de DESIGN.md (raiz do repo) e gera
// src/tokens/tokens.css (bloco @theme do Tailwind v4) e src/tokens/tokens.ts.
//
// D-08 (docs/decisoes/log.md): DESIGN.md é o compilador dos tokens.
// Ninguém replica valor à mão em web/. Rode `npm run tokens` após editar DESIGN.md.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parse as parseYaml } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..");
const designPath = join(repoRoot, "DESIGN.md");
const outDir = join(__dirname, "..", "src", "tokens");

const raw = readFileSync(designPath, "utf8");
const match = raw.match(/^---\n([\s\S]*?)\n---/);
if (!match) {
  throw new Error(`DESIGN.md sem frontmatter YAML reconhecível: ${designPath}`);
}
const tokens = parseYaml(match[1]);

for (const required of ["colors", "typography", "rounded", "spacing"]) {
  if (!tokens[required]) {
    throw new Error(`DESIGN.md: frontmatter sem a chave "${required}"`);
  }
}

const CSS_HEADER =
  "/* GERADO por web/scripts/generate-tokens.mjs a partir de DESIGN.md — não edite à mão. D-08. */";
const TS_HEADER =
  "// GERADO por web/scripts/generate-tokens.mjs a partir de DESIGN.md — não edite à mão. D-08.";

const FONT_VARS = {
  Archivo: "var(--font-archivo)",
  "IBM Plex Mono": "var(--font-ibm-plex-mono)",
};

const lines = [CSS_HEADER, "", "@theme {"];

for (const [name, hex] of Object.entries(tokens.colors)) {
  lines.push(`  --color-${name}: ${hex};`);
}
lines.push("");

for (const [name, radius] of Object.entries(tokens.rounded)) {
  lines.push(`  --radius-${name}: ${radius};`);
}
lines.push("");

for (const [name, space] of Object.entries(tokens.spacing)) {
  lines.push(`  --spacing-${name}: ${space};`);
}
lines.push("");

for (const [name, t] of Object.entries(tokens.typography)) {
  lines.push(`  --text-${name}: ${t.fontSize};`);
  lines.push(`  --text-${name}--line-height: ${t.lineHeight};`);
  lines.push(`  --font-weight-${name}: ${t.fontWeight};`);
  if (t.letterSpacing) lines.push(`  --tracking-${name}: ${t.letterSpacing};`);
}

lines.push("}", "");

// Tailwind v4 acopla --text-*--line-height automaticamente à utility de
// font-size, mas não peso nem tracking. Para não replicar peso/tracking à
// mão em cada componente (o que D-08 proíbe), geramos uma utility composta
// por estilo de texto do DESIGN.md.
//
// --font-archivo e --font-ibm-plex-mono NÃO são definidos aqui: vêm do
// next/font em app/layout.tsx (.variable), que escolhe o family hasheado
// real. Este script só decide qual var usar por estilo de texto.
lines.push("@layer utilities {");
for (const [name, t] of Object.entries(tokens.typography)) {
  const family = FONT_VARS[t.fontFamily] ?? "var(--font-archivo)";
  const decls = [
    `font-family: ${family};`,
    `font-size: var(--text-${name});`,
    `line-height: var(--text-${name}--line-height);`,
    `font-weight: var(--font-weight-${name});`,
  ];
  if (t.letterSpacing) decls.push(`letter-spacing: var(--tracking-${name});`);
  if (t.textTransform) decls.push(`text-transform: ${t.textTransform};`);
  if (t.fontVariantNumeric) decls.push(`font-variant-numeric: ${t.fontVariantNumeric};`);

  lines.push(`  .text-style-${name} {`);
  for (const decl of decls) lines.push(`    ${decl}`);
  lines.push(`  }`);
}
lines.push("}", "");

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "tokens.css"), lines.join("\n"));

const tsOut = [
  TS_HEADER,
  "",
  "export const feelTokens = " + JSON.stringify(tokens, null, 2) + " as const;",
  "",
];
writeFileSync(join(outDir, "tokens.ts"), tsOut.join("\n"));

console.log(`tokens gerados em ${outDir} a partir de ${designPath}`);
