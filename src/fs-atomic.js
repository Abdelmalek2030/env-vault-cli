'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { SECURE_FILE_MODE } = require('./constants');
const { FilesystemSecurityError } = require('./errors');

/**
 * Atomically writes sensitive data to disk with strict 0600 permissions.
 * @param {string} targetPath
 * @param {string} content
 */
function writeAtomicSecure(targetPath, content) {
  const resolved = path.resolve(targetPath);
  const dir = path.dirname(resolved);
  const tmpName = `.env-vault-tmp-${process.pid}-${crypto.randomBytes(6).toString('hex')}`;
  const tmpPath = path.join(dir, tmpName);

  try {
    fs.writeFileSync(tmpPath, content, {
      encoding: 'utf8',
      mode: SECURE_FILE_MODE,
      flag: 'wx'
    });
    fs.chmodSync(tmpPath, SECURE_FILE_MODE);
    fs.renameSync(tmpPath, resolved);
  } catch (err) {
    if (fs.existsSync(tmpPath)) {
      try {
        fs.unlinkSync(tmpPath);
      } catch {
        // Ignore cleanup failure
      }
    }
    throw new FilesystemSecurityError(`Atomic write failed for ${targetPath}: ${err.message}`);
  }
}

/**
 * Reads a file safely and verifies it is a regular file (not a directory or broken symlink).
 * @param {string} filePath
 * @returns {string}
 */
function readSecureFile(filePath) {
  const resolved = path.resolve(filePath);
  let stat;
  try {
    stat = fs.statSync(resolved);
  } catch {
    throw new FilesystemSecurityError(`Target file does not exist: ${filePath}`);
  }

  if (!stat.isFile()) {
    throw new FilesystemSecurityError(`Target path is not a regular file: ${filePath}`);
  }

  return fs.readFileSync(resolved, 'utf8');
}

module.exports = {
  writeAtomicSecure,
  readSecureFile
};
