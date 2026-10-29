'use strict';

const { EXIT_CODES } = require('./constants');

class VaultError extends Error {
  constructor(message, code = 'ERR_VAULT_GENERIC', exitCode = EXIT_CODES.USAGE_ERROR) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.exitCode = exitCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class CryptoAuthError extends VaultError {
  constructor(message = 'Ciphertext authentication failed: invalid passphrase or tampered payload') {
    super(message, 'ERR_VAULT_CRYPTO_AUTH', EXIT_CODES.CRYPTO_AUTH_ERROR);
  }
}

class FormatValidationError extends VaultError {
  constructor(message = 'Malformed .env.vault envelope structure') {
    super(message, 'ERR_VAULT_INVALID_FORMAT', EXIT_CODES.FORMAT_ERROR);
  }
}

class FilesystemSecurityError extends VaultError {
  constructor(message = 'Filesystem security boundary violation') {
    super(message, 'ERR_VAULT_FS_SECURITY', EXIT_CODES.FILESYSTEM_ERROR);
  }
}

module.exports = {
  VaultError,
  CryptoAuthError,
  FormatValidationError,
  FilesystemSecurityError
};
