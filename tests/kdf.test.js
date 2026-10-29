'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { generateSalt, deriveKey } = require('../src/kdf');
const { SALT_LENGTH, KEY_LENGTH } = require('../src/constants');
const { FormatValidationError } = require('../src/errors');

test('generateSalt returns 16-byte buffer with high entropy', () => {
  const s1 = generateSalt();
  const s2 = generateSalt();
  assert.equal(s1.length, SALT_LENGTH);
  assert.notDeepEqual(s1, s2);
});

test('deriveKey is deterministic for identical passphrase and salt', () => {
  const salt = generateSalt();
  const k1 = deriveKey('master-secret', salt);
  const k2 = deriveKey('master-secret', salt);
  assert.equal(k1.length, KEY_LENGTH);
  assert.deepEqual(k1, k2);
});

test('deriveKey rejects empty passphrase or invalid salt length', () => {
  const salt = generateSalt();
  assert.throws(() => deriveKey('   ', salt), FormatValidationError);
  assert.throws(() => deriveKey('valid', Buffer.alloc(8)), FormatValidationError);
});
