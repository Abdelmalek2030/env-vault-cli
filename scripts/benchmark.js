'use strict';

const { performance } = require('node:perf_hooks');
const { encryptPayload, decryptPayload } = require('../src/crypto');

const SAMPLE_ENV = Array.from({ length: 50 }, (_, i) => `SERVICE_SECRET_${i}=value_${i}_abcdef123456`).join('\n');
const PASSPHRASE = 'benchmark-passphrase-entropy';
const RUNS = 10;

const start = performance.now();
for (let i = 0; i < RUNS; i++) {
  const cipher = encryptPayload(SAMPLE_ENV, PASSPHRASE);
  decryptPayload(cipher, PASSPHRASE);
}
const elapsedMs = performance.now() - start;
const avgMs = (elapsedMs / RUNS).toFixed(2);

process.stdout.write(`[BENCHMARK] ${RUNS} full scrypt + AES-256-GCM cycles completed in ${elapsedMs.toFixed(2)}ms (avg: ${avgMs}ms/op)\n`);
