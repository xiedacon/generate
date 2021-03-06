'use strict'

const { execSync } = require('child_process')

module.exports = (opts) => {
  let { encoding } = opts

  let result = execSync(`
    typings install dt~node --global
    echo '{}' > jsconfig.json
  `, { encoding, cwd: process.cwd(), stdio: [process.stdin, process.stdout, process.stderr] })

  console.log(result)
}
