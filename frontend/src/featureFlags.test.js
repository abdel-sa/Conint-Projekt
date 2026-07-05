import { describe, test, expect, vi, beforeEach } from 'vitest';
import posthog from 'posthog-js';
import { isVariantBEnabled } from './featureFlags';

vi.mock('posthog-js', () => ({
  default: {
    init: vi.fn(),
    isFeatureEnabled: vi.fn(),
  },
}));

describe('featureFlags', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('returns false when the flag is not enabled', () => {
    posthog.isFeatureEnabled.mockReturnValue(false);
    expect(isVariantBEnabled()).toBe(false);
  });

  test('returns true when PostHog reports the flag as enabled', () => {
    posthog.isFeatureEnabled.mockReturnValue(true);
    expect(isVariantBEnabled()).toBe(true);
  });

  test('returns false when PostHog throws (e.g. not initialized)', () => {
    posthog.isFeatureEnabled.mockImplementation(() => {
      throw new Error('not initialized');
    });
    expect(isVariantBEnabled()).toBe(false);
  });
});
