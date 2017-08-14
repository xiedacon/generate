# generate

[![Build Status](https://travis-ci.org/xiedacon/generate.svg?branch=master)](https://travis-ci.org/xiedacon/generate)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/xiedacon/generate/blob/master/LICENSE)

A tool to generate your repositories with template

## Usage

```
sudo ln -s /path-to/generate/bin/generate /usr/local/bin/generate

mkdir test
cd test
generate -u yourname -r repositoryname
```

## Options

```generate [options]```

### -u, --user

> User name ( default nobody )

### -r, --repository

> Repository name ( default norepository )

### -t, --template

> Choose a template to generate repository, in templates directory ( default github )

### -l, --license

> License to repository ( default MIT )

### -c, --config

> Specify a config

### -h, --help

> Output usage information

## Specify a config

By default, we use:

```js
{
  "user": "nobody",
  "repository": "norepository",
  "template": "github",
  "license": "MIT",
  "git": true
}
```

You can specify a config with ``generate -c path``.

When ``git`` is true, it will push init commit to origin repository.

All the fields in config, are took as global variables to the template engine.

## Make your own

Fork it and specify your own template in ``templates`` directory.

## License

[MIT License](https://github.com/xiedacon/generate/blob/master/LICENSE)

Copyright (c) 2017 xiedacon
