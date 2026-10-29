'use strict';

/**
 * Overwrites a Node.js Buffer with zeros in-place to minimize sensitive key lifetime in RAM.
 * @param {Buffer} buf
 */
function zeroBuffer(buf) {
  if (Buffer.isBuffer(buf)) {
    buf.fill(0);
  }
}

/**
 * Executes a callback with a sensitive Buffer and guarantees zeroization in the finally block.
 * @template T
 * @param {Buffer} buf
 * @param {(buf: Buffer) => T} fn
 * @returns {T}
 */
function withSecureBuffer(buf, fn) {
  try {
    return fn(buf);
  } finally {
    zeroBuffer(buf);
  }
}

module.exports = {
  zeroBuffer,
  withSecureBuffer
};
