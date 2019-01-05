# generate

[![Build Status](https://travis-ci.org/xiedacon/generate.svg?branch=master)](https://travis-ci.org/xiedacon/generate)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/xiedacon/generate/blob/master/LICENSE)

A tool to generate your repositories with template.

## Usage

```shell
sudo ln -s /path-to/generate/bin/generate /usr/local/bin/generate

if ~/.local/bin in PATH, you can follow this
ln -s /path-to/generate/bin/generate ~/.local/bin/generate

command -v generate
generate your-project-name
```

## API

There is no API to remember. just ``generate your-project-name``

## Plugins

After generate repository by template, we use plugins to do next.

Plugins must be a sync function.

## Make your own

Fork it and specify your own template in ``templates`` directory.

## License

[MIT License](https://github.com/xiedacon/generate/blob/master/LICENSE)

Copyright (c) 2017 xiedacon
