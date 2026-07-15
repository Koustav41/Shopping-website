const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const { app } = require('../server');

const server = http.createServer(app);

test('stores and retrieves shared data through the API', async () => {
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();

  try {
    const putResponse = await fetch(`http://127.0.0.1:${port}/api/data/cart`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: [{ title: 'Phone', quantity: 1 }] })
    });

    assert.equal(putResponse.status, 200);

    const getResponse = await fetch(`http://127.0.0.1:${port}/api/data/cart`);
    assert.equal(getResponse.status, 200);
    const payload = await getResponse.json();
    assert.deepEqual(payload.value, [{ title: 'Phone', quantity: 1 }]);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
