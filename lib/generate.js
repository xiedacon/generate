'use strict'

const fs = require('fs')
const { join, relative } = require('path')

const templatePath = join(__dirname, '../templates')

module.exports = (config) => {
  console.log('\nStart generate...')

  let path = join(templatePath, config.template)

  let dirsAndFiles = getDirsAndFiles(path)

  render(config, dirsAndFiles)
  cp(path, process.cwd(), dirsAndFiles, config.encoding)

  // plugins
  config.plugins.forEach((plugin) => {
    console.log(`\nUse plugin: ${plugin.name}`)
    tryPlugin(plugin, config)
  })

  console.log('\nGenerate finish')
}

// [{type:'',path:'',content:''}]
function getDirsAndFiles (path, paths = []) {
  let stat = fs.statSync(path)
  if (stat.isDirectory()) {
    paths.push({ type: 'd', path })
    fs.readdirSync(path).forEach((_path) => {
      getDirsAndFiles(join(path, _path), paths)
    })
  } else if (stat.isFile()) {
    paths.push({ type: 'f', path, content: fs.readFileSync(path, { encoding: 'utf8' }) })
  } else {
    console.error(`SKIP: ${path}\nREASON: type not support`)
  }

  return paths
}

function render (config, dirsAndFiles) {
  dirsAndFiles.forEach((dirOrFile) => {
    if (dirOrFile.type === 'd') return

    global.config = config
    dirOrFile.content = config.render(dirOrFile.content, global)
    delete global.config
  })
}

function cp (from, to, dirsAndFiles, encoding) {
  dirsAndFiles.forEach((dirOrFile) => {
    let path = join(to, relative(from, dirOrFile.path))

    if (path === to) return

    if (dirOrFile.type === 'd') {
      fs.mkdirSync(path)
    } else {
      fs.writeFileSync(path, dirOrFile.content, { encoding })
    }
  })
}

function tryPlugin (plugin, config) {
  try {
    plugin.do(config)
  } catch (err) {
    console.error(`\nTry plugin fail: ${plugin.name}`)
    console.error(err.toString())
  }
}
