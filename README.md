# npSoftware.co.uk Jekyll Website

Source for [www.npsoftware.co.uk](https://www.npsoftware.co.uk), built with Jekyll 4.

## Setting up WSL (Ubuntu)

Install Ruby and the build tools:

```bash
sudo apt update
sudo apt install ruby-full build-essential zlib1g-dev
```

Install Bundler for your user (no `sudo`), and put its bin directory on your `PATH`:

```bash
gem install --user-install bundler
echo 'export PATH="$(ruby -e "print Gem.user_dir")/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Install the site's gems into `vendor/bundle` (ignored by git):

```bash
bundle config set --local path vendor/bundle
bundle install
```

## Building and previewing

```bash
bundle exec jekyll build              # output in _site/
bundle exec jekyll serve --livereload # http://127.0.0.1:4000
```

When the repository is on the Windows drive (`/mnt/...`), file watching can be unreliable. Use `bundle exec jekyll serve --force_polling` or `--no-watch` if changes are not picked up.

## Writing a post

```bash
./initpost.sh -c My New Post Title
```

This creates `_posts/YYYY-MM-DD-my-new-post-title.md` with the front matter filled in.

## Updating gems

```bash
bundle update
bundle exec jekyll build
```

Commit the updated `Gemfile.lock`.

## Deployment

- `.github/workflows/build.yml` builds every push and pull request. It never deploys.
- `.github/workflows/deploy.yml` deploys when a `v*` tag is pushed on a commit that is in `master`. It builds the site, syncs `_site/` to S3 and invalidates CloudFront.

To release, merge to `master`, then publish a GitHub release with a new tag such as `v2026.10.18`, or push a tag directly:

```bash
git tag v2026.10.18
git push origin v2026.10.18
```
