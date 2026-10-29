# Cryptographic Threat Model (STRIDE Analysis)

This document outlines the threat landscape, trust boundaries, and mitigations engineered into `env-vault-cli`.

---

## STRIDE Mitigation Matrix

| Threat Category | Attack Vector | Engineered Mitigation |
| :--- | :--- | :--- |
| **Spoofing** | Forged `.env.vault` committed by an unauthorized actor | `AES-256-GCM` 128-bit authentication tag (`authTag`) + protocol version AAD binding rejects any unauthenticated modification. |
| **Tampering** | Bit-flip or truncation attack on encrypted ciphertext | Mandatory MAC verification prior to plaintext emission; immediate process abort with exit code `2`. |
| **Repudiation** | Silent partial file writes during power loss or crash | Atomic write-then-rename (`fs.renameSync`) ensures deterministic all-or-nothing file updates. |
| **Information Disclosure** | Brute-force offline cracking or world-readable `.env` files | Memory-hard `scrypt` KDF ($N=16384, r=8, p=1$) + 128-bit random salt; decrypted files enforce POSIX `0600` permissions. |
| **Denial of Service** | Malformed envelope inputs causing unhandled crashes | Strict envelope header bounds validation and deterministic `VaultError` exception hierarchy. |
| **Elevation of Privilege** | Malicious transitive npm dependency injection | Strictly **zero** third-party dependencies (`dependencies: {}`) and `.npmrc` `ignore-scripts=true`. |
