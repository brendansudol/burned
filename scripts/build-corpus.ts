// scripts/build-corpus.ts
//
// Parses your source corpus (title + joke blocks separated by blank lines)
// into data/corpus.json keyed by slug, for use by lib/pipeline.ts.
//
// Usage:
//   1. Save the raw burns (jokes only, no preamble) to data/corpus.txt
//   2. npx tsx scripts/build-corpus.ts
//
// Duplicate titles ("Pickleball" appears twice, "Tennis" twice, etc.) get
// suffixed in order of appearance: pickleball, pickleball-2.

import fs from "node:fs";
import path from "node:path";

const inPath = process.argv[2] ?? "data/corpus.txt";
const outPath = process.argv[3] ?? "data/corpus.json";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[''’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const raw = fs.readFileSync(inPath, "utf8").trim();
const blocks = raw.split(/\n\s*\n/);

const out: Record<string, string> = {};
const slugCounts: Record<string, number> = {};
let skipped = 0;

for (const block of blocks) {
  const lines = block.trim().split("\n");
  const title = lines[0].trim().replace(/[.:]$/, "");
  const text = lines.slice(1).join("\n").trim();

  if (!title || !text) {
    skipped++;
    continue;
  }

  const base = slugify(title);
  slugCounts[base] = (slugCounts[base] ?? 0) + 1;
  const slug = slugCounts[base] > 1 ? `${base}-${slugCounts[base]}` : base;

  // Store with the title line included so few-shots render the way the
  // segment reads: target name, then the burn.
  out[slug] = `${title}\n${text}`;
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(
  `Wrote ${Object.keys(out).length} burns to ${outPath}` +
    (skipped ? ` (skipped ${skipped} malformed blocks)` : "")
);

// Sanity check: warn if any exemplar slugs are missing from the parsed corpus.
try {
  // Lazy require so this script works before lib compiles.
  const { EXEMPLARS } = require("../lib/exemplars");
  const missing = EXEMPLARS.filter((e: { slug: string }) => !out[e.slug]).map(
    (e: { slug: string }) => e.slug
  );
  if (missing.length) {
    console.warn(`WARNING — exemplar slugs not found in corpus:\n  ${missing.join("\n  ")}`);
  } else {
    console.log("All exemplar slugs resolved. ✓");
  }
} catch {
  console.log("(Skipped exemplar slug check — run again after deps are installed.)");
}
