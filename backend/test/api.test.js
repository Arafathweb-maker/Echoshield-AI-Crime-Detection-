const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer } = require('../index');

let server;
let baseUrl;

before(async () => {
  server = await new Promise((resolve, reject) => {
    const currentServer = startServer(0);
    currentServer.once('listening', () => resolve(currentServer));
    currentServer.once('error', reject);
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
});

test('health endpoint responds', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
});

test('root route serves the frontend shell', async () => {
  const response = await fetch(`${baseUrl}/`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /EchoShield/i);
  assert.match(html, /<script/i);
});
