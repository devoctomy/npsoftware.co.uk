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
- Templates are Liquid, in `_layouts/` and `_includes/`. Front matter is read as top-level variables (`title`, `description`, `image`, `tags`, `date`). `page.url` is Eleventy's. Posts are in `collections.posts` (newest first) and tags in `collections.tagList`.
- The `default` and `minimal` layouts go through `_layouts/compress.html`, which minifies the HTML in Liquid. It depends on the Ruby-style `split` filter in `_11ty/jekyll.js`, so don't remove that.
- Posts: `_posts/`, Markdown. `_posts/_posts.11tydata.js` sets the permalink to `/<file name without the date>/`, so **renaming a post file changes its live URL**. Dates are UTC (`date: YYYY-MM-DD HH:MM:SS`).
- Markdown is markdown-it, set up to render like Jekyll's kramdown: GFM-style heading ids, kramdown's smart quotes and `--`/`---`/`...`, kramdown's list paragraph rule, and Rouge's `highlighter-rouge` markup around fenced code (there's no syntax highlighting).
- `feed.xml` (RSS), `sitemap.xml` and `search.liquid` (built to `/search.json`) are hand-written Liquid templates.
- `assets/` (CSS, JS, images) is copied as-is. `assets/css/main.css` and `assets/js/main.js` are hand-edited, with no build step.
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
