import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('posthog-js', () => ({
  default: {
    init: vi.fn(),
    isFeatureEnabled: vi.fn(),
    onFeatureFlags: vi.fn(),
    capture: vi.fn(),
  },
}));

import posthog from 'posthog-js';
import { initFeatureFlags, isVariantBEnabled, onFeatureFlagsLoaded } from './featureFlags';

describe('featureFlags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  test('initializes PostHog when key exists', () => {
    vi.stubEnv('VITE_POSTHOG_KEY', 'test-key');
    vi.stubEnv('VITE_POSTHOG_HOST', 'https://eu.i.posthog.com');

    expect(initFeatureFlags()).toBe(true);
    expect(posthog.init).toHaveBeenCalled();
  });

  test('does not initialize PostHog when key is missing', () => {
    vi.stubEnv('VITE_POSTHOG_KEY', '');

    expect(initFeatureFlags()).toBe(false);
  });

  test('calls callback when feature flags are loaded', () => {
    posthog.isFeatureEnabled.mockReturnValue(true);

    const callback = vi.fn();

    posthog.onFeatureFlags.mockImplementation((fn) => {
      fn();
    });

    onFeatureFlagsLoaded(callback);

    expect(callback).toHaveBeenCalledWith(true);
  });
});