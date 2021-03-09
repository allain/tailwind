#!/usr/bin/env node

import minimist from 'minimist'

import { build } from './index.mjs'

async function main(args) {
  const [, , command, arg1] = args._

  if (!command) {
    if (!args.help)
      console.error('\x1b[31m%s\x1b[0m', 'error: command not given\n')
    displayRootHelp()
    if (args.help) return
    process.exit(1)
  }

  switch (command) {
    case 'help':
      switch (arg1) {
        case 'build':
          displayBuildHelp()
          break
        default:
          displayRootHelp()
      }
      return
    case 'build':
      const { _, ...options } = minimist(process.argv, {
        boolean: ['verbose'],
        string: ['output', 'purgescan', 'purgeext'],
        default: {
          output: '-',
          purgeext: 'html,vue,jsx,vugu'
        },
        alias: {
          o: 'output',
          v: 'verbose'
        }
      })

      if (args.help || _.length < 4) {
        displayBuildHelp()
        if (args.help) return
        return Promise.reject()
      }

      return build(_.slice(3), options)
    default:
      displayRootHelp()
      return Promise.reject()
  }
}

function displayRootHelp() {
  console.log(
    `usage: twbuild [<flags>] <command> [<args> ...]

Tailwind Build tools

Flags:
      --help     Show context-sensitive help.
  -v, --verbose  Print verbose output

Commands:
  help [<command>...]
    Show help.

  build [<flags>] [<input>...]
    Build CSS output
`
  )
}

function displayBuildHelp() {
  console.log(
    `usage: twbuild build [<flags>] [<input>...]

Build CSS output

Flags:
      --help                     Show context-sensitive help
  -v, --verbose                  Print verbose output
  -o, --output="-"               Output file name, use hyphen for stdout
      --purgescan=PURGESCAN      Scan file/folder recursively for purge keys
      --purgeext="html,vue,jsx,vugu"  Comma separated list of file extensions (no periods) to scan for purge keys

Args:
  [<input>]  Input file name(s)`
  )
}

main(
  minimist(process.argv, {
    boolean: ['help']
  })
).catch((err) => {
  err && console.error(err.message)
  process.exit(1)
})
