'use strict'

const { execSync } = require('child_process')

module.exports = (opts) => {
  let { encoding } = opts
  try {
    let result = execSync(`
      git init
      git add .
      git commit -m 'init by https://github.com/xiedacon/generate'
      git remote add origin https://github.com/${opts.user}/${opts.repository}.git
      git push -u orgin master
    `, { encoding, cwd: process.cwd(), stdio: [] })

    console.log(result)
  } catch (err) {
    if (err.toString().indexOf('远程 origin 已经存在') < 0) throw err

    execSync('git push --set-upstream origin master', { encoding, cwd: process.cwd() })
  }
}
