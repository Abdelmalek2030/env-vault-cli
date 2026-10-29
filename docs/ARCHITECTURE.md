# System Architecture & Wire Format Specification

`env-vault-cli` implements a deterministic, authenticated envelope format for local and CI/CD secret synchronization.

---

## 1. Envelope Wire Format (`v1`)

Each encrypted `.env.vault` payload is serialized as a colon-delimited (`:`) Base64/Hex envelope containing five authenticated segments:

```text
v1:<scrypt_salt_hex>:<aes_gcm_iv_hex>:<auth_tag_hex>:<ciphertext_base64>
