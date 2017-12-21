# generate

[![Build Status](https://travis-ci.org/xiedacon/generate.svg?branch=master)](https://travis-ci.org/xiedacon/generate)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/xiedacon/generate/blob/master/LICENSE)

A tool to generate your repositories with template.

## Usage

```
sudo ln -s /path-to/generate/bin/generate /usr/local/bin/generate
command -v generate

mkdir test
cd test
generate -u yourname -p project
```

## API

```
  Usage: generate [options]
  
  Options:
  
    -c, --config [value]    Config to generate project (defaults to "/path/to/generate/config.json")
    -e, --encoding [value]  Encoding to generate project (defaults to "utf8")
    -h, --help              Output usage information
    -l, --license [value]   License to generate project: APACHE, GUN, MIT (defaults to "MIT")
    -p, --project [value]   Project name (defaults to "noproject")
    -r, --root              Root dir to generate project
    -t, --template [value]  Template to generate project: github (defaults to "github")
    -u, --user [value]      User name (defaults to "nobody")
    -v, --version           Output the version number

```

## Specify a config

By default, we use:

```js
{
  "user": "nobody",
  "project": "noproject",
  "template": "github",
  "license": "MIT",
  "plugins": [
    "license",
    "npm",
    "git"
  ],
  "encoding": "utf8",
  "engine": "art-template"
}
```

You can specify a config with ``generate -c path``. It will merge with default.

All the fields in config, are took as global variables to the template engine.

## Plugins

After generate repository by template, we use plugins to do next.

Plugins must be a sync function.

## Make your own

Fork it and specify your own template in ``templates`` directory.

## License

[MIT License](https://github.com/xiedacon/generate/blob/master/LICENSE)

Copyright (c) 2017 xiedacon
