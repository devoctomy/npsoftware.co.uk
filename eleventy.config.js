import * as jekyll from "./_11ty/jekyll.js";
import * as profile from "./_11ty/profile.js";

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
    normalize_whitespace: jekyll.normalizeWhitespace,
    markdownify: (input) => jekyll.markdown.render(String(input ?? "")),
    split: jekyll.split,
    truncate: jekyll.truncate,
    truncatewords: jekyll.truncatewords,
    array_to_sentence_string: jekyll.arrayToSentenceString
  };
  for (const [name, fn] of Object.entries(filters)) eleventyConfig.addFilter(name, fn);

  // "3 min read", at 200 words a minute.
  eleventyConfig.addFilter("reading_time", (html) => {
    const words = jekyll.split(jekyll.stripHtml(html), " ").length;
    return `${Math.max(1, Math.round(words / 200))} min read`;
  });

  // Profile page (see _11ty/profile.js).
  eleventyConfig.addFilter("month", profile.formatMonth);
  eleventyConfig.addFilter("duration", (start, end) => profile.duration(start, end));
  eleventyConfig.addFilter("group_by_company", profile.groupByCompany);

  // The years that have posts, newest first, for the search page's filter.
  eleventyConfig.addFilter("post_years", (posts) =>
    [...new Set(posts.map((post) => post.date.getUTCFullYear()))].sort((a, b) => b - a)
  );

  // --- Collections --------------------------------------------------------

  // site.posts: newest first.
  eleventyConfig.addCollection("posts", (api) => jekyllPosts(api).reverse());

  // Profile roles, newest first, each with its rendered description.
  eleventyConfig.addCollection("experience", (api) =>
    api
      .getFilteredByGlob("profile/experience/*.md")
      .map((item) => {
        const role = { ...item.data };
        Object.defineProperty(role, "content", { enumerable: true, get: () => item.templateContent });
        return role;
      })
      .sort((a, b) => String(b.start).localeCompare(String(a.start)))
  );

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
