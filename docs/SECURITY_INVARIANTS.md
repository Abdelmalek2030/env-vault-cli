# Cryptographic & Execution Security Invariants

This document formalizes the unviolatable cryptographic and runtime invariants enforced within `env-vault-cli`.

---

## 1. Zero-Dependency Supply Chain Isolation
- **Invariant C-1**: The runtime execution graph must contain strictly **zero** external `dependencies` in `package.json`. All cryptographic primitives must originate exclusively from the host Node.js `node:crypto` OpenSSL subsystem.
- **Invariant C-2**: Package installation and execution must never invoke arbitrary shell subshells (`child_process.exec`) with unsanitized user inputs.

## 2. Authenticated Encryption & Key Derivation (AEAD)
- **Invariant C-3**: Every encryption operation must generate a fresh, cryptographically random 16-byte salt and 12-byte Initialization Vector (IV) via `crypto.randomBytes()`. Nonce reuse across encryption cycles is strictly impossible by design.
- **Invariant C-4**: Ciphertext integrity must be verified prior to plaintext emission using a mandatory 16-byte `AES-256-GCM` Authentication Tag (`authTag`). Any bit-flip in the header, salt, IV, or payload must trigger immediate authentication failure (`ERR_CRYPTO_INVALID_TAG`) and abort execution with a non-zero exit code.

## 3. Atomic Filesystem & Memory Hygiene
- **Invariant C-5**: Sensitive key buffers derived in memory must be explicitly zeroed (`buffer.fill(0)`) inside `finally` blocks immediately following cipher finalization.
- **Invariant C-6**: File write operations for decrypted `.env` artifacts must utilize atomic write-then-rename semantics with restrictive POSIX file permissions (`0600` - owner read/write only).
