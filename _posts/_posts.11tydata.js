// Posts keep their Jekyll URLs: /<file name without the date>/, e.g.
// _posts/2017-05-21-S8.md -> /S8/. Renaming a post file changes its URL.
export default {
  eleventyComputed: {
    permalink: (data) => `/${data.page.fileSlug}/`
  }
};
