'use strict'

const fs = require('fs')
const { spawnSync } = require('child_process')
const { join, relative } = require('path')
const args = require('args')
const template = require('art-template')

const encoding = 'utf8'
const configPath = join(__dirname, '../config.json')
const config = JSON.parse(fs.readFileSync(configPath, { encoding }))
const licenses = ['MIT', 'APACHE', 'GUN']
const licensePath = join(__dirname, '../license')
const templates = ['github']

args
  .option('user', 'User name', config.user)
  .option('repository', 'Repository name', config.repository)
  .option('template', `Template to generate repository: ${templates.join(', ')}`, 'github')
  .option('license', `License to repository: ${licenses.join(', ')}`, config.license, license => license.toUpperCase())
  .option('year', 'Year to license. In most case, need\'t set', new Date().getFullYear())
  .option('config', 'Config to generate repository', `${configPath}`, (config) => {
    if (config === configPath) return

    return JSON.parse(fs.readFileSync(join(process.cwd(), config), { encoding }))
  })

module.exports = () => {
  let flags = args.parse(process.argv)
  let userConfig = flags.config

  if (userConfig) {
    Object.keys(userConfig).forEach((key) => {
      userConfig[key.charAt(0)] = userConfig[key]
    })
    flags = Object.assign(flags, userConfig)
    let git = userConfig.git + ''
    config.git = git === 'undefined'
      ? config.git
      : git !== 'false'
  }

  if (check(flags)) return

  let path = join(__dirname, '../templates', flags.template)
  let license = {
    type: 'f',
    path: join(path, 'LICENSE'),
    content: fs.readFileSync(join(licensePath, flags.license), 'utf8')
  }

  let dirsAndFiles = getDirsAndFiles(path)
  dirsAndFiles.unshift(license)

  render(dirsAndFiles, flags)
  cp(path, process.cwd(), dirsAndFiles)

  // git
  if (config.git) git(flags)
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

function render (dirsAndFiles, data) {
  dirsAndFiles.forEach((dirOrFile) => {
    if (dirOrFile.type === 'd') return

    dirOrFile.content = template.render(dirOrFile.content, data)
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

function git (flags) {
  spawnSync('git', ['init'])
  spawnSync('git', ['add', '.'])
  spawnSync('git', ['commit', '-m', 'init by https://github.com/xiedacon/generate'])
  spawnSync('git', ['remote', 'add', 'origin', `https://github.com/${flags.user}/${flags.repository}.git`])
  let result = spawnSync('git', ['push', '-u', 'origin', 'master'], { encoding })
  if (result.status !== 0) {
    console.error(result.stderr)
  } else {
    console.log(result.stdout)
  }
}
