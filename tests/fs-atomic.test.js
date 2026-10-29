'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { writeAtomicSecure, readSecureFile } = require('../src/fs-atomic');

test('writeAtomicSecure writes file atomically with strict 0600 permissions', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'env-vault-fs-'));
  try {
    const filePath = path.join(tmpDir, '.env');
    writeAtomicSecure(filePath, 'SECRET=1\n');

    const content = readSecureFile(filePath);
    assert.equal(content, 'SECRET=1\n');

    if (process.platform !== 'win32') {
      const mode = fs.statSync(filePath).mode & 0o777;
      assert.equal(mode, 0o600);
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
