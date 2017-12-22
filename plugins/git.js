'use strict'

const { execSync } = require('child_process')

module.exports = (opts) => {
  let { encoding } = opts

  let result = execSync(`
    git init
    git add .
    git commit -m 'init by https://github.com/xiedacon/generate'
    git remote add origin https://github.com/${opts.user}/${opts.project}.git
  `, { encoding, cwd: process.cwd(), stdio: [] })

  console.log(result)
}
