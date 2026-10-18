import * as jekyll from "./_11ty/jekyll.js";

// Post dates, the feed and the version timestamps are all in UTC.
process.env.TZ = jekyll.TIMEZONE;

const POSTS = "_posts/*.md";

// Jekyll orders posts by date, then by file path.
const byDateThenPath = (a, b) => a.date - b.date || a.inputPath.localeCompare(b.inputPath);

// Shape a collection item like a Jekyll post, so templates read post.title,
// post.url, post.content and so on.
function toJekyllPost(item) {
  const post = { ...item.data, url: item.url, date: item.date, path: item.inputPath };
  Object.defineProperty(post, "content", { enumerable: true, get: () => item.templateContent });
  return post;
}

// Posts oldest first.
const jekyllPosts = (api) => api.getFilteredByGlob(POSTS).sort(byDateThenPath).map(toJekyllPost);

export default function (eleventyConfig) {
  // --- Inputs -------------------------------------------------------------

  for (const ignored of ["README.md", "AGENTS.md", "LICENSE", "initpost.sh", "_11ty/**", "scripts/**", "assets/**"]) {
    eleventyConfig.ignores.add(ignored);
  }

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("robots.txt");

  eleventyConfig.addTemplateFormats("xml");
  eleventyConfig.addExtension("xml", { key: "liquid" });

  // File-change events from the Windows drive don't reach WSL, so poll.
  // Only used by `npm run serve`.
  eleventyConfig.setChokidarConfig({ usePolling: true, interval: 500 });

  // --- Markdown and Liquid ------------------------------------------------

  eleventyConfig.setLibrary("md", jekyll.markdown);
  eleventyConfig.setLiquidOptions({
    jekyllInclude: true,
    dynamicPartials: false
  });

  const filters = {
    relative_url: (url) => url,
    date: jekyll.date,
    date_to_s: jekyll.dateToS,
    date_to_string: jekyll.dateToString,
    date_to_rfc822: jekyll.dateToRfc822,
    date_to_xmlschema: jekyll.dateToXmlschema,
    xml_escape: jekyll.xmlEscape,
    escape: jekyll.escape,
    strip_html: jekyll.stripHtml,
    strip_newlines: jekyll.stripNewlines,
    split: jekyll.split,
    truncate: jekyll.truncate,
    truncatewords: jekyll.truncatewords,
    array_to_sentence_string: jekyll.arrayToSentenceString
  };
  for (const [name, fn] of Object.entries(filters)) eleventyConfig.addFilter(name, fn);

  // --- Collections --------------------------------------------------------

  // site.posts: newest first.
  eleventyConfig.addCollection("posts", (api) => jekyllPosts(api).reverse());

  // site.tags as [tag, posts] pairs: tags in the order first seen walking
  // posts oldest first, and each tag's posts newest first.
  eleventyConfig.addCollection("tagList", (api) => {
    const tags = new Map();
    for (const post of jekyllPosts(api)) {
      for (const tag of post.tags ?? []) {
        if (!tags.has(tag)) tags.set(tag, []);
        tags.get(tag).unshift(post);
      }
    }
    return [...tags];
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["html", "md", "xml", "liquid"],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid"
  };
}
