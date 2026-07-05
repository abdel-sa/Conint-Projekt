const { test, expect } = require('@playwright/test');

test.describe('Secret Notes API (staging)', () => {
  test('creates a note and reveals it with the correct passphrase', async ({ request }) => {
    const created = await request.post('/api/notes', {
      data: { content: 'e2e secret content', passphrase: 'e2e-passphrase' },
    });
    expect(created.status()).toBe(201);
    const { id } = await created.json();

    const revealed = await request.post(`/api/notes/${id}/reveal`, {
      data: { passphrase: 'e2e-passphrase' },
    });
    expect(revealed.status()).toBe(200);
    expect((await revealed.json()).content).toBe('e2e secret content');
  });

  test('denies access with an incorrect passphrase', async ({ request }) => {
    const created = await request.post('/api/notes', {
      data: { content: 'another secret', passphrase: 'right-passphrase' },
    });
    const { id } = await created.json();

    const revealed = await request.post(`/api/notes/${id}/reveal`, {
      data: { passphrase: 'wrong-passphrase' },
    });
    expect(revealed.status()).toBe(403);
  });

  test('health endpoint reports ok', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.status()).toBe(200);
    expect((await response.json()).status).toBe('ok');
  });
});
