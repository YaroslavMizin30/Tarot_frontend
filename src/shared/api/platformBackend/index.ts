export {
  assertSupportedPlatformBackendConfig,
  getPlatformBackendConfig,
  parsePlatformBackendMode,
} from './config';
export type {
  PlatformBackendConfig,
  PlatformBackendMode,
} from './config';
export {
  getUniversalDomainMode,
  parseUniversalDomainList,
  resolveUniversalDomainMode,
  UNIVERSAL_PRODUCT_DOMAINS,
} from './domainConfig';
export type {
  UniversalDomainMode,
  UniversalProductDomain,
} from './domainConfig';
export {
  getSafePlatformApiErrorCode,
  getPlatformApiUrl,
  getPlatformSessionTransport,
} from './platformApi';
export {
  completeCanonicalOnboarding,
  getCanonicalProfile,
} from './profileApi';
export type {
  CompleteCanonicalOnboardingPayload,
} from './profileApi';
export { parseCanonicalProfileResponse } from './profileContract';
export type {
  CanonicalProfile,
  CanonicalProfileResponse,
  CanonicalTheme,
} from './profileContract';
export { createPlatformDomainInvocation } from './universalApi';
