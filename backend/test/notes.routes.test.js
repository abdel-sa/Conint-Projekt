const { buildApp } = require('../src/app');
const { createInMemoryNoteRepository } = require('../src/repository/inMemoryNoteRepository');

function buildTestApp() {
  const repository = createInMemoryNoteRepository();
  return buildApp({ repository });
}

describe('GET /health', () => {
  test('returns ok status', async () => {
    const app = buildTestApp();
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });
});

describe('POST /api/notes', () => {
  test('creates a note and returns an id', async () => {
    const app = buildTestApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/notes',
      payload: { content: 'hello secret world', passphrase: 'strongkey' },
    });
    expect(response.statusCode).toBe(201);
    expect(response.json().id).toBeDefined();
  });

  test('rejects a note without content', async () => {
    const app = buildTestApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/notes',
      payload: { passphrase: 'strongkey' },
    });
    expect(response.statusCode).toBe(400);
  });

  test('rejects a note with a too-short passphrase', async () => {
    const app = buildTestApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/notes',
      payload: { content: 'hello', passphrase: 'ab' },
    });
    expect(response.statusCode).toBe(400);
  });
});

describe('GET /api/notes', () => {
  test('lists note metadata without leaking the plaintext content', async () => {
    const app = buildTestApp();
    await app.inject({
      method: 'POST',
      url: '/api/notes',
      payload: { content: 'do not leak me', passphrase: 'strongkey' },
    });

    const response = await app.inject({ method: 'GET', url: '/api/notes' });
    const notes = response.json();

    expect(response.statusCode).toBe(200);
    expect(notes).toHaveLength(1);
    expect(JSON.stringify(notes)).not.toContain('do not leak me');
  });
});

describe('POST /api/notes/:id/reveal', () => {
  test('returns the plaintext when the passphrase is correct', async () => {
    const app = buildTestApp();
    const created = await app.inject({
      method: 'POST',
      url: '/api/notes',
      payload: { content: 'top secret', passphrase: 'strongkey' },
    });
    const { id } = created.json();

    const response = await app.inject({
      method: 'POST',
      url: `/api/notes/${id}/reveal`,
      payload: { passphrase: 'strongkey' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().content).toBe('top secret');
  });

  test('denies access with an incorrect passphrase', async () => {
    const app = buildTestApp();
    const created = await app.inject({
      method: 'POST',
      url: '/api/notes',
      payload: { content: 'top secret', passphrase: 'strongkey' },
    });
    const { id } = created.json();

    const response = await app.inject({
      method: 'POST',
      url: `/api/notes/${id}/reveal`,
      payload: { passphrase: 'wrong-key' },
    });

    expect(response.statusCode).toBe(403);
    expect(response.json().content).toBeUndefined();
  });

  test('returns 404 for an unknown note id', async () => {
    const app = buildTestApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/notes/00000000-0000-0000-0000-000000000000/reveal',
      payload: { passphrase: 'anything' },
    });
    expect(response.statusCode).toBe(404);
  });

  test('rejects a reveal request without a passphrase', async () => {
    const app = buildTestApp();
    const created = await app.inject({
      method: 'POST',
      url: '/api/notes',
      payload: { content: 'top secret', passphrase: 'strongkey' },
    });
    const { id } = created.json();

    const response = await app.inject({
      method: 'POST',
      url: `/api/notes/${id}/reveal`,
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });
});
