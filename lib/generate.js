'use strict'

const fs = require('fs')
const { join, relative } = require('path')
const args = require('args')
const { render } = require('art-template')

const encoding = 'utf8'
const configPath = join(__dirname, '../config.json')
const defaultConfig = JSON.parse(fs.readFileSync(configPath, { encoding }))
const licenses = fs.readdirSync(join(__dirname, '../license'))
const templatePath = join(__dirname, '../templates')
const templates = fs.readdirSync(templatePath)
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

args
  .option('user', 'User name', defaultConfig.user)
  .option('repository', 'Repository name', defaultConfig.repository)
  .option('template', `Template to generate repository: ${templates.join(', ')}`, 'github')
  .option('license', `License to repository: ${licenses.join(', ')}`, defaultConfig.license, license => license.toUpperCase())
  .option('year', 'Year to license. In most case, need\'t set', new Date().getFullYear())
  .option('config', 'Config to generate repository', `${configPath}`, (_configPath) => {
    if (_configPath === configPath) return

    return JSON.parse(fs.readFileSync(_configPath, { encoding }))
  })

module.exports = () => {
  let flags = getFlags()

  if (check(flags)) return

  let path = join(templatePath, flags.template)

  let dirsAndFiles = getDirsAndFiles(path)

  render_(dirsAndFiles, flags)
  cp(path, process.cwd(), dirsAndFiles)

  // plugins
  if (!plugins || plugins.length === 0) return

  flags.render = render
  plugins.forEach((plugin) => {
    tryPlugin(plugin, flags)
  })
}

function getFlags () {
  let flags = args.parse(process.argv)
  let userConfig = flags.config

  if (userConfig) {
    Object.keys(userConfig).forEach((key) => {
      userConfig[key.charAt(0)] = userConfig[key]
    })
    flags = Object.assign(flags, userConfig)
  }
  return flags
}

function check (flags) {
  if (licenses.indexOf(flags.license) < 0) {
    console.error(`Unsupport license: ${flags.license}\n`)
    console.info(`You can choose these:\n  ${licenses.join(', ')}`)
    return true
  }
  if (templates.indexOf(flags.template) < 0) {
    console.error(`Unsupport template: ${flags.template}\n`)
    console.info(`You can choose these:\n  ${templates.join(', ')}`)
    return true
  }

  return false
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

function tryPlugin (plugin, flags) {
  try {
    plugin.do(flags)
  } catch (error) {
    console.error(`Try plugin fail: ${plugin.name}`)
  }
}
