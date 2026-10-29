'use strict';

const ENVELOPE_VERSION = 'v1';
const ALGORITHM = 'aes-256-gcm';

const SALT_LENGTH = 16; // 128-bit random salt
const IV_LENGTH = 12;   // 96-bit NIST SP 800-38D recommended GCM nonce
const TAG_LENGTH = 16;  // 128-bit GCM authentication tag
const KEY_LENGTH = 32;  // 256-bit symmetric key

const SCRYPT_PARAMS = Object.freeze({
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 32 * 1024 * 1024
});

const SECURE_FILE_MODE = 0o600;

const EXIT_CODES = Object.freeze({
  SUCCESS: 0,
  USAGE_ERROR: 1,
  CRYPTO_AUTH_ERROR: 2,
  FORMAT_ERROR: 3,
  FILESYSTEM_ERROR: 4
});

module.exports = Object.freeze({
  ENVELOPE_VERSION,
  ALGORITHM,
  SALT_LENGTH,
  IV_LENGTH,
  TAG_LENGTH,
  KEY_LENGTH,
  SCRYPT_PARAMS,
  SECURE_FILE_MODE,
  EXIT_CODES
});
