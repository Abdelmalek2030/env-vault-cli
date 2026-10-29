'use strict';

const crypto = require('node:crypto');
const {
  ENVELOPE_VERSION,
  ALGORITHM,
  SALT_LENGTH,
  IV_LENGTH,
  TAG_LENGTH
} = require('./constants');
const { CryptoAuthError, FormatValidationError } = require('./errors');
const { withSecureBuffer } = require('./memory');
const { generateSalt, deriveKey } = require('./kdf');

/**
 * Parses and validates a serialized v1 vault envelope string.
 * @param {string} envelope
 */
function parseEnvelope(envelope) {
  if (typeof envelope !== 'string' || envelope.trim().length === 0) {
    throw new FormatValidationError('Vault payload cannot be empty');
  }

  const parts = envelope.trim().split(':');
  if (parts.length !== 5) {
    throw new FormatValidationError('Invalid envelope segment count; expected 5 colon-delimited fields');
  }

  const [version, saltHex, ivHex, tagHex, ciphertextB64] = parts;
  if (version !== ENVELOPE_VERSION) {
    throw new FormatValidationError(`Unsupported envelope version: ${version}`);
  }

  const salt = Buffer.from(saltHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(tagHex, 'hex');
  const ciphertext = Buffer.from(ciphertextB64, 'base64');

  if (salt.length !== SALT_LENGTH || iv.length !== IV_LENGTH || authTag.length !== TAG_LENGTH) {
    throw new FormatValidationError('Corrupted cryptographic parameter lengths in envelope header');
  }

  return { version, salt, iv, authTag, ciphertext };
}

/**
 * Encrypts UTF-8 plaintext into an authenticated v1 envelope string.
 * @param {string} plaintext
 * @param {string} passphrase
 * @returns {string}
 */
function encryptPayload(plaintext, passphrase) {
  if (typeof plaintext !== 'string') {
    throw new FormatValidationError('Plaintext payload must be a string');
  }

  const salt = generateSalt();
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = deriveKey(passphrase, salt);

  return withSecureBuffer(key, (derivedKey) => {
    const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv, {
      authTagLength: TAG_LENGTH
    });
    cipher.setAAD(Buffer.from(ENVELOPE_VERSION, 'utf8'));

    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final()
    ]);
    const authTag = cipher.getAuthTag();

    return [
      ENVELOPE_VERSION,
      salt.toString('hex'),
      iv.toString('hex'),
      authTag.toString('hex'),
      encrypted.toString('base64')
    ].join(':');
  });
}

/**
 * Decrypts and authenticates a v1 envelope string back to UTF-8 plaintext.
 * @param {string} envelope
 * @param {string} passphrase
 * @returns {string}
 */
function decryptPayload(envelope, passphrase) {
  const { version, salt, iv, authTag, ciphertext } = parseEnvelope(envelope);
  const key = deriveKey(passphrase, salt);

  return withSecureBuffer(key, (derivedKey) => {
    try {
      const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv, {
        authTagLength: TAG_LENGTH
      });
      decipher.setAAD(Buffer.from(version, 'utf8'));
      decipher.setAuthTag(authTag);

      const decrypted = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final()
      ]);
      return decrypted.toString('utf8');
    } catch {
      throw new CryptoAuthError();
    }
  });
}

module.exports = {
  parseEnvelope,
  encryptPayload,
  decryptPayload
};
