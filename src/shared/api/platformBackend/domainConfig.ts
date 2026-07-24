export const UNIVERSAL_PRODUCT_DOMAINS = [
  'activity',
  'astrology',
  'feedback',
  'moon-plans',
  'spreads',
] as const;

export type UniversalProductDomain =
  typeof UNIVERSAL_PRODUCT_DOMAINS[number];
export type UniversalDomainMode = 'legacy' | 'shadow' | 'platform';

const universalDomains = new Set<string>(UNIVERSAL_PRODUCT_DOMAINS);

export const parseUniversalDomainList = (
  value: string | undefined,
): Set<UniversalProductDomain> =>
  new Set(
    (value ?? '')
      .split(',')
      .map((domain) => domain.trim().toLowerCase())
      .filter(
        (domain): domain is UniversalProductDomain =>
          universalDomains.has(domain),
      ),
  );

export const resolveUniversalDomainMode = (
  domain: UniversalProductDomain,
  authoritative: Set<UniversalProductDomain>,
  shadow: Set<UniversalProductDomain>,
): UniversalDomainMode => {
  if (authoritative.has(domain)) return 'platform';
  if (shadow.has(domain)) return 'shadow';
  return 'legacy';
};

export const getUniversalDomainMode = (
  domain: UniversalProductDomain,
): UniversalDomainMode =>
  resolveUniversalDomainMode(
    domain,
    parseUniversalDomainList(
      import.meta.env.VITE_PLATFORM_API_DOMAINS,
    ),
    parseUniversalDomainList(
      import.meta.env.VITE_PLATFORM_API_SHADOW_DOMAINS,
    ),
  );
