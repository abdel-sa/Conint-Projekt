import posthog from 'posthog-js';

const UI_VARIANT_FLAG = 'secret-notes-ui-variant-b';

export function initFeatureFlags() {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';

  if (!key) {
    console.warn('PostHog key missing');
    return false;
  }

  if (!posthog.__loaded) {
    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      loaded: (ph) => {
        ph.capture('secret_notes_app_loaded');
      },
    });
  }

  return true;
}

export function isVariantBEnabled() {
  try {
    return posthog.isFeatureEnabled(UI_VARIANT_FLAG) === true;
  } catch {
    return false;
  }
}

export function onFeatureFlagsLoaded(callback) {
  posthog.onFeatureFlags(() => {
    callback(isVariantBEnabled());
  });
}