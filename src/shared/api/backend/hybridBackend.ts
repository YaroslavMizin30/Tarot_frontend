import {
  createPlatformDomainInvocation,
  getUniversalDomainMode,
  type UniversalProductDomain,
} from '@/shared/api/platformBackend';

import { supabaseBackend } from './supabaseBackend';
import type { BackendGateway } from './types';

const SHADOW_STORAGE_KEY = 'tarotopia:universal-domain-shadow-status';
const SHADOW_EVENT_LIMIT = 50;

interface ShadowEvent {
  domain: UniversalProductDomain;
  match: boolean;
  operation: string;
  status: 'fulfilled' | 'rejected';
}

const stableValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => ![
        'createdAt',
        'generated_at',
        'notifyAt',
        'updatedAt',
        'updated_at',
      ].includes(key))
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, stableValue(item)]),
  );
};

const valuesMatch = (legacy: unknown, platform: unknown) =>
  JSON.stringify(stableValue(legacy)) ===
    JSON.stringify(stableValue(platform));

const saveShadowEvent = (event: ShadowEvent) => {
  if (typeof window === 'undefined') return;

  try {
    const stored = window.sessionStorage.getItem(SHADOW_STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    const events = Array.isArray(parsed) ? parsed : [];
    window.sessionStorage.setItem(
      SHADOW_STORAGE_KEY,
      JSON.stringify([...events, event].slice(-SHADOW_EVENT_LIMIT)),
    );
  } catch {
    // Shadow telemetry must never affect the product request.
  }
};

const runShadow = (
  domain: UniversalProductDomain,
  operation: string,
  legacy: unknown,
  request: () => Promise<unknown>,
) => {
  request()
    .then((platform) => {
      saveShadowEvent({
        domain,
        match: valuesMatch(legacy, platform),
        operation,
        status: 'fulfilled',
      });
    })
    .catch(() => {
      saveShadowEvent({
        domain,
        match: false,
        operation,
        status: 'rejected',
      });
    });
};

export const hybridBackend: BackendGateway = {
  async invoke<T>(
    operation: string,
    payload?: Record<string, unknown>,
  ): Promise<T> {
    const platform = createPlatformDomainInvocation(operation, payload);
    if (!platform) return supabaseBackend.invoke<T>(operation, payload);

    const mode = getUniversalDomainMode(platform.domain);
    if (mode === 'platform') return await platform.request() as T;

    const legacy = await supabaseBackend.invoke<T>(operation, payload);
    if (mode === 'shadow') {
      runShadow(platform.domain, operation, legacy, platform.request);
    }
    return legacy;
  },
};
