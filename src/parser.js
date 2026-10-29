'use strict';

const { FormatValidationError } = require('./errors');

const KEY_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

/**
 * Parses a raw .env string into a deterministic key-value Map.
 * @param {string} content
 * @returns {Map<string, string>}
 */
function parseEnv(content) {
  if (typeof content !== 'string') {
    throw new FormatValidationError('Environment content must be a string');
  }

  const entries = new Map();
  const lines = content.replace(/\r\n/g, '\n').split('\n');

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const normalized = trimmed.startsWith('export ')
      ? trimmed.slice(7).trim()
      : trimmed;

    const eqIdx = normalized.indexOf('=');
    if (eqIdx === -1) {
      throw new FormatValidationError(`Malformed .env assignment at line ${i + 1}`);
    }

    const key = normalized.slice(0, eqIdx).trim();
    if (!KEY_REGEX.test(key)) {
      throw new FormatValidationError(`Invalid environment variable identifier "${key}" at line ${i + 1}`);
    }

    let val = normalized.slice(eqIdx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    entries.set(key, val);
  }

  return entries;
}

/**
 * Serializes a key-value Map or Object into canonical .env format.
 * @param {Map<string, string> | Record<string, string>} data
 * @returns {string}
 */
function serializeEnv(data) {
  const iterable = data instanceof Map ? data.entries() : Object.entries(data);
  const lines = [];

  for (const [key, value] of iterable) {
    if (!KEY_REGEX.test(key)) {
      throw new FormatValidationError(`Cannot serialize invalid key: ${key}`);
    }
    const strVal = String(value ?? '');
    const needsQuotes = /[\s#"']/.test(strVal);
    const escaped = needsQuotes ? `"${strVal.replace(/"/g, '\\"')}"` : strVal;
    lines.push(`${key}=${escaped}`);
  }

  return lines.join('\n') + (lines.length > 0 ? '\n' : '');
}

module.exports = {
  parseEnv,
  serializeEnv
};
