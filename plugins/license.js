'use strict'

const fs = require('fs')
const { join } = require('path')

const encoding = 'utf8'
const licenseDir = join(__dirname, '../license')

module.exports = (config) => {
  global.config = config
  let content = config.render(fs.readFileSync(join(licenseDir, config.license), { encoding }), global)
  delete global.config

  fs.writeFileSync(join(process.cwd(), 'LICENSE'), content, { encoding })
}
