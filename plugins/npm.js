'use strict'

const { execSync } = require('child_process')

module.exports = (config) => {
  let encoding = config.encoding

  console.log(execSync('npm install', {
    encoding,
    cwd: process.cwd(),
    stdio: [process.stdin, process.stdout, process.stderr]
  }))
}
