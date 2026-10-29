# Contributing to env-vault-cli

Thank you for your interest in contributing to `env-vault-cli`. To preserve our reference-grade security posture, all contributions must strictly adhere to the following engineering rules.

## Core Contribution Rules

1. **Zero External Dependencies**: Pull requests that add runtime or development dependencies to `package.json` will be automatically rejected. Use only built-in Node.js modules (`node:crypto`, `node:fs`, `node:test`, `node:assert`).
2. **Cryptographic Determinism**: Never weaken `scrypt` cost parameters, IV lengths (must remain 12 bytes), or authentication tag lengths (must remain 16 bytes).
3. **Hermetic Testing**: Every feature or bugfix must include isolated unit and behavioral tests utilizing temporary `mkdtempSync` sandboxes.
4. **Conventional Commits**: All commit messages must follow the Conventional Commits specification (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `test:`, `refactor:`).

## Local Verification Gate

Before submitting a Pull Request, verify that all quality gates pass:

```sh
node --check index.js
npm test
