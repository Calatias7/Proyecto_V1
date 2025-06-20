import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server.js';

async function startServer() {
  const server = createServer();
  await new Promise(resolve => server.listen(0, resolve));
  const { port } = server.address();
  const url = `http://localhost:${port}`;
  return { server, url };
}

test('GET / returns 200', async () => {
  const { server, url } = await startServer();
  const res = await fetch(`${url}/`);
  assert.strictEqual(res.status, 200);
  server.close();
});

test('GET /index.html?x=1 returns 200', async () => {
  const { server, url } = await startServer();
  const res = await fetch(`${url}/index.html?x=1`);
  assert.strictEqual(res.status, 200);
  server.close();
});

test('GET /nope.html returns 404', async () => {
  const { server, url } = await startServer();
  const res = await fetch(`${url}/nope.html`);
  assert.strictEqual(res.status, 404);
  server.close();
});

test('GET /../package.json is forbidden', async () => {
  const { server, url } = await startServer();
  const res = await fetch(`${url}/..%2Fpackage.json`);
  assert.strictEqual(res.status, 403);
  server.close();
});
