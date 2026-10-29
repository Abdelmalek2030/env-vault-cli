## Summary of Changes

Describe the architectural or cryptographic changes introduced in this Pull Request.

## Reference-Grade Quality & Security Checklist

- [ ] **Zero Dependencies**: `package.json` contains zero external runtime or dev dependencies.
- [ ] **Cryptographic Integrity**: `AES-256-GCM` IVs (12 bytes), salts (16 bytes), and AuthTags (16 bytes) remain strictly enforced.
- [ ] **Memory Hygiene**: Sensitive buffers are explicitly zeroed (`buf.fill(0)`) prior to function return.
- [ ] **Hermetic Tests**: All unit and CLI integration tests pass via `npm test`.
