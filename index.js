#!/usr/bin/env node

/**
 * env-vault-cli
 * Zero-dependency CLI utility for encrypting/decrypting local environment vaults.
 */

const crypto = require('crypto');
const fs = require('fs');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

function encryptVault(content, secret) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha512');
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(content, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: env-vault <command> [options]');
    console.log('Commands:');
    console.log('  encrypt <file>    Encrypt target .env file');
    console.log('  decrypt <file>    Decrypt target vault file');
    process.exit(0);
  }
  console.log('env-vault ready.');
}

if (require.main === module) {
  main();
}

module.exports = { encryptVault };
