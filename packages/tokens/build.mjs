// Generates platform token files from tokens.json.
// Usage: node packages/tokens/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const t = JSON.parse(readFileSync(join(here, "tokens.json"), "utf8"));
const kebab = (s) => s.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
const banner = "GENERATED from packages/tokens/tokens.json by build.mjs. Do not edit.";

// ---- CSS ----
const cssVars = (o, prefix, unit = "") =>
  Object.entries(o).map(([k, v]) => `  --${prefix}-${kebab(k)}: ${v}${unit};`).join("\n");
const fontStack = `var(--font-latin, "${t.font.family}"), var(--font-deva, "${t.font.familyDevanagari}"), system-ui, sans-serif`;
const css = `/* ${banner} */
:root {
${cssVars(t.color.light, "c")}
  --font: ${fontStack};
  --font-mono: "${t.font.familyMono}", ui-monospace, monospace;
${cssVars(t.size, "fs", "px")}
${cssVars(t.radius, "r", "px")}
${cssVars(t.space, "s", "px")}
${cssVars(t.motion, "d", "ms")}
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${cssVars(t.color.dark, "c").replace(/^/gm, "  ")}
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
${cssVars(t.color.dark, "c")}
  color-scheme: dark;
}
`;
const cssOut = join(root, "apps/web/src/styles/tokens.css");
mkdirSync(dirname(cssOut), { recursive: true });
writeFileSync(cssOut, css);

// ---- Dart ----
const hex = (h) => "0xFF" + h.replace("#", "").toUpperCase();
const dartColors = (o) =>
  Object.entries(o).map(([k, v]) => `    ${k}: Color(${hex(v)}),`).join("\n");
const fields = Object.keys(t.color.light);
const dart = `// ${banner}
// ignore_for_file: constant_identifier_names
import 'package:flutter/painting.dart';

class SideraColors {
  const SideraColors({
${fields.map((f) => `    required this.${f},`).join("\n")}
  });
${fields.map((f) => `  final Color ${f};`).join("\n")}

  static const light = SideraColors(
${dartColors(t.color.light)}
  );

  static const dark = SideraColors(
${dartColors(t.color.dark)}
  );
}

class SideraFont {
  static const family = '${t.font.family}';
  static const familyDevanagari = '${t.font.familyDevanagari}';
  static const familyMono = '${t.font.familyMono}';
}

class SideraSize {
${Object.entries(t.size).map(([k, v]) => `  static const double ${k} = ${v};`).join("\n")}
}

class SideraRadius {
${Object.entries(t.radius).map(([k, v]) => `  static const double ${k} = ${v};`).join("\n")}
}

class SideraSpace {
${Object.entries(t.space).map(([k, v]) => `  static const double s${k} = ${v};`).join("\n")}
}

class SideraMotion {
${Object.entries(t.motion).map(([k, v]) => `  static const Duration ${k} = Duration(milliseconds: ${v});`).join("\n")}
}
`;
const dartOut = join(root, "apps/mobile/lib/theme/tokens.g.dart");
mkdirSync(dirname(dartOut), { recursive: true });
writeFileSync(dartOut, dart);
console.log("wrote", cssOut, "and", dartOut);

// ---- Copy (user-facing strings, shared by both clients) ----
const copySrc = readFileSync(join(root, "packages/copy/en.json"), "utf8");
for (const out of ["apps/web/src/copy/en.json", "apps/mobile/assets/copy/en.json"]) {
  mkdirSync(dirname(join(root, out)), { recursive: true });
  writeFileSync(join(root, out), copySrc);
}
console.log("copied packages/copy/en.json to web and mobile");
