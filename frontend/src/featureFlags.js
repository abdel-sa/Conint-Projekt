import posthog from 'posthog-js';

const UI_VARIANT_FLAG = 'secret-notes-ui-variant-b';
let initialized = false;

export function initFeatureFlags() {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (!key || initialized) return;

  posthog.init(key, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
  });
  initialized = true;
}

export function isVariantBEnabled() {
  try {
    return posthog.isFeatureEnabled(UI_VARIANT_FLAG) === true;
  } catch {
    return false;
  }
}

export { UI_VARIANT_FLAG };
