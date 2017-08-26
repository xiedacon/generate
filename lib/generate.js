'use strict'

const fs = require('fs')
const { join, relative } = require('path')
const { render } = require('art-template')

const encoding = 'utf8'
const templatePath = join(__dirname, '../templates')
const pluginsPath = join(__dirname, '../plugins')
const plugins = fs.readdirSync(pluginsPath).map((path) => {
  return {
    name: path.split('.')[0],
    do: require(join(pluginsPath, path))
  }
})

// move git to last
plugins.sort((p, n) => {
  return p.name === 'git'
})

module.exports = (config) => {
  let path = join(templatePath, config.template)

  let dirsAndFiles = getDirsAndFiles(path)

  render_(dirsAndFiles, config)
  cp(path, process.cwd(), dirsAndFiles)

  // plugins
  if (!plugins || plugins.length === 0) return

  config.render = render
  plugins.forEach((plugin) => {
    tryPlugin(plugin, config)
  })
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

function render_ (dirsAndFiles, data) {
  dirsAndFiles.forEach((dirOrFile) => {
    if (dirOrFile.type === 'd') return

    dirOrFile.content = render(dirOrFile.content, data)
  })
}

function cp (from, to, dirsAndFiles) {
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
  } catch (error) {
    console.error(`Try plugin fail: ${plugin.name}`)
  }
}
