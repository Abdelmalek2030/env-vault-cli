#!/usr/bin/env node
'use strict';

const {
  encryptFile,
  decryptFile,
  rotateVaultKey,
  inspectVaultMetadata
} = require('./src/vault');
const { encryptPayload, decryptPayload, parseEnvelope } = require('./src/crypto');
const { parseEnv, serializeEnv } = require('./src/parser');
const { EXIT_CODES } = require('./src/constants');
const { VaultError } = require('./src/errors');
const pkg = require('./package.json');

function printHelp() {
  process.stdout.write(`env-vault-cli v${pkg.version}
Zero-dependency AES-256-GCM environment secret manager.

Usage:
  env-vault encrypt [input] [output] -k <passphrase> [--dry-run]
  env-vault decrypt [input] [output] -k <passphrase> [--dry-run]
  env-vault rotate <vault-file> --old-key <old> --new-key <new>
  env-vault inspect <vault-file>

Options:
  -k, --key <passphrase>   Passphrase (or set ENV_VAULT_KEY environment variable)
  --dry-run                Validate and execute in memory without writing to disk
  -h, --help               Show this help message
  -v, --version            Show version information
`);
}

function parseCliArgs(argv) {
  const args = argv.slice(2);
  const positional = [];
  const flags = {
    key: process.env.ENV_VAULT_KEY || '',
    oldKey: '',
    newKey: '',
    dryRun: false,
    help: false,
    version: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') {
      flags.help = true;
    } else if (arg === '-v' || arg === '--version') {
      flags.version = true;
    } else if (arg === '--dry-run') {
      flags.dryRun = true;
    } else if (arg === '-k' || arg === '--key') {
      flags.key = args[++i] || '';
    } else if (arg === '--old-key') {
      flags.oldKey = args[++i] || '';
    } else if (arg === '--new-key') {
      flags.newKey = args[++i] || '';
    } else {
      positional.push(arg);
    }
  }

  return { command: positional[0], positional: positional.slice(1), flags };
}

function runCli(argv = process.argv) {
  try {
    const { command, positional, flags } = parseCliArgs(argv);

    if (flags.version) {
      process.stdout.write(`${pkg.version}\n`);
      return EXIT_CODES.SUCCESS;
    }

    if (flags.help || !command) {
      printHelp();
      return command ? EXIT_CODES.SUCCESS : EXIT_CODES.USAGE_ERROR;
    }

    if (command === 'encrypt') {
      const input = positional[0] || '.env';
      const output = positional[1] || '.env.vault';
      const res = encryptFile(input, output, flags.key, { dryRun: flags.dryRun });
      process.stdout.write(`Encrypted ${res.keyCount} keys -> ${output}${flags.dryRun ? ' (dry-run)' : ''}\n`);
      return EXIT_CODES.SUCCESS;
    }

    if (command === 'decrypt') {
      const input = positional[0] || '.env.vault';
      const output = positional[1] || '.env';
      const res = decryptFile(input, output, flags.key, { dryRun: flags.dryRun });
      process.stdout.write(`Decrypted ${res.keyCount} keys -> ${output}${flags.dryRun ? ' (dry-run)' : ''}\n`);
      return EXIT_CODES.SUCCESS;
    }

    if (command === 'rotate') {
      const vaultFile = positional[0] || '.env.vault';
      rotateVaultKey(vaultFile, flags.oldKey, flags.newKey);
      process.stdout.write(`Rotated cryptographic key and nonce for ${vaultFile}\n`);
      return EXIT_CODES.SUCCESS;
    }

    if (command === 'inspect') {
      const vaultFile = positional[0] || '.env.vault';
      const meta = inspectVaultMetadata(vaultFile);
      process.stdout.write(`${JSON.stringify(meta, null, 2)}\n`);
      return EXIT_CODES.SUCCESS;
    }

    process.stderr.write(`Unknown command: ${command}\n`);
    return EXIT_CODES.USAGE_ERROR;
  } catch (err) {
    const code = err instanceof VaultError ? err.exitCode : EXIT_CODES.USAGE_ERROR;
    process.stderr.write(`[${err.code || 'ERR_CLI'}] ${err.message}\n`);
    return code;
  }
}

if (require.main === module) {
  process.exitCode = runCli(process.argv);
}

module.exports = {
  encryptPayload,
  decryptPayload,
  parseEnvelope,
  parseEnv,
  serializeEnv,
  encryptFile,
  decryptFile,
  rotateVaultKey,
  inspectVaultMetadata,
  runCli
};
