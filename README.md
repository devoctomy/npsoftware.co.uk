# npSoftware.co.uk Jekyll Website

[![Build Status](https://travis-ci.org/devoctomy/npsoftware.co.uk.svg)](https://travis-ci.org/devoctomy/npsoftware.co.uk)

## Setting Up Environment in WSL

```
sudo apt update
sudo apt install ruby-full build-essential zlib1g-dev
```

```
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

```
gem install jekyll bundler
```

```
bundle install
```

```
bundle exec jekyll serve --no-watch
```
