const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const store = getStore('shared-data');
  const key = event.path.split('/').pop();

  if (event.httpMethod === 'GET') {
    const value = await store.get(key, { type: 'json' });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ key, value })
    };
  }

  if (event.httpMethod === 'PUT') {
    const body = JSON.parse(event.body || '{}');
    await store.setJSON(key, body.value);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ key, value: body.value })
    };
  }

  if (event.httpMethod === 'DELETE') {
    await store.delete(key);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ key, deleted: true })
    };
  }

  return {
    statusCode: 405,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
