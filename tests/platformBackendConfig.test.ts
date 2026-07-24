import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  assertSupportedPlatformBackendConfig,
  getPlatformBackendConfig,
  parsePlatformBackendMode,
} from '../src/shared/api/platformBackend/config';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('platform backend configuration', () => {
  it('keeps legacy mode as the safe default', () => {
    expect(parsePlatformBackendMode(undefined)).toBe('legacy');
    expect(parsePlatformBackendMode('unexpected')).toBe('legacy');
  });

  it.each([
    'legacy',
    'shadow',
    'authoritative-profile',
  ] as const)('accepts the %s mode', (mode) => {
    expect(parsePlatformBackendMode(mode)).toBe(mode);
  });

  it('reads the compatibility boundary from build-time flags', () => {
    vi.stubEnv('VITE_PLATFORM_BACKEND_MODE', 'authoritative-profile');
    vi.stubEnv('VITE_LEGACY_PRODUCT_API_COMPATIBILITY_ENABLED', 'true');

    expect(getPlatformBackendConfig()).toEqual({
      legacyProductApiCompatibility: true,
      mode: 'authoritative-profile',
    });
  });

  it('rejects a premature full product cutover', () => {
    expect(() => assertSupportedPlatformBackendConfig({
      legacyProductApiCompatibility: false,
      mode: 'authoritative-profile',
    })).toThrowError('PLATFORM_PRODUCT_API_CUTOVER_INCOMPLETE');
  });

  it('allows authoritative profile with explicit legacy product access', () => {
    expect(() => assertSupportedPlatformBackendConfig({
      legacyProductApiCompatibility: true,
      mode: 'authoritative-profile',
    })).not.toThrow();
  });
});
