// Compare the built site in _site/ with another copy of the site, page by page.
//
//   npm run compare                        # against https://www.npsoftware.co.uk
//   npm run compare -- <url or directory>  # against another site or build
//
// Differences that don't change what a browser shows are ignored: line
// endings, whitespace between and inside tags, entity encoding, empty boolean
// attributes (async="" vs async) and the build time in the feed.

import fs from "node:fs";
import path from "node:path";

const SITE = "_site";
const other = process.argv[2] ?? "https://www.npsoftware.co.uk";
const isUrl = /^https?:\/\//.test(other);

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’", hellip: "…", ndash: "–", mdash: "—" };
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name] ?? m);

function normalize(text, file) {
  let s = text.replace(/\r\n?/g, "\n");
  if (file === "feed.xml") {
    // The channel's dates are the build time, and the generator names the build tool.
    const firstItem = s.indexOf("<item>");
    const head = firstItem === -1 ? s : s.slice(0, firstItem);
    s = head.replace(/<(pubDate|lastBuildDate|generator)>[^<]*<\/\1>/g, "<$1/>") + s.slice(head.length);
  }
  return decode(s)
    .replace(/(<[a-z][^>]*?\s[a-z-]+)=""/gi, "$1")
    .replace(/(<[a-z][^>]*?\s[a-z-]+)=""/gi, "$1")
    .replace(/\s*\/>/g, ">")
    .replace(/>\s+/g, ">")
    .replace(/\s+</g, "<")
    .replace(/\s+/g, " ")
    .trim();
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

async function readOther(rel) {
  if (!isUrl) {
    const file = path.join(other, rel);
    return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  }
  const url = `${other}/${rel.replace(/(^|\/)index\.html$/, "$1")}`;
  const res = await fetch(url);
  return res.ok ? res.text() : null;
}

// Show where two normalized strings first differ.
function firstDifference(a, b) {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  const from = Math.max(0, i - 80);
  return `    built: …${a.slice(from, i + 80)}…\n    other: …${b.slice(from, i + 80)}…`;
}

const pages = walk(SITE)
  .map((file) => path.relative(SITE, file).split(path.sep).join("/"))
  .filter((rel) => /\.(html|xml|json|txt)$/.test(rel))
  .sort();

let differences = 0;
for (const rel of pages) {
  const theirs = await readOther(rel);
  if (theirs === null) {
    console.log(`MISSING ${rel} (not in ${other})`);
    differences++;
    continue;
  }
  const a = normalize(fs.readFileSync(path.join(SITE, rel), "utf8"), rel);
  const b = normalize(theirs, rel);
  if (a !== b) {
    console.log(`DIFFERS ${rel}\n${firstDifference(a, b)}`);
    differences++;
  }
}

console.log(`\n${pages.length} pages compared with ${other}, ${differences} different.`);
process.exitCode = differences ? 1 : 0;
