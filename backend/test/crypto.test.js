const { encrypt, decrypt } = require('../src/crypto');

describe('crypto', () => {
  test('encrypts and decrypts a note with the correct passphrase', () => {
    const record = encrypt('this is a secret', 'correct-horse-battery-staple');
    const plaintext = decrypt(record, 'correct-horse-battery-staple');
    expect(plaintext).toBe('this is a secret');
  });

  test('throws when the passphrase is wrong', () => {
    const record = encrypt('this is a secret', 'correct-horse-battery-staple');
    expect(() => decrypt(record, 'wrong-passphrase')).toThrow('WRONG_PASSPHRASE');
  });

  test('produces ciphertext that does not contain the plaintext', () => {
    const record = encrypt('super secret content', 'my-passphrase');
    expect(record.ciphertext).not.toContain('super secret content');
  });

  test('produces a different salt and iv on every call (no key/nonce reuse)', () => {
    const a = encrypt('same text', 'same-passphrase');
    const b = encrypt('same text', 'same-passphrase');
    expect(a.salt).not.toBe(b.salt);
    expect(a.iv).not.toBe(b.iv);
    expect(a.ciphertext).not.toBe(b.ciphertext);
  });

  test('rejects tampered ciphertext (authenticity check)', () => {
    const record = encrypt('immutable content', 'passphrase-123');
    const tampered = { ...record, ciphertext: Buffer.from('tampered').toString('base64') };
    expect(() => decrypt(tampered, 'passphrase-123')).toThrow('WRONG_PASSPHRASE');
  });
});
