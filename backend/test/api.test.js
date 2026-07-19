const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../index');

test('health endpoint responds', async () => {
  const response = await fetch('http://127.0.0.1:5000/api/health');
  assert.equal(response.status, 200);
});
