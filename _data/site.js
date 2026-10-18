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
  linkedin_username: "nickpateman",

  repo_url: "https://github.com/devoctomy/npsoftware.co.uk",

  // Settings for _layouts/compress.html.
  compress_html: {
    clippings: "all",
    comments: "all",
    endings: [],
    profile: false
  },

  // Home page: the status pill above the greeting (leave empty to hide it)
  // and the paragraph under it.
  status: "Under maintenance",
  intro: "This is my personal blog. It's having a bit of a refresh right now, so expect new posts soon.",

  // Links in the menu. `nav` matches a page's `nav` front matter to mark it
  // as the current page.
  links: [
    { title: "Home", url: "/", nav: "home" },
    { title: "About", url: "/about/", nav: "about" },
    { title: "Profile", url: "/profile/", nav: "profile" }
  ]
};
