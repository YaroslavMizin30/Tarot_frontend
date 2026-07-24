export type PlatformBackendMode =
  | 'legacy'
  | 'shadow'
  | 'authoritative-profile';

export interface PlatformBackendConfig {
  legacyProductApiCompatibility: boolean;
  mode: PlatformBackendMode;
}

const MODES = new Set<PlatformBackendMode>([
  'legacy',
  'shadow',
  'authoritative-profile',
]);

export const parsePlatformBackendMode = (
  value: string | undefined,
): PlatformBackendMode =>
  value && MODES.has(value as PlatformBackendMode)
    ? value as PlatformBackendMode
    : 'legacy';

export const getPlatformBackendConfig = (): PlatformBackendConfig => ({
  legacyProductApiCompatibility:
    import.meta.env.VITE_LEGACY_PRODUCT_API_COMPATIBILITY_ENABLED === 'true',
  mode: parsePlatformBackendMode(
    import.meta.env.VITE_PLATFORM_BACKEND_MODE,
  ),
});

/**
 * The current frontend still has product domains backed by Supabase. This
 * guard prevents a build from presenting an incomplete migration as a full
 * backend cutover.
 */
export const assertSupportedPlatformBackendConfig = (
  config: PlatformBackendConfig,
) => {
  if (
    config.mode === 'authoritative-profile' &&
    !config.legacyProductApiCompatibility
  ) {
    throw new Error('PLATFORM_PRODUCT_API_CUTOVER_INCOMPLETE');
  }
};
