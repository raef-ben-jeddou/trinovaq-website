// TrinovaQ site build: assemble src/ components into a single self-contained dist/index.html
// Zero dependencies. Run with: node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, "src");
const read = (p) => readFileSync(p, "utf8");

// 1. Resolve <!-- @include path --> recursively (paths relative to src/)
const INCLUDE = /<!--\s*@include\s+([^\s]+)\s*-->/g;
function assemble(file, seen = new Set()) {
  const abs = resolve(SRC, file);
  if (seen.has(abs)) throw new Error("Circular include: " + file);
  seen.add(abs);
  return read(abs).replace(INCLUDE, (_, inc) => assemble(inc, new Set(seen)));
}
let html = assemble("index.html");

// 2. Embed fonts as base64 (raw woff2 -> data URI token)
const FONTS = {
  __GS400__: "assets/fonts/general-sans-400.woff2",
  __GS500__: "assets/fonts/general-sans-500.woff2",
  __GS600__: "assets/fonts/general-sans-600.woff2",
  __POPPINS__: "assets/fonts/poppins-600.woff2",
};
for (const [token, path] of Object.entries(FONTS)) {
  const b64 = readFileSync(join(ROOT, path)).toString("base64");
  html = html.split(token).join(b64);
}

// 3. Inject Supabase config (publishable key is public by design, RLS-protected)
const cfg = JSON.parse(read(join(SRC, "config.json")));
html = html.split("__SUPA_URL__").join(cfg.supabaseUrl);
html = html.split("__SUPA_KEY__").join(cfg.supabaseAnonKey);

// 4. Guard: no build tokens may remain
const leftover = html.match(/__[A-Z0-9_]+__/g);
if (leftover) {
  console.error("Build failed: unreplaced tokens:", [...new Set(leftover)].join(", "));
  process.exit(1);
}

// 5. Write output
mkdirSync(join(ROOT, "dist"), { recursive: true });
const out = join(ROOT, "dist", "index.html");
writeFileSync(out, html);
console.log(`Built dist/index.html (${(html.length / 1024).toFixed(0)} KB)`);

// 6. Custom domain: emit CNAME so GitHub Pages serves the site on it
if (cfg.customDomain) {
  writeFileSync(join(ROOT, "dist", "CNAME"), cfg.customDomain + "\n");
  console.log(`Wrote dist/CNAME (${cfg.customDomain})`);
}
