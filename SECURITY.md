# Security Policy & Cryptographic Disclosure

## Supported Versions

Only the latest stable release branch receives active cryptographic and security maintenance.

| Version | Supported          | Node.js Runtime | Cryptographic Engine |
| ------- | ------------------ | --------------- | -------------------- |
| 1.0.x   | :white_check_mark: | `>= 18.0.0`     | Native `node:crypto` |
| < 1.0.0 | :x:                | Legacy          | Unsupported          |

## Security Architecture Guarantees

- **Zero Third-Party Dependencies**: `env-vault-cli` relies strictly on built-in Node.js native C++ bindings (`node:crypto`, `node:fs`, `node:path`) to eliminate transitive npm supply-chain vulnerabilities.
- **Authenticated Encryption (AEAD)**: All secrets are encrypted using `AES-256-GCM` with cryptographically secure 96-bit initialization vectors (IV) and 128-bit authentication tags.
- **Memory Hardened Key Derivation**: Passphrases are stretched via `scrypt` (RFC 7914) with high-entropy 128-bit random salts to resist brute-force and rainbow-table attacks.

## Reporting a Vulnerability

Do **NOT** open a public GitHub issue for suspected cryptographic flaws or side-channel vulnerabilities. Please report sensitive findings directly via email:

- **Email**: `Abdelmalek2030github@hotmail.com`
- **Response SLA**: Acknowledgment within 24 hours; triage and mitigation patch within 72 hours.
