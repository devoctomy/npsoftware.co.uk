// Site-wide settings, available to templates as site.* (formerly _config.yml).
export default {
  title: "npSoftware",
  description: "Personal blog of Nick Pateman",
  baseurl: "",
  url: "https://www.npsoftware.co.uk",
  // Build time, used by the feed.
  time: new Date(),

  googletagmanagerid: "GTM-52DT3S",

  username: "Nick Pateman",
  user_description: "Tech Maniac and Solutions Architect",
  user_title: "Tech Maniac and Solutions Architect",
  email: "nick@npsoftware.co.uk",
  twitter_username: "npsoftwareuk",
  facebook_username: "npsoftwareuk",
  flipboard_username: "firkinfedup",

  repo_url: "https://github.com/devoctomy/npsoftware.co.uk",

  // Settings for _layouts/compress.html.
  compress_html: {
    clippings: "all",
    comments: "all",
    endings: [],
    profile: false
  },

  // Links in the menu.
  links: [
    { title: "Home", url: "/" },
    { title: "Tags", url: "/tags" },
    { title: "About Me", url: "/about" }
  ]
};
