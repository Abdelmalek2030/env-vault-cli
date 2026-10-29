# Production Operations & Incident Runbook

Standard operating procedures (SOPs) for managing encrypted `.env.vault` artifacts across development and CI/CD environments.

---

## 1. Routine Secret Encryption Workflow
1. Edit local `.env` (never tracked by Git).
2. Validate and encrypt into `.env.vault`:
   ```sh
   ENV_VAULT_KEY="$PASSPHRASE" node index.js encrypt .env .env.vault
