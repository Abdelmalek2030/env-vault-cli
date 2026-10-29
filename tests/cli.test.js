'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { runCli } = require('../index');
const { EXIT_CODES } = require('../src/constants');

test('CLI end-to-end encrypt -> inspect -> rotate -> decrypt workflow', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'env-vault-cli-'));
  try {
    const envPath = path.join(tmpDir, '.env');
    const vaultPath = path.join(tmpDir, '.env.vault');
    const outPath = path.join(tmpDir, '.env.decrypted');

    fs.writeFileSync(envPath, 'APP_SECRET=alpha_omega_99\nPORT=3000\n', 'utf8');

    const encCode = runCli(['node', 'index.js', 'encrypt', envPath, vaultPath, '-k', 'key-v1']);
    assert.equal(encCode, EXIT_CODES.SUCCESS);

    const inspectCode = runCli(['node', 'index.js', 'inspect', vaultPath]);
    assert.equal(inspectCode, EXIT_CODES.SUCCESS);

    const rotCode = runCli(['node', 'index.js', 'rotate', vaultPath, '--old-key', 'key-v1', '--new-key', 'key-v2']);
    assert.equal(rotCode, EXIT_CODES.SUCCESS);

    const failDecCode = runCli(['node', 'index.js', 'decrypt', vaultPath, outPath, '-k', 'key-v1']);
    assert.equal(failDecCode, EXIT_CODES.CRYPTO_AUTH_ERROR);

    const okDecCode = runCli(['node', 'index.js', 'decrypt', vaultPath, outPath, '-k', 'key-v2']);
    assert.equal(okDecCode, EXIT_CODES.SUCCESS);

    assert.equal(fs.readFileSync(outPath, 'utf8'), 'APP_SECRET=alpha_omega_99\nPORT=3000\n');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
