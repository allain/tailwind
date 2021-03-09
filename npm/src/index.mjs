import cp from 'child_process'
import url from 'url'
import path from 'path'
import fs from 'fs'

const asArray = x => Array.isArray(x) ? x : [x]

function findBin() {
    const rootTwDir = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)))
    return path.join(rootTwDir, 'node_modules', '.bin', 'gotailwindcss')
    // const
    // // discover directory into which the binary will be installed
    // const result = cp.spawnSync('npm', ['bin'], { cwd: rootTwDir })
    // if (result.error) throw new Error(result.error)

    // const binDir = result.stdout.toString('utf-8').trim()
    // const pathToBin = path.join(binDir, 'gotailwindcss')
    // if (!fs.existsSync(pathToBin)) {
    //     // perform an npm install if the binary is not installed
    //     const result = cp.spawnSync('npm', ['install'], { cwd: rootTwDir, stdio: 'inherit' })
    //     if (result.error) throw new Error(result.error)
    // }
    // if (!fs.existsSync(pathToBin)) throw new Error('unable to install gotailwindcss')

    // return pathToBin
}

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
    const pathToBin = findBin()
    return new Promise((resolve, reject) => {
        const child = cp.spawn(pathToBin, args, { stdio: 'inherit' })
        child.on('error', reject)
        child.on('exit', resolve)
        child.on('close', resolve(0))
    })
}