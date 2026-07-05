import { describe, test, expect, vi, beforeEach } from 'vitest';
import { createNote, revealNote, listNotes } from './api';

function mockFetchOnce(status, body) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
}

describe('api client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('createNote sends content and passphrase, returns created note', async () => {
    mockFetchOnce(201, { id: 'abc-123', createdAt: '2026-01-01T00:00:00Z' });

    const result = await createNote('hello', 'secret-pass');

    expect(result.id).toBe('abc-123');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/notes'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('createNote throws with the server error message on failure', async () => {
    mockFetchOnce(400, { error: 'passphrase must be at least 4 characters' });

    await expect(createNote('hello', 'ab')).rejects.toThrow(
      'passphrase must be at least 4 characters'
    );
  });

  test('listNotes returns the parsed metadata list', async () => {
    mockFetchOnce(200, [{ id: '1', createdAt: '2026-01-01T00:00:00Z' }]);

    const notes = await listNotes();

    expect(notes).toHaveLength(1);
  });

  test('revealNote returns the plaintext content on success', async () => {
    mockFetchOnce(200, { content: 'top secret' });

    const result = await revealNote('abc-123', 'correct-pass');

    expect(result.content).toBe('top secret');
  });

  test('revealNote throws "Incorrect passphrase" on a 403 response', async () => {
    mockFetchOnce(403, { error: 'incorrect passphrase' });

    await expect(revealNote('abc-123', 'wrong')).rejects.toThrow('Incorrect passphrase');
  });

  test('revealNote throws "Note not found" on a 404 response', async () => {
    mockFetchOnce(404, { error: 'note not found' });

    await expect(revealNote('missing-id', 'anything')).rejects.toThrow('Note not found');
  });
});
