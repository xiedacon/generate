'use strict'

const fs = require('fs')
const { execSync } = require('child_process')

module.exports = (opts) => {
  let { encoding } = opts

  try {
    fs.readdirSync(`${process.cwd()}/.git`)
    console.log('Git already init')
  } catch (err) {
    if (err.message.indexOf('no such file or directory') < 0) throw err
    else {
      execSync(`
      git init
      git add .
      git commit -m 'init by https://github.com/xiedacon/generate'
      git remote add origin https://github.com/${opts.user}/${opts.project}.git
    `, { encoding, cwd: process.cwd(), stdio: [process.stdin, process.stdout, process.stderr] })
    }
  }
}
