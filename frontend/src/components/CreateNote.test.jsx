import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateNote from './CreateNote';
import * as api from '../api';

describe('CreateNote', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('shows a success message after creating a note', async () => {
    vi.spyOn(api, 'createNote').mockResolvedValue({ id: 'abc-123' });
    const user = userEvent.setup();

    render(<CreateNote />);
    await user.type(screen.getByLabelText('Note content'), 'my secret text');
    await user.type(screen.getByLabelText('Passphrase'), 'strong-passphrase');
    await user.click(screen.getByRole('button', { name: 'Create note' }));

    expect(await screen.findByRole('status')).toHaveTextContent('abc-123');
  });

  test('shows an error message when the API call fails', async () => {
    vi.spyOn(api, 'createNote').mockRejectedValue(new Error('passphrase too short'));
    const user = userEvent.setup();

    render(<CreateNote />);
    await user.type(screen.getByLabelText('Note content'), 'text');
    await user.type(screen.getByLabelText('Passphrase'), 'ab');
    await user.click(screen.getByRole('button', { name: 'Create note' }));

    expect(await screen.findByRole('status')).toHaveTextContent('passphrase too short');
  });
});
