# env-vault-cli

<div align="center">

[![CI Matrix & Quality Gate](https://github.com/Abdelmalek2030/env-vault-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/Abdelmalek2030/env-vault-cli/actions/workflows/ci.yml)
[![CodeQL Security Audit](https://github.com/Abdelmalek2030/env-vault-cli/actions/workflows/codeql.yml/badge.svg)](https://github.com/Abdelmalek2030/env-vault-cli/actions/workflows/codeql.yml)
[![Continuous Fuzzing](https://github.com/Abdelmalek2030/env-vault-cli/actions/workflows/fuzz.yml/badge.svg)](https://github.com/Abdelmalek2030/env-vault-cli/actions/workflows/fuzz.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?logo=node.js&logoColor=white)](package.json)
[![Language](https://img.shields.io/badge/Language-JavaScript%20100%25-F7DF1E.svg)]()
[![Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen.svg)]()

**A reference-grade, zero-dependency CLI utility built strictly on native Node.js cryptographic primitives (`node:crypto`) for enterprise `AES-256-GCM` `.env` secret encryption, key rotation, and CI/CD synchronization.**

</div>

---

## 🏗️ Architecture & Cryptographic Philosophy

`env-vault-cli` is engineered for high-assurance infrastructure environments adhering to strict *Zero Supply-Chain Bloat* and *Authenticated Encryption* invariants:

- **Zero External Dependencies**: Built exclusively on native Node.js modules (`node:crypto`, `node:fs`, `node:path`) with zero third-party `npm` packages, eliminating transitive supply-chain risks.
- **Authenticated Encryption (`AES-256-GCM`)**: Enforces 96-bit NIST SP 800-38D initialization vectors (IV), 128-bit authentication tags (`authTag`), and protocol header Additional Authenticated Data (AAD) binding.
- **Memory-Hard Key Derivation (`scrypt`)**: Derives 256-bit keys from passphrases using RFC 7914 `scrypt` ($N=16384, r=8, p=1$) with unique 128-bit cryptographic salts per encryption cycle.
- **Atomic Persistence & Memory Hygiene**: Writes decrypted `.env` files via crash-safe atomic rename operations with strict POSIX `0600` permissions and explicitly zeroes ephemeral key buffers in memory (`buf.fill(0)`).

---

## 🚀 Quick Installation & Usage

### One-Line Bootstrap Installer
```sh
curl -fsSL [https://raw.githubusercontent.com/Abdelmalek2030/env-vault-cli/main/install.sh](https://raw.githubusercontent.com/Abdelmalek2030/env-vault-cli/main/install.sh) | sudo sh
```

### Core CLI Workflows
```sh
# 1. Encrypt local .env into authenticated .env.vault
env-vault encrypt .env .env.vault -k "$ENV_VAULT_KEY"

# 2. Inspect non-sensitive envelope metadata
env-vault inspect .env.vault

# 3. Rotate passphrase and regenerate cryptographic salt/nonce in-place
env-vault rotate .env.vault --old-key "$OLD_KEY" --new-key "$NEW_KEY"

# 4. Decrypt .env.vault back to .env with strict 0600 permissions
env-vault decrypt .env.vault .env -k "$ENV_VAULT_KEY"
```
---

## 📖 Operational Documentation & Specifications

- **[Architecture & Wire Format (`docs/ARCHITECTURE.md`)](docs/ARCHITECTURE.md)**: Specification of the `v1` colon-delimited AEAD envelope and dataflow.
- **[Security Invariants (`docs/SECURITY_INVARIANTS.md`)](docs/SECURITY_INVARIANTS.md)**: Unviolatable cryptographic, nonce, and memory zeroization rules.
- **[Threat Model (`docs/THREAT_MODEL.md`)](docs/THREAT_MODEL.md)**: STRIDE analysis and supply-chain mitigation matrix.
- **[Operations Runbook (`docs/RUNBOOK.md`)](docs/RUNBOOK.md)**: Standard operating procedures for routine encryption and emergency key rotation.

---

## 🛡️ Security & Vulnerability Disclosure

- **[Security Policy (`SECURITY.md`)](SECURITY.md)**
- **[RFC 9116 Security Disclosure (`.well-known/security.txt`)](.well-known/security.txt)**

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

