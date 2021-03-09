import cp from 'child_process'
import url from 'url'
import path from 'path'
import execa from 'execa'
import fs from 'fs'

const asArray = (x) => (Array.isArray(x) ? x : [x])
const rootTwDir = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)))

const binPath = path.join(
  rootTwDir,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'gotailwindcss.exe' : 'gotailwindcss'
)

export async function build(cssFiles, options = {}) {
  const verbose = options.verbose
  const output = options.output
  const purgeScan = asArray(options.purgescan).filter(Boolean)
  const purgeExt = options.purgeext.split(/\s*,\s*/g)

  let args = ['build']
  if (output !== '-') {
    args = [...args, '--output', output]
  }

  if (verbose) args = [...args, '--verbose']

  if (purgeScan.length) {
    args = [...args, '--purgescan', purgeScan[0], '--purgeext', purgeExt]
  }

  args = [...args, ...cssFiles]

  let result = await tryRunGoTailwindCSS(args).catch((err) => err)

  if (result.failed) {
    if (!fs.existsSync(binPath)) {
      console.log('installing gotailwindcss')
      await execa('npm', ['install'], { cwd: rootTwDir })
      result = await tryRunGoTailwindCSS(args).catch((err) => {
        console.error(err)
        return 1
      })
    }
  }

  if (result.failed) {
    return Promise.reject()
  }
}

function tryRunGoTailwindCSS(args) {
  return execa(binPath, args, {
    stdio: 'inherit'
  })
}
