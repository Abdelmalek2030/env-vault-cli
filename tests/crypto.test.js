'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { encryptPayload, decryptPayload, parseEnvelope } = require('../src/crypto');
const { CryptoAuthError, FormatValidationError } = require('../src/errors');

test('AES-256-GCM roundtrip encryption and decryption preserves exact plaintext', () => {
  const secret = 'DB_PASSWORD="super_secret_value_123!@#"\nAPI_KEY=xyz987\n';
  const pass = 'correct-horse-battery-staple';

  const envelope = encryptPayload(secret, pass);
  const decrypted = decryptPayload(envelope, pass);

  assert.equal(decrypted, secret);
});

test('encryptPayload produces unique salt and IV on every invocation', () => {
  const e1 = encryptPayload('KEY=1', 'pass');
  const e2 = encryptPayload('KEY=1', 'pass');
  assert.notEqual(e1, e2);

  const p1 = parseEnvelope(e1);
  const p2 = parseEnvelope(e2);
  assert.notDeepEqual(p1.salt, p2.salt);
  assert.notDeepEqual(p1.iv, p2.iv);
});

test('decryptPayload rejects wrong passphrase with CryptoAuthError', () => {
  const envelope = encryptPayload('TOKEN=secret', 'valid-passphrase');
  assert.throws(
    () => decryptPayload(envelope, 'wrong-passphrase'),
    CryptoAuthError
  );
});

test('decryptPayload detects 1-bit tampering in authentication tag or ciphertext', () => {
  const envelope = encryptPayload('TOKEN=secret', 'passphrase');
  const parts = envelope.split(':');
  // Flip one hex nibble in authTag
  const tamperedTag = (parts[3][0] === 'a' ? 'b' : 'a') + parts[3].slice(1);
  const tamperedEnvelope = [parts[0], parts[1], parts[2], tamperedTag, parts[4]].join(':');

  assert.throws(
    () => decryptPayload(tamperedEnvelope, 'passphrase'),
    CryptoAuthError
  );
});

test('parseEnvelope rejects malformed headers', () => {
  assert.throws(() => parseEnvelope('v2:aa:bb:cc:dd'), FormatValidationError);
  assert.throws(() => parseEnvelope('invalid-string'), FormatValidationError);
});
