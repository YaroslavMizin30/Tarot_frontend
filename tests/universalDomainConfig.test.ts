import { describe, expect, it } from 'vitest';

import {
  parseUniversalDomainList,
  resolveUniversalDomainMode,
} from '../src/shared/api/platformBackend/domainConfig';

describe('universal product domain configuration', () => {
  it('parses only known domains and normalizes whitespace', () => {
    expect([
      ...parseUniversalDomainList(
        ' feedback,SPREADS, unknown, moon-plans,feedback ',
      ),
    ]).toEqual(['feedback', 'spreads', 'moon-plans']);
  });

  it('keeps legacy as the safe default', () => {
    expect(resolveUniversalDomainMode(
      'activity',
      new Set(),
      new Set(),
    )).toBe('legacy');
  });

  it('allows shadow mode per domain', () => {
    expect(resolveUniversalDomainMode(
      'astrology',
      new Set(),
      new Set(['astrology']),
    )).toBe('shadow');
  });

  it('gives an explicit platform cutover precedence over shadow', () => {
    expect(resolveUniversalDomainMode(
      'spreads',
      new Set(['spreads']),
      new Set(['spreads']),
    )).toBe('platform');
  });
});
