# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-29

### Added
- Native zero-dependency `AES-256-GCM` authenticated encryption and decryption engine (`node:crypto`).
- Memory-hardened `scrypt` key derivation function (KDF) with 128-bit random salt generation.
- Deterministic `.env` parser supporting comments, quoted multiline values, and key rotation.
- Atomic file writer enforcing `0600` POSIX permissions and ephemeral key buffer zeroization.
- Comprehensive hermetic test suite, UNIX section 1 manual page (`man/env-vault.1`), and shell completions.
- Enterprise-grade CI/CD quality gates, CodeQL static analysis, and RFC 9116 security disclosure policy.
