import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotesList from './NotesList';
import * as api from '../api';

describe('NotesList', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('renders note ids fetched from the API', async () => {
    vi.spyOn(api, 'listNotes').mockResolvedValue([
      { id: 'note-1', createdAt: '2026-01-01T00:00:00Z' },
    ]);

    render(<NotesList refreshKey={0} selectedId={null} onSelect={() => {}} />);

    expect(await screen.findByText(/note-1/)).toBeInTheDocument();
  });

  test('shows an alert when loading notes fails', async () => {
    vi.spyOn(api, 'listNotes').mockRejectedValue(new Error('Failed to load notes'));

    render(<NotesList refreshKey={0} selectedId={null} onSelect={() => {}} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Failed to load notes');
  });
});
