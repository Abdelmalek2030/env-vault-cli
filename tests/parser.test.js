'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseEnv, serializeEnv } = require('../src/parser');
const { FormatValidationError } = require('../src/errors');

test('parseEnv handles comments, export prefix, and quoted values', () => {
  const sample = [
    '# Database config',
    'export DB_HOST=localhost',
    'DB_PASS="my secret pass"',
    "API_TOKEN='abc-123'",
    ''
  ].join('\n');

  const map = parseEnv(sample);
  assert.equal(map.get('DB_HOST'), 'localhost');
  assert.equal(map.get('DB_PASS'), 'my secret pass');
  assert.equal(map.get('API_TOKEN'), 'abc-123');
  assert.equal(map.size, 3);
});

test('parseEnv rejects invalid variable identifiers', () => {
  assert.throws(() => parseEnv('123_INVALID=val'), FormatValidationError);
  assert.throws(() => parseEnv('MISSING_EQUALS_LINE'), FormatValidationError);
});

test('serializeEnv roundtrips parsed environment map cleanly', () => {
  const input = new Map([
    ['PORT', '8080'],
    ['GREETING', 'hello world']
  ]);
  const serialized = serializeEnv(input);
  const reparsed = parseEnv(serialized);
  assert.deepEqual(reparsed, input);
});
