const assert = require('assert')
const { spawnSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const test = require('node:test')

const cliPath = path.resolve(__dirname, '../bin/gckit.js')

test('prints help without crashing', () => {
  const result = spawnSync(process.execPath, [cliPath, '--help'], {
    encoding: 'utf8'
  })

  assert.strictEqual(result.status, 0, result.stderr)
  assert.match(result.stdout, /Usage: gckit/)
})

test('generates a Swift view controller from the bundled template', () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'gckit-smoke-'))
  const result = spawnSync(process.execPath, [cliPath, 'g', 'product', 'vc'], {
    cwd,
    encoding: 'utf8'
  })

  assert.strictEqual(result.status, 0, result.stderr)
  assert.ok(findFile(cwd, 'Product_vc.swift'), 'expected Product_vc.swift to be generated')
})

function findFile (dir, fileName) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const current = path.join(dir, entry.name)
    if (entry.isDirectory() && findFile(current, fileName)) return true
    if (entry.isFile() && entry.name === fileName) return true
  }

  return false
}
