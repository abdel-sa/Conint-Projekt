import { useState } from 'react';
import { revealNote } from '../api';

export default function RevealNote({ noteId }) {
  const [passphrase, setPassphrase] = useState('');
  const [result, setResult] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setResult(null);
    try {
      const { content } = await revealNote(noteId, passphrase);
      setResult({ type: 'success', content });
    } catch (error) {
      setResult({ type: 'error', message: error.message });
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="reveal-note-form">
      <h2>Read Secret Note</h2>
      <label htmlFor="reveal-passphrase">Passphrase</label>
      <input
        id="reveal-passphrase"
        type="password"
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        required
      />
      <button type="submit" disabled={!noteId}>Reveal</button>

      {result?.type === 'success' && <p role="status">{result.content}</p>}
      {result?.type === 'error' && <p role="alert">{result.message}</p>}
    </form>
  );
}
