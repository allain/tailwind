import { expect } from '@esm-bundle/chai/esm/chai.js'
import url from 'url'
import path from 'path'
import os from 'os'
import fs from 'fs-extra'

import execa from 'execa'

const randomInt = (min, max) => Math.round(min + Math.random() * (max - min))

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const binPath = path.join(__dirname, '..', 'src', 'bin.mjs')

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

it('can run build with minimal args (help)', async () => {
  const result = await execa(binPath, ['build'], { stdio: 'pipe' }).catch(
    (err) => err
  )
  expect(result.exitCode).to.equal(1)
  expect(result.stdout).to.contain('usage: twbuild build [')
})

it('can build a css file without purge to stdout', async () => {
  const result = await execa(
    binPath,
    ['build', path.join(__dirname, 'fixtures', 'minimal-simple.css')],
    {
      stdio: 'pipe'
    }
  ).catch((err) => err)
  expect(result.exitCode).to.equal(0)
  expect(result.stdout).to.contain(
    'test{--bg-opacity: 1;background-color:#f56565;background-color:rgba(245,101,101,var(--bg-opacity));}'
  )
})

it('can build a css file to output file instead of stdout', async () => {
  const tmpOutputFile = path.join(
    os.tmpdir(),
    randomInt(0, Number.MAX_SAFE_INTEGER) + '.css'
  )
  const result = await execa(
    binPath,
    [
      'build',
      path.join(__dirname, 'fixtures', 'minimal-simple.css'),
      '--output',
      tmpOutputFile
    ],
    {
      stdio: 'pipe'
    }
  ).catch((err) => err)
  expect(result.exitCode).to.equal(0)
  expect(result.stdout).to.equal('')
  expect(await fs.readFile(tmpOutputFile, 'utf-8')).to.contain(
    'test{--bg-opacity: 1;background-color:#f56565;background-color:rgba(245,101,101,var(--bg-opacity));}'
  )
})

it('can combine multiple css files', async () => {
  const result = await execa(
    binPath,
    [
      'build',
      path.join(__dirname, 'fixtures', 'minimal-simple.css'),
      path.join(__dirname, 'fixtures', 'minimal-simple2.css')
    ],
    {
      stdio: 'pipe'
    }
  ).catch((err) => err)
  expect(result.exitCode).to.equal(0)
  expect(result.stdout).to.contain(
    'test{--bg-opacity: 1;background-color:#f56565;background-color:rgba(245,101,101,var(--bg-opacity));}'
  )
  expect(result.stdout).to.contain(
    '.test2{--bg-opacity: 1;background-color:#4299e1;background-color:rgba(66,153,225,var(--bg-opacity));}'
  )
})
