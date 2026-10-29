'use strict';

const { encryptPayload, decryptPayload, parseEnvelope } = require('./crypto');
const { parseEnv } = require('./parser');
const { writeAtomicSecure, readSecureFile } = require('./fs-atomic');

/**
 * Encrypts a plaintext .env file into an authenticated .env.vault file.
 */
function encryptFile(inputPath, outputPath, passphrase, options = {}) {
  const rawEnv = readSecureFile(inputPath);
  const parsed = parseEnv(rawEnv);
  const envelope = encryptPayload(rawEnv, passphrase);

  if (!options.dryRun) {
    writeAtomicSecure(outputPath, envelope + '\n');
  }

  return {
    keyCount: parsed.size,
    envelope
  };
}

/**
 * Decrypts an authenticated .env.vault file back into a plaintext .env file.
 */
function decryptFile(inputPath, outputPath, passphrase, options = {}) {
  const envelope = readSecureFile(inputPath).trim();
  const plaintext = decryptPayload(envelope, passphrase);
  const parsed = parseEnv(plaintext);

  if (!options.dryRun) {
    writeAtomicSecure(outputPath, plaintext);
  }

  return {
    keyCount: parsed.size,
    plaintext
  };
}

/**
 * Re-encrypts an existing vault file with a new passphrase and fresh salt/IV.
 */
function rotateVaultKey(vaultPath, oldPassphrase, newPassphrase) {
  const currentEnvelope = readSecureFile(vaultPath).trim();
  const plaintext = decryptPayload(currentEnvelope, oldPassphrase);
  const rotatedEnvelope = encryptPayload(plaintext, newPassphrase);
  writeAtomicSecure(vaultPath, rotatedEnvelope + '\n');
  return rotatedEnvelope;
}

/**
 * Inspects non-sensitive metadata of a vault envelope without decrypting it.
 */
function inspectVaultMetadata(vaultPath) {
  const raw = readSecureFile(vaultPath).trim();
  const parsed = parseEnvelope(raw);
  return {
    version: parsed.version,
    algorithm: 'aes-256-gcm',
    kdf: 'scrypt',
    saltBytes: parsed.salt.length,
    ivBytes: parsed.iv.length,
    tagBytes: parsed.authTag.length,
    ciphertextBytes: parsed.ciphertext.length
  };
}

module.exports = {
  encryptFile,
  decryptFile,
  rotateVaultKey,
  inspectVaultMetadata
};
