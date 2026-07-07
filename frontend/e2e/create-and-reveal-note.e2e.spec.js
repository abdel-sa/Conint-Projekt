import { test, expect } from '@playwright/test';

test('user can create a note and reveal it with the correct passphrase', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Note content').fill('e2e ui secret');
  await page.locator('form').first().getByLabel('Passphrase', { exact: true }).fill('e2e-ui-passphrase');
  await page.getByRole('button', { name: 'Create note' }).click();

  const createdStatus = page.getByRole('status').first();
  await expect(createdStatus).toContainText('Note created securely');

  const createdText = await createdStatus.textContent();
  const noteId = createdText.match(/id:\s*([^)]+)/)?.[1];
  expect(noteId).toBeTruthy();

  await page.getByRole('button', { name: new RegExp(noteId) }).click();
  await page.locator('form').nth(1).getByLabel('Passphrase', { exact: true }).fill('e2e-ui-passphrase');
  await page.getByRole('button', { name: 'Reveal' }).click();

  await expect(page.getByText('e2e ui secret')).toBeVisible();
});

test('shows an error when the passphrase is wrong', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Note content').fill('protected content');
  await page.locator('form').first().getByLabel('Passphrase', { exact: true }).fill('correct-passphrase');
  await page.getByRole('button', { name: 'Create note' }).click();

  const createdStatus = page.getByRole('status').first();
  await expect(createdStatus).toContainText('Note created securely');

  const createdText = await createdStatus.textContent();
  const noteId = createdText.match(/id:\s*([^)]+)/)?.[1];
  expect(noteId).toBeTruthy();

  await page.getByRole('button', { name: new RegExp(noteId) }).click();
  await page.locator('form').nth(1).getByLabel('Passphrase', { exact: true }).fill('wrong-passphrase');
  await page.getByRole('button', { name: 'Reveal' }).click();

  await expect(page.getByRole('alert')).toContainText('Incorrect passphrase');
});
