'use strict'

const fs = require('fs')
const { join } = require('path')

const encoding = 'utf8'
const licenseDir = join(__dirname, '../license')

module.exports = (opts) => {
  let content = opts.render(fs.readFileSync(join(licenseDir, opts.license), { encoding }), opts)
  fs.writeFileSync(join(process.cwd(), 'LICENSE'), content, { encoding })
}
