import cp from 'child_process'
import url from 'url'
import path from 'path'
import fs from 'fs'

const asArray = x => Array.isArray(x) ? x : [x]

const pathToBinDir = path.join(path.dirname(url.fileURLToPath(import.meta.url)), '..', 'bin')
const binName = fs.readdirSync(path.join(pathToBinDir)).find(name => !name.startsWith('.'))
const pathToBin = path.join(pathToBinDir, binName)

export function build(cssFiles, options = {}) {
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

    args = [...args, cssFiles]
    return new Promise((resolve, reject) => {
        const child = cp.spawn(pathToBin, args, { stdio: 'inherit' })

        child.on('error', reject)
        child.on('exit', resolve)
        child.on('close', resolve(0))
    })
}