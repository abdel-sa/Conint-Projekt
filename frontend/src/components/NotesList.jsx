import { useEffect, useState } from 'react';
import { listNotes } from '../api';

export default function NotesList({ refreshKey, selectedId, onSelect }) {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    listNotes().then(setNotes).catch((e) => setError(e.message));
  }, [refreshKey]);

  if (error) return <p role="alert">{error}</p>;

  return (
    <div>
      <h2>Notes</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <button
              type="button"
              onClick={() => onSelect(note.id)}
              aria-pressed={note.id === selectedId}
            >
              {note.id} ({new Date(note.createdAt).toLocaleString()})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
