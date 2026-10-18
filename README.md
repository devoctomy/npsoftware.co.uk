# npSoftware.co.uk

Source for [www.npsoftware.co.uk](https://www.npsoftware.co.uk), built with [Eleventy](https://www.11ty.dev/).

## Setting up WSL (Ubuntu)

Install Node.js 22 or later (see `.nvmrc`), for example from the distro or with [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install
```

Then install the dependencies:

```bash
npm ci
```

## Building and previewing

```bash
npm run build   # output in _site/
npm run serve   # http://localhost:8080, rebuilds on change
npm run compare # compare _site/ with the live site
```

`npm run compare -- <url or directory>` compares against another copy of the site instead. It ignores differences a browser wouldn't show, such as whitespace and entity encoding.

## Writing a post

```bash
./initpost.sh -c My New Post Title
```

This creates `_posts/YYYY-MM-DD-my-new-post-title.md` with the front matter filled in. The post's URL is its file name without the date, e.g. `/my-new-post-title/`.

## Updating dependencies

```bash
npm outdated
npm install --save-exact <package>@<version>
npm run build
npm run compare
```

Commit the updated `package.json` and `package-lock.json`.

## Deployment

- `.github/workflows/build.yml` builds every push and pull request. It never deploys.
- `.github/workflows/deploy.yml` deploys when a `v*` tag is pushed on a commit that is in `main`. It builds the site, syncs `_site/` to S3 and invalidates CloudFront.

To release, merge to `main`, then publish a GitHub release with a new tag such as `v2026.10.18`, or push a tag directly:

```bash
git tag v2026.10.18
git push origin v2026.10.18
```
