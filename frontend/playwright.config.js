import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:8080',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
