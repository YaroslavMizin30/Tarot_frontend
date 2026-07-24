import { beforeEach, describe, expect, it, vi } from 'vitest';

const transport = vi.hoisted(() => ({
  requestJson: vi.fn(),
}));

vi.mock(
  '../src/shared/api/platformBackend/platformApi',
  () => ({
    getPlatformSessionTransport: () => transport,
  }),
);

import {
  createPlatformDomainInvocation,
} from '../src/shared/api/platformBackend/universalApi';

beforeEach(() => {
  transport.requestJson.mockReset();
});

describe('universal platform API adapter', () => {
  it('maps activity into the legacy caller shape', async () => {
    transport.requestJson.mockResolvedValue({
      activity: {
        dailyCardLastRevealedAt: '2026-07-24T10:00:00.000Z',
      },
    });

    const invocation = createPlatformDomainInvocation(
      'user-activity',
      { action: 'get' },
    );

    expect(invocation?.domain).toBe('activity');
    await expect(invocation?.request()).resolves.toEqual({
      activity: {
        dailyCardLastDate: '2026-07-24T10:00:00.000Z',
      },
    });
    expect(transport.requestJson).toHaveBeenCalledWith('/v1/activity');
  });

  it('routes moon-plan list queries through the shared session', async () => {
    transport.requestJson.mockResolvedValue({ plans: [] });

    const invocation = createPlatformDomainInvocation(
      'moon-plans',
      { action: 'list', planDate: '2026-07-25' },
    );
    await invocation?.request();

    expect(transport.requestJson).toHaveBeenCalledWith(
      '/v1/moon-plans?date=2026-07-25',
    );
  });

  it('maps horoscope field names for the current UI contract', async () => {
    transport.requestJson.mockResolvedValue({
      forecasts: [{
        content: { title: 'Title' },
        facts: {},
        generatedAt: '2026-07-24T10:00:00.000Z',
        id: 'forecast-id',
        locale: 'ru',
        period: 'daily',
        periodEnd: '2026-07-24',
        periodStart: '2026-07-24',
        sign: 'taurus',
      }],
    });

    const invocation = createPlatformDomainInvocation(
      'astrology-content',
      {
        action: 'generalHoroscopes',
        locale: 'ru',
        sign: 'taurus',
      },
    );

    await expect(invocation?.request()).resolves.toEqual({
      forecasts: [{
        content: { title: 'Title' },
        facts: {},
        generated_at: '2026-07-24T10:00:00.000Z',
        id: 'forecast-id',
        locale: 'ru',
        period: 'daily',
        period_end: '2026-07-24',
        period_start: '2026-07-24',
        sign: 'taurus',
      }],
    });
  });

  it('does not intercept domains outside the migration package', () => {
    expect(createPlatformDomainInvocation(
      'create-invoice',
      { action: 'create' },
    )).toBeNull();
  });
});
