// TrinovaQ site build: copy site/ into dist/, fill in the form endpoint, write CNAME.
// Zero dependencies. Run with: node build.mjs
import { readFileSync, writeFileSync, rmSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const SITE = join(ROOT, "site");
const DIST = join(ROOT, "dist");
const cfg = JSON.parse(readFileSync(join(ROOT, "config.json"), "utf8"));

// 1. The form endpoint must be a real Apps Script web app URL, so a placeholder can never ship
const ENDPOINT = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;
if (!ENDPOINT.test(cfg.formEndpoint || "")) {
  console.error("Build failed: config.json formEndpoint is not an Apps Script /exec URL.");
  process.exit(1);
}

// 2. Fresh copy of the site
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(SITE, DIST, { recursive: true });

// 3. Fill in build tokens
const js = join(DIST, "js", "main.js");
writeFileSync(js, readFileSync(js, "utf8").split("__FORM_ENDPOINT__").join(cfg.formEndpoint));

// 3b. Versioned links: the page asks for css/js by content hash, so a browser never pairs
//     a new page with a stylesheet or script it cached from an older release
{
  const page = join(DIST, "index.html");
  let html = readFileSync(page, "utf8");
  for (const f of ["css/style.css", "js/main.js"]) {
    const v = createHash("sha256").update(readFileSync(join(DIST, f))).digest("hex").slice(0, 10);
    const before = html;
    html = html.split('"' + f + '"').join('"' + f + "?v=" + v + '"');
    if (html === before) { console.error("Build failed: index.html does not link " + f); process.exit(1); }
  }
  writeFileSync(page, html);
}

// 4. Guard: the page and its files must all be there, with no tokens left
for (const f of ["index.html", "css/style.css", "js/main.js", "assets/logo-mark.svg", "Logo.jpg"]) {
  if (!existsSync(join(DIST, f))) { console.error("Build failed: missing " + f); process.exit(1); }
}
for (const f of ["index.html", "css/style.css", "js/main.js"]) {
  const left = readFileSync(join(DIST, f), "utf8").match(/__[A-Z0-9_]+__/g);
  if (left) { console.error("Build failed: unreplaced tokens in " + f + ": " + [...new Set(left)].join(", ")); process.exit(1); }
}
console.log("Built dist/ from site/");

// 5. Custom domain: emit CNAME so GitHub Pages serves the site on it
if (cfg.customDomain) {
  writeFileSync(join(DIST, "CNAME"), cfg.customDomain + "\n");
  console.log(`Wrote dist/CNAME (${cfg.customDomain})`);
}
