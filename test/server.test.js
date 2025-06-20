import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server.js';

test('GET / returns 200', async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, resolve));
  const { port } = server.address();
  const res = await fetch(`http://localhost:${port}/`);
  assert.strictEqual(res.status, 200);
  server.close();
});
