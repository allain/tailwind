import { expect } from '@esm-bundle/chai/esm/chai.js'
import url from 'url'
import path from 'path'

import execa from 'execa'

const _dirname = path.dirname(url.fileURLToPath(import.meta.url))
const binPath = path.join(_dirname, '..', 'src', 'bin.mjs')

it('can be run without args', async () => {
  const result = await execa(binPath, [], { stdio: 'pipe' }).catch((err) => err)
  expect(result.exitCode).to.equal(1)
  expect(result.stdout).to.contain('usage: twbuild')
})

it('can be successfully asked for help with --help', async () => {
  const result = await execa(binPath, ['--help'], { stdio: 'pipe' }).catch(
    (err) => err
  )
  expect(result.exitCode).to.equal(0)
  expect(result.stdout).to.contain('usage: twbuild [')
})

it('can be successfully asked for help with help command', async () => {
  const result = await execa(binPath, ['help'], { stdio: 'pipe' }).catch(
    (err) => err
  )
  expect(result.exitCode).to.equal(0)
  expect(result.stdout).to.contain('usage: twbuild [')
})

it('can be successfully asked for help with help build', async () => {
  const result = await execa(binPath, ['help', 'build'], {
    stdio: 'pipe'
  }).catch((err) => err)
  expect(result.exitCode).to.equal(0)
  expect(result.stdout).to.contain('usage: twbuild build [')
})

it('fails when invalid command given', async () => {
  const result = await execa(binPath, ['invalid'], {
    stdio: 'pipe'
  }).catch((err) => err)
  expect(result.exitCode).to.equal(1)
  expect(result.stdout).to.contain('usage: twbuild [')
})

it('can run build with minimal args ', async () => {
  const result = await execa(binPath, ['build'], { stdio: 'pipe' }).catch(
    (err) => err
  )
  expect(result.exitCode).to.equal(1)
  expect(result.stdout).to.contain('usage: twbuild build [')
})
