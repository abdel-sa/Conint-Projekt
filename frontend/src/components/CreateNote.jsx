import { useState } from 'react';
import { createNote } from '../api';

export default function CreateNote({ onCreated }) {
  const [content, setContent] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [status, setStatus] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);
    try {
      const created = await createNote(content, passphrase);
      setStatus({ type: 'success', message: `Note created securely (id: ${created.id})` });
      setContent('');
      setPassphrase('');
      onCreated?.();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="create-note-form">
      <h2>Create Secret Note</h2>
      <label htmlFor="content">Note content</label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <label htmlFor="passphrase">Passphrase</label>
      <input
        id="passphrase"
        type="password"
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        required
      />

      <button type="submit">Create note</button>

      {status && <p role="status" data-type={status.type}>{status.message}</p>}
    </form>
  );
}
