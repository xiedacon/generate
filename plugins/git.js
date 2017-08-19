'use strict'

const { spawnSync } = require('child_process')

const encoding = 'utf8'

module.exports = function git (opts) {
  spawnSync('git', ['init'])
  spawnSync('git', ['add', '.'])
  spawnSync('git', ['commit', '-m', 'init by https://github.com/xiedacon/generate'])
  spawnSync('git', ['remote', 'add', 'origin', `https://github.com/${opts.user}/${opts.repository}.git`])
  let result = spawnSync('git', ['push', '-u', 'origin', 'master'], { encoding })
  if (result.status !== 0) {
    console.error(result.stderr)
  } else {
    console.log(result.stdout)
  }
}
