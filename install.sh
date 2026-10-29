#!/bin/sh
set -eu

REPO="Abdelmalek2030/env-vault-cli"
BRANCH="main"
PREFIX="${PREFIX:-/usr/local}"
LIB_DIR="${PREFIX}/lib/env-vault-cli"
BIN_DIR="${PREFIX}/bin"

printf "[env-vault-cli] Installing zero-dependency CLI to %s...\n" "${PREFIX}"

command -v node >/dev/null 2>&1 || {
  printf "Error: Node.js (>=18) is required but not installed.\n" >&2
  exit 1
}

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT INT TERM HUP

curl -fsSL "https://github.com/${REPO}/archive/refs/heads/${BRANCH}.tar.gz" | tar -xz -C "${TMP_DIR}"

mkdir -p "${LIB_DIR}" "${BIN_DIR}"
cp -R "${TMP_DIR}/env-vault-cli-${BRANCH}/index.js" \
      "${TMP_DIR}/env-vault-cli-${BRANCH}/package.json" \
      "${TMP_DIR}/env-vault-cli-${BRANCH}/src" \
      "${LIB_DIR}/"

chmod 0755 "${LIB_DIR}/index.js"
ln -sf "${LIB_DIR}/index.js" "${BIN_DIR}/env-vault"

printf "[env-vault-cli] Successfully installed env-vault to %s/env-vault\n" "${BIN_DIR}"
