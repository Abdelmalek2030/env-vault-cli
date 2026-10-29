'use strict';

const crypto = require('node:crypto');
const { KEY_LENGTH, SALT_LENGTH, SCRYPT_PARAMS } = require('./constants');
const { FormatValidationError } = require('./errors');

/**
 * Generates a cryptographically strong random salt.
 * @returns {Buffer}
 */
function generateSalt() {
  return crypto.randomBytes(SALT_LENGTH);
}

/**
 * Derives a 256-bit symmetric key from a passphrase and salt using memory-hard scrypt.
 * @param {string} passphrase
 * @param {Buffer} salt
 * @returns {Buffer}
 */
function deriveKey(passphrase, salt) {
  if (typeof passphrase !== 'string' || passphrase.trim().length === 0) {
    throw new FormatValidationError('Passphrase must be a non-empty string');
  }
  if (!Buffer.isBuffer(salt) || salt.length !== SALT_LENGTH) {
    throw new FormatValidationError(`Salt must be a ${SALT_LENGTH}-byte Buffer`);
  }

  return crypto.scryptSync(
    passphrase.normalize('NFKC'),
    salt,
    KEY_LENGTH,
    SCRYPT_PARAMS
  );
}

module.exports = {
  generateSalt,
  deriveKey
};
