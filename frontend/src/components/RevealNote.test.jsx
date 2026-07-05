import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RevealNote from './RevealNote';
import * as api from '../api';

describe('RevealNote', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('reveals the plaintext content with the correct passphrase', async () => {
    vi.spyOn(api, 'revealNote').mockResolvedValue({ content: 'top secret text' });
    const user = userEvent.setup();

    render(<RevealNote noteId="abc-123" />);
    await user.type(screen.getByLabelText('Passphrase'), 'correct-pass');
    await user.click(screen.getByRole('button', { name: 'Reveal' }));

    expect(await screen.findByRole('status')).toHaveTextContent('top secret text');
  });

  test('shows an alert when the passphrase is incorrect', async () => {
    vi.spyOn(api, 'revealNote').mockRejectedValue(new Error('Incorrect passphrase'));
    const user = userEvent.setup();

    render(<RevealNote noteId="abc-123" />);
    await user.type(screen.getByLabelText('Passphrase'), 'wrong-pass');
    await user.click(screen.getByRole('button', { name: 'Reveal' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Incorrect passphrase');
  });

  test('disables the reveal button when no note is selected', () => {
    render(<RevealNote noteId={null} />);
    expect(screen.getByRole('button', { name: 'Reveal' })).toBeDisabled();
  });
});
