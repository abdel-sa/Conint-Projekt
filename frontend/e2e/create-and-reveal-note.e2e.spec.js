import { test, expect } from '@playwright/test';

test('user can create a note and reveal it with the correct passphrase', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Note content').fill('e2e ui secret');
  await page.locator('form').first().getByLabel('Passphrase', { exact: true }).fill('e2e-ui-passphrase');
  await page.getByRole('button', { name: 'Create note' }).click();

  await expect(page.getByRole('status').first()).toContainText('Note created securely');

  await page.getByRole('button', { name: /\(/ }).first().click();
  await page.locator('form').nth(1).getByLabel('Passphrase', { exact: true }).fill('e2e-ui-passphrase');
  await page.getByRole('button', { name: 'Reveal' }).click();

  await expect(page.getByRole('status').last()).toContainText('e2e ui secret');
});

test('shows an error when the passphrase is wrong', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Note content').fill('protected content');
  await page.locator('form').first().getByLabel('Passphrase', { exact: true }).fill('correct-passphrase');
  await page.getByRole('button', { name: 'Create note' }).click();

  await page.getByRole('button', { name: /\(/ }).first().click();
  await page.locator('form').nth(1).getByLabel('Passphrase', { exact: true }).fill('wrong-passphrase');
  await page.getByRole('button', { name: 'Reveal' }).click();

  await expect(page.getByRole('alert')).toContainText('Incorrect passphrase');
});
