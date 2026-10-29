'use strict';

const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { encryptPayload, decryptPayload, parseEnvelope } = require('../src/crypto');
const { VaultError } = require('../src/errors');

const ITERATIONS = 50;

for (let i = 0; i < ITERATIONS; i++) {
  const randomPayload = `KEY_${i}=${crypto.randomBytes(32).toString('hex')}\n`;
  const randomKey = crypto.randomBytes(16).toString('base64');

  const env = encryptPayload(randomPayload, randomKey);
  const dec = decryptPayload(env, randomKey);
  assert.equal(dec, randomPayload);

  // Fuzz malformed envelope inputs to verify controlled VaultError handling
  const garbage = crypto.randomBytes(48).toString('base64');
  try {
    parseEnvelope(garbage);
    assert.fail('Expected malformed input to throw VaultError');
  } catch (err) {
    assert.ok(err instanceof VaultError);
  }
}

process.stdout.write(`[FUZZ PASS] Completed ${ITERATIONS} randomized AEAD & envelope fuzzing iterations.\n`);
