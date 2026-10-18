# AGENTS.md

Instructions for AI coding agents working in this repository.

## Rules

1. **Never run git commands that change anything, unless the user explicitly asks for that exact action in their current message.** This includes `add`, `rm`, `mv`, `commit`, `amend`, `reset`, `checkout`/`switch`, `stash`, `rebase`, `merge`, `tag`, `push` and branch create/delete. It also covers anything that changes GitHub: `gh pr create/merge/close`, `gh api` writes, releases and repository settings.
   - Read-only commands are fine: `git status`, `git log`, `git diff`, `git show`, `git branch --list`, `git archive`, `gh pr view`.
   - Delete, move and rename files with plain filesystem commands, not `git rm`/`git mv`.
   - A question about the release flow ("then we push and tag?") is a question, not an instruction.
   - Leave changes uncommitted in the working tree. The maintainer reviews, commits and pushes.
2. **No AI attribution.** Never add `Co-Authored-By`, "Generated with…" or similar lines to commits, PRs, tags or files.
3. **Pushing a `v*` tag deploys the live site.** Never create or push tags.
4. If an action is blocked or fails, stop and report it. Don't substitute a different or more destructive action.

## Project

Personal blog of Nick Pateman, served at https://www.npsoftware.co.uk from S3 behind CloudFront. It's an Eleventy (11ty) site, migrated from Jekyll and built to give the same pages, URLs and feeds.

- Config: `eleventy.config.js`. Jekyll-compatible Liquid filters and the Markdown setup live in `_11ty/jekyll.js`. Site settings (`site.*`, formerly `_config.yml`) are in `_data/site.js`.
- Templates are Liquid, in `_layouts/` and `_includes/`. Front matter is read as top-level variables (`title`, `description`, `image`, `tags`, `date`, `nav`). `page.url` is Eleventy's. Posts are in `collections.posts` (newest first) and tags in `collections.tagList` (`[tag, posts]` pairs).
- Layouts: `base` (head, header, footer, cookie notice) → `post` for posts, `page` for About and the cookie policy. `index.html` and `search/index.html` use `base` directly. `base` goes through `_layouts/compress.html`, which minifies the HTML in Liquid: it depends on the Ruby-style `split` filter in `_11ty/jekyll.js`, and it collapses newlines, so never put `//` comments in inline `<script>`.
- Design ("Friendly Modern"): `assets/css/main.css`, with the colours as custom properties on `:root` (accent `#D24726`). There's a dark theme: the same properties are redefined under `prefers-color-scheme: dark` (unless `data-theme="light"`) and under `:root[data-theme="dark"]`, so keep the two dark blocks in step, and use the properties rather than hard-coded colours. The header button cycles system / light / dark, saving the choice in `localStorage` (`npsoftware-theme`). An inline script in `_includes/head.html` applies it before the page draws. Icons are inline SVGs from `_includes/icon.html` (`{% include icon.html name="rss" px=18 %}`). Post cards come from `_includes/post-card.html`.
- Menu links are `site.links` in `_data/site.js`; a page's `nav` front matter marks its link as current. `site.status` (the home page pill, empty to hide it) and `site.intro` are there too.
- Search: `/search/` renders every post as a card, and `assets/js/main.js` filters them by text, tag and year, keeping the state in the URL (`?q=`, `?tag=`, `?year=`). Tag links go to `/search/?tag=<tag>`. There is no tags page: `/tags/` only redirects to search, turning `/tags/#x` into `/search/?tag=x`.
- `assets/js/main.js` also runs the cookie notice (dismissal kept in `localStorage`) and the posts' "Copy link" button. It has no dependencies.
- Posts: `_posts/`, Markdown. `_posts/_posts.11tydata.js` sets the permalink to `/<file name without the date>/`, so **renaming a post file changes its live URL**. Dates are UTC (`date: YYYY-MM-DD HH:MM:SS`).
- Markdown is markdown-it, set up to render like Jekyll's kramdown: GFM-style heading ids, kramdown's smart quotes and `--`/`---`/`...`, kramdown's list paragraph rule, and Rouge's `highlighter-rouge` markup around fenced code (there's no syntax highlighting).
- Profile (`/profile/`): `profile/index.md` holds the name, headline, location, `links`, `callouts` (an `icon` name and Markdown `text`, shown as tinted blocks under the summary) and grouped `skills` in front matter, with a summary as the Markdown body (layout `_layouts/profile.html`). Each role is a file in `profile/experience/`: front matter `company`, `role`, `employment`, `start`/`end` as quoted `"YYYY-MM"` (no `end` means current), `location`, `workplace` and `skills`, with the description as Markdown. They're `collections.experience` (newest first) and never pages of their own. Consecutive roles at the same company are grouped, and durations are worked out LinkedIn-style in `_11ty/profile.js`.
- `feed.xml` (RSS) and `sitemap.xml` are hand-written Liquid templates.
- `assets/` (CSS, JS, images) is copied as-is, with no build step.
- `temp/` is scratch space (for example, `temp/profile/` holds notes for writing site content). It's git-ignored, which also keeps Eleventy from building it.
- The footer version comes from `_data/build.js`: the deploy's tag (`GITHUB_REF_NAME`), else the tag on `HEAD`, else the short commit hash. It links to the tag or commit under `site.repo_url`.
- `initpost.sh -c <title>` creates a new post skeleton.

## Build

The supported environment is WSL2 Ubuntu. See `README.md` for setup.

```bash
npm ci
npm run build    # output in _site/
npm run serve    # http://localhost:8080
npm run compare  # compare _site/ with the live site
```

- When invoking from Windows, run through WSL: `wsl.exe -e bash -lc 'cd /mnt/e/Source/GitHub/npsoftware.co.uk && ...'`.
- Node version: `.nvmrc`. Keep dependencies pinned to exact versions, and commit `package-lock.json`.
- Before handing back changes that affect output, build and run `npm run compare`. Any difference it reports must be intended. `npm run compare -- <directory>` compares against another build, such as one made from `git archive HEAD` before your change.

## CI/CD

- `.github/workflows/build.yml` builds every push to any branch and every PR. It never deploys.
- `.github/workflows/deploy.yml` deploys only from `v*` tags on commits in `main`, for example by publishing a GitHub release. It checks the tag is on `main`, runs the Eleventy build, then `aws s3 sync --delete` and a CloudFront invalidation. A tag that isn't on `main` fails before anything is uploaded.
- The AWS credentials, bucket and distribution ID are secrets, and the deploy job runs in the `production` environment.
