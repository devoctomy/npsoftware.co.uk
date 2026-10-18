// Helpers that reproduce Jekyll 4 / Ruby Liquid 4 behaviour, so the Eleventy
// build outputs the same HTML and feeds as the old Jekyll build did.

import { DateTime } from "luxon";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";

export const TIMEZONE = "UTC";

// --- Markdown (kramdown GFM-alike) -----------------------------------------

// kramdown-parser-gfm's heading id: lower-case, drop anything that isn't a
// word character, dash or space, then spaces become dashes.
// "GitHub, Jekyll & Travis-CI" -> "github-jekyll--travis-ci".
const gfmSlug = (text) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, "")
    .replace(/[ \t]/g, "-");

// kramdown's smart quotes (kramdown/parser/kramdown/smart_quotes.rb). Each
// rule is tried in order at a quote; `before` is the unconsumed character
// just before it, if any. Returns the quote's replacement.
const SQ_PUNCT = String.raw`[!"#$%'()*+,\-./:;<=>?@[\\\]^_\`{|}~]`;
const SQ_CLOSE = /[^ \\\t\r\n[{(-]/;
const QUOTES = { "'": ["‘", "’"], '"': ["“", "”"] };
function kramdownQuote(quote, before, after) {
  const [open, close] = QUOTES[quote];
  if (/^[_*]{1,2}\S/.test(after)) return open;
  if (new RegExp(`^${SQ_PUNCT}(?!\\.\\.)\\B`).test(after)) return close;
  if (quote === "'" && /^\d\ds/.test(after)) return close;
  if (/\s/.test(before) && /^\w/.test(after)) return open;
  if (before && SQ_CLOSE.test(before)) return close;
  if (/^(\s|s\b|$)/.test(after)) return close;
  return open;
}

// kramdown's typographic symbols.
const SYMBOLS = { "---": "—", "--": "–", "...": "…" };

// Roughly the Markdown source a token came from, so a quote can look ahead
// past emphasis, links and code the way kramdown does.
function sourceOf(token) {
  switch (token.type) {
    case "text": return token.content;
    case "code_inline": return `\`${token.content}\``;
    case "softbreak": case "hardbreak": return "\n";
    case "link_open": return "[";
    case "link_close": return "](";
    case "html_inline": return token.content;
    default: return token.markup ?? "";
  }
}

// Replaces markdown-it's typographer with kramdown's rules.
function kramdownTypography(state) {
  for (const block of state.tokens) {
    if (block.type !== "inline") continue;
    const tokens = block.children;
    tokens.forEach((token, t) => {
      if (token.type !== "text") return;
      const rest = tokens.slice(t + 1).map(sourceOf).join("");
      const src = token.content;
      // A softbreak leaves its newline for the next text; any other markup
      // before this token has already been consumed.
      let before = tokens[t - 1]?.type === "softbreak" ? "\n" : "";
      let out = "";
      for (let i = 0; i < src.length; i++) {
        const symbol = ["---", "--", "..."].find((s) => src.startsWith(s, i));
        if (symbol) {
          out += SYMBOLS[symbol];
          i += symbol.length - 1;
          before = "";
        } else if (src[i] === "'" || src[i] === '"') {
          out += kramdownQuote(src[i], before, src.slice(i + 1) + rest);
          before = "";
        } else {
          out += src[i];
          before = src[i];
        }
      }
      token.content = out;
    });
  }
}

// kramdown only wraps a list item's text in <p> when the item has a blank
// line inside it or after it, even in a list where other items have one.
function kramdownListParagraphs(state) {
  const lines = state.src.split("\n");
  const isBlank = (n) => n < lines.length && !lines[n].trim();
  const tokens = state.tokens;
  tokens.forEach((token, i) => {
    if (token.type !== "list_item_open" || !token.map) return;
    const [start, end] = token.map;
    const hasBlank = Array.from({ length: end - start }, (_, k) => start + k).some(isBlank);
    if (hasBlank || isBlank(end)) return;
    const para = tokens[i + 1];
    if (para?.type !== "paragraph_open") return;
    para.hidden = true;
    tokens.slice(i + 2).find((tok) => tok.type === "paragraph_close" && tok.level === para.level).hidden = true;
  });
}

export const markdown = markdownIt({ html: true, xhtmlOut: true })
  .use(markdownItAnchor, { slugify: gfmSlug, tabIndex: false });
markdown.core.ruler.push("kramdown_typography", kramdownTypography);
markdown.core.ruler.push("kramdown_list_paragraphs", kramdownListParagraphs);

// Fenced code blocks get the markup Jekyll's Rouge highlighter produced (the
// CSS styles .highlight). There's no syntax highlighting.
markdown.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx];
  const lang = token.info.trim().split(/\s+/)[0] || "plaintext";
  const code = markdown.utils.escapeHtml(token.content);
  return `<div class="language-${lang} highlighter-rouge"><div class="highlight"><pre class="highlight"><code>${code}</code></pre></div></div>\n`;
};

// kramdown keeps a blank line between top-level blocks wherever the source
// had one; markdown-it doesn't.
markdown.render = function (src, env = {}) {
  const blocks = [];
  for (const token of markdown.parse(src, env)) {
    if (token.level === 0 && token.nesting >= 0) blocks.push({ tokens: [], map: token.map });
    blocks.at(-1).tokens.push(token);
  }
  return blocks
    .map((block, i) => {
      const html = markdown.renderer.render(block.tokens, markdown.options, env);
      const previous = blocks[i - 1];
      return previous?.map && block.map && block.map[0] > previous.map[1] ? `\n${html}` : html;
    })
    .join("");
};

// --- Liquid filters --------------------------------------------------------

function toDateTime(input) {
  if (input === "now" || input === "today") return DateTime.now().setZone(TIMEZONE);
  if (input instanceof Date) return DateTime.fromJSDate(input, { zone: TIMEZONE });
  if (typeof input === "string" && input.trim()) {
    const dt = DateTime.fromISO(input.trim(), { zone: TIMEZONE });
    if (dt.isValid) return dt;
  }
  return null;
}

const STRFTIME = {
  a: "ccc", A: "cccc", b: "LLL", B: "LLLL", d: "dd", e: "d", H: "HH", I: "hh",
  m: "MM", M: "mm", p: "a", S: "ss", T: "HH:mm:ss", y: "yy", Y: "yyyy", z: "ZZZ",
  "%": "'%'"
};

// Ruby Liquid `date`: strftime in the site timezone. Unparseable input is
// returned unchanged, as Ruby Liquid does.
export function date(input, format) {
  if (!format) return input;
  const dt = toDateTime(input);
  if (!dt) return input;
  return String(format).replace(/%(.)/g, (_, c) => {
    if (!(c in STRFTIME)) throw new Error(`date filter: unsupported directive %${c}`);
    return dt.setLocale("en-US").toFormat(STRFTIME[c]);
  });
}

// Ruby's Time#to_s, which is what Jekyll prints for a bare {{ post.date }}.
export const dateToS = (input) => date(input, "%Y-%m-%d %H:%M:%S %z");
export const dateToString = (input) => date(input, "%d %b %Y");
export const dateToRfc822 = (input) => date(input, "%a, %d %b %Y %H:%M:%S %z");

export function dateToXmlschema(input) {
  const dt = toDateTime(input);
  return dt ? dt.toFormat("yyyy-MM-dd'T'HH:mm:ssZZ") : input;
}

// Jekyll's xml_escape escapes & < > " but leaves ' alone.
const XML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
export const xmlEscape = (input) => String(input ?? "").replace(/[&<>"]/g, (c) => XML_ESCAPES[c]);

// Ruby Liquid strip_html; unlike liquidjs it also strips tags that span lines.
export const stripHtml = (input) =>
  String(input ?? "")
    .replace(/<script.*?<\/script>|<!--.*?-->|<style.*?<\/style>/gs, "")
    .replace(/<.*?>/gs, "");

export const stripNewlines = (input) => String(input ?? "").replace(/\r?\n/g, "");

export const normalizeWhitespace = (input) => String(input ?? "").replace(/[ \n\r\t\f\v]+/g, " ").trim();

// Ruby's String#split. A single space splits on runs of ASCII whitespace and
// ignores leading whitespace; any other separator is literal. Either way,
// trailing empty strings are dropped. _layouts/compress.html relies on this.
const RUBY_WHITESPACE = /[ \t\n\v\f\r]+/;
export function split(input, separator) {
  const str = String(input ?? "");
  if (str === "") return [];
  const sep = String(separator ?? "");
  let parts;
  if (sep === " ") parts = str.replace(/^[ \t\n\v\f\r]+/, "").split(RUBY_WHITESPACE);
  else if (sep === "") parts = Array.from(str);
  else parts = str.split(sep);
  while (parts.length && parts.at(-1) === "") parts.pop();
  return parts;
}

// Ruby Liquid 4 truncate: the ellipsis counts towards the length.
export function truncate(input, length = 50, ellipsis = "...") {
  if (input == null) return input;
  const chars = Array.from(String(input));
  const max = Number(length);
  if (chars.length <= max) return String(input);
  const keep = Math.max(0, max - Array.from(String(ellipsis)).length);
  return chars.slice(0, keep).join("") + ellipsis;
}

// Ruby Liquid 4 truncatewords. Text of exactly `words` words still gets the
// ellipsis, as it did in Jekyll.
export function truncatewords(input, words = 15, ellipsis = "...") {
  if (input == null) return input;
  const list = split(input, " ");
  const keep = Math.max(1, Number(words));
  return list.length >= keep ? list.slice(0, keep).join(" ") + ellipsis : String(input);
}

// Ruby's CGI.escapeHTML, used by Liquid's escape.
const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const escape = (input) => (input == null ? input : String(input).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]));

// Jekyll's array_to_sentence_string: "a", "a and b", "a, b, and c".
export function arrayToSentenceString(input, connector = "and") {
  const list = Array.isArray(input) ? input : [];
  if (list.length <= 1) return list.join("");
  if (list.length === 2) return `${list[0]} ${connector} ${list[1]}`;
  return `${list.slice(0, -1).join(", ")}, ${connector} ${list.at(-1)}`;
}
