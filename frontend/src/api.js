const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function parseErrorMessage(response, fallback) {
  try {
    const body = await response.json();
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

export async function createNote(content, passphrase) {
  const response = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, passphrase }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Failed to create note'));
  }
  return response.json();
}

export async function listNotes() {
  const response = await fetch(`${API_BASE}/notes`);
  if (!response.ok) {
    throw new Error('Failed to load notes');
  }
  return response.json();
}

export async function revealNote(id, passphrase) {
  const response = await fetch(`${API_BASE}/notes/${id}/reveal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passphrase }),
  });

  if (response.status === 403) {
    throw new Error('Incorrect passphrase');
  }
  if (response.status === 404) {
    throw new Error('Note not found');
  }
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Failed to reveal note'));
  }
  return response.json();
}
