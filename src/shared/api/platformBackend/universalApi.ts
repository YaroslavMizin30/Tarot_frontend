import { getPlatformSessionTransport } from './platformApi';
import type { UniversalProductDomain } from './domainConfig';

type JsonObject = Record<string, unknown>;

export interface PlatformDomainInvocation {
  domain: UniversalProductDomain;
  request: () => Promise<unknown>;
}

const objectPayload = (
  payload: Record<string, unknown> | undefined,
): JsonObject => payload ?? {};

const requiredString = (value: unknown, code: string) => {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(code);
  }
  return value;
};

const requiredInteger = (value: unknown, code: string) => {
  if (!Number.isInteger(value)) throw new Error(code);
  return value as number;
};

const normalizeDateKey = (value: unknown, code: string) => {
  const input = requiredString(value, code);
  const localized = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(input);
  const normalized = localized
    ? `${localized[3]}-${localized[2]}-${localized[1]}`
    : input;
  const parsed = new Date(`${normalized}T00:00:00.000Z`);

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(normalized) ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== normalized
  ) {
    throw new Error(code);
  }

  return normalized;
};

const jsonRequest = (
  path: string,
  method: 'POST' | 'PUT' | 'PATCH',
  body?: unknown,
) => {
  const hasBody = body !== undefined;

  return getPlatformSessionTransport().requestJson<unknown>(path, {
    body: hasBody ? JSON.stringify(body) : undefined,
    headers: hasBody ? { 'content-type': 'application/json' } : undefined,
    method,
  });
};

const mapFeedback = (value: unknown) => {
  if (!value || typeof value !== 'object') return value;
  const response = value as { feedback?: unknown };
  if (!response.feedback || typeof response.feedback !== 'object') {
    return value;
  }

  const feedback = response.feedback as JsonObject;
  return {
    feedback: {
      aesthetics: feedback.aesthetics,
      convenience: feedback.convenience,
      details: feedback.details,
      feedback: feedback.feedback ?? undefined,
      predictions: feedback.predictions,
      tarotSpreads: feedback.tarotSpreads,
    },
  };
};

const mapActivity = (value: unknown) => {
  if (!value || typeof value !== 'object') return value;
  const response = value as { activity?: unknown };
  if (!response.activity || typeof response.activity !== 'object') {
    return { activity: null };
  }

  const activity = response.activity as JsonObject;
  return {
    activity: {
      dailyCardLastDate: activity.dailyCardLastRevealedAt ?? null,
    },
  };
};

const mapHoroscopes = (value: unknown) => {
  if (!value || typeof value !== 'object') return value;
  const response = value as { forecasts?: unknown };
  if (!Array.isArray(response.forecasts)) return value;

  return {
    forecasts: response.forecasts.map((forecast) => {
      if (!forecast || typeof forecast !== 'object') return forecast;
      const item = forecast as JsonObject;
      return {
        content: item.content,
        facts: item.facts,
        generated_at: item.generatedAt,
        id: item.id,
        locale: item.locale,
        period: item.period,
        period_end: item.periodEnd,
        period_start: item.periodStart,
        sign: item.sign,
      };
    }),
  };
};

const feedbackInvocation = (
  payload: JsonObject,
): PlatformDomainInvocation => {
  if (payload.action === 'get') {
    return {
      domain: 'feedback',
      request: async () => mapFeedback(
        await getPlatformSessionTransport()
          .requestJson('/v1/feedback'),
      ),
    };
  }

  if (payload.action === 'submit') {
    const feedback = objectPayload(
      payload.feedback as Record<string, unknown> | undefined,
    );
    return {
      domain: 'feedback',
      request: async () => mapFeedback(
        await jsonRequest('/v1/feedback', 'PUT', {
          aesthetics: feedback.aesthetics,
          convenience: feedback.convenience,
          details: feedback.details,
          feedback: feedback.feedback ?? null,
          predictions: feedback.predictions,
          tarotSpreads: feedback.tarotSpreads,
        }),
      ),
    };
  }

  throw new Error('PLATFORM_FEEDBACK_ACTION_UNSUPPORTED');
};

const activityInvocation = (
  payload: JsonObject,
): PlatformDomainInvocation => {
  if (payload.action === 'get') {
    return {
      domain: 'activity',
      request: async () => mapActivity(
        await getPlatformSessionTransport()
          .requestJson('/v1/activity'),
      ),
    };
  }

  if (payload.action === 'revealDailyCard') {
    return {
      domain: 'activity',
      request: async () => mapActivity(
        await jsonRequest('/v1/activity/daily-card-reveal', 'POST'),
      ),
    };
  }

  throw new Error('PLATFORM_ACTIVITY_ACTION_UNSUPPORTED');
};

const moonPlansInvocation = (
  payload: JsonObject,
): PlatformDomainInvocation => {
  if (payload.action === 'list') {
    const planDate = requiredString(
      payload.planDate,
      'PLATFORM_MOON_PLAN_DATE_INVALID',
    );
    return {
      domain: 'moon-plans',
      request: () => getPlatformSessionTransport().requestJson(
        `/v1/moon-plans?date=${encodeURIComponent(planDate)}`,
      ),
    };
  }

  if (payload.action === 'create') {
    return {
      domain: 'moon-plans',
      request: () => jsonRequest('/v1/moon-plans', 'POST', {
        locale: payload.locale,
        notificationTime: payload.notificationTime,
        planDate: payload.planDate,
        text: payload.text,
        timezone: payload.timezone,
      }),
    };
  }

  if (payload.action === 'delete') {
    const id = requiredString(payload.id, 'PLATFORM_MOON_PLAN_ID_INVALID');
    return {
      domain: 'moon-plans',
      request: () => getPlatformSessionTransport().requestJson(
        `/v1/moon-plans/${encodeURIComponent(id)}`,
        { method: 'DELETE' },
      ),
    };
  }

  throw new Error('PLATFORM_MOON_PLAN_ACTION_UNSUPPORTED');
};

const spreadsInvocation = (
  operation: string,
  payload: JsonObject,
): PlatformDomainInvocation => {
  if (operation === 'spread-history') {
    const offset = requiredInteger(
      payload.offset,
      'PLATFORM_SPREAD_OFFSET_INVALID',
    );
    const limit = requiredInteger(
      payload.limit,
      'PLATFORM_SPREAD_LIMIT_INVALID',
    );
    return {
      domain: 'spreads',
      request: () => getPlatformSessionTransport().requestJson(
        `/v1/spread-history?offset=${offset}&limit=${limit}`,
      ),
    };
  }

  if (payload.action === 'recent') {
    const since = requiredString(
      payload.sinceDate,
      'PLATFORM_SPREAD_DATE_INVALID',
    );
    return {
      domain: 'spreads',
      request: () => getPlatformSessionTransport().requestJson(
        `/v1/spreads?since=${encodeURIComponent(since)}`,
      ),
    };
  }

  const spreadId = payload.spreadId === undefined
    ? null
    : requiredString(payload.spreadId, 'PLATFORM_SPREAD_ID_INVALID');

  if (payload.action === 'get' && spreadId) {
    return {
      domain: 'spreads',
      request: () => getPlatformSessionTransport().requestJson(
        `/v1/spreads/${encodeURIComponent(spreadId)}`,
      ),
    };
  }

  if (payload.action === 'rate' && spreadId) {
    return {
      domain: 'spreads',
      request: () => jsonRequest(
        `/v1/spreads/${encodeURIComponent(spreadId)}/rating`,
        'PATCH',
        { rating: payload.rating },
      ),
    };
  }

  if (payload.action === 'saveDaily' && spreadId) {
    const dayKey = normalizeDateKey(
      payload.dayKey,
      'PLATFORM_SPREAD_DATE_INVALID',
    );
    return {
      domain: 'spreads',
      request: () => jsonRequest(
        `/v1/spreads/daily/${encodeURIComponent(dayKey)}`,
        'PUT',
        {
          card: payload.card,
          interpretation: payload.interpretation ?? null,
          locale: payload.locale,
          spreadId,
        },
      ),
    };
  }

  throw new Error('PLATFORM_SPREAD_ACTION_UNSUPPORTED');
};

const astrologyInvocation = (
  payload: JsonObject,
): PlatformDomainInvocation => {
  const range = (path: string) => {
    const from = requiredString(payload.from, 'PLATFORM_DATE_RANGE_INVALID');
    const to = requiredString(payload.to, 'PLATFORM_DATE_RANGE_INVALID');
    return getPlatformSessionTransport().requestJson(
      `${path}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    );
  };

  if (payload.action === 'moonCalendar') {
    return {
      domain: 'astrology',
      request: () => range('/v1/astrology/moon-calendar'),
    };
  }
  if (payload.action === 'ephemerisRange') {
    return {
      domain: 'astrology',
      request: () => range('/v1/astrology/ephemeris'),
    };
  }
  if (payload.action === 'ephemerisLatest') {
    const date = requiredString(
      payload.onOrBefore,
      'PLATFORM_EPHEMERIS_DATE_INVALID',
    );
    return {
      domain: 'astrology',
      request: () => getPlatformSessionTransport().requestJson(
        `/v1/astrology/ephemeris/latest?onOrBefore=${
          encodeURIComponent(date)
        }`,
      ),
    };
  }
  if (payload.action === 'generalHoroscopes') {
    const sign = requiredString(payload.sign, 'PLATFORM_SIGN_INVALID');
    const locale = requiredString(payload.locale, 'PLATFORM_LOCALE_INVALID');
    return {
      domain: 'astrology',
      request: async () => mapHoroscopes(
        await getPlatformSessionTransport().requestJson(
          `/v1/astrology/horoscopes?sign=${
            encodeURIComponent(sign)
          }&locale=${encodeURIComponent(locale)}`,
        ),
      ),
    };
  }

  throw new Error('PLATFORM_ASTROLOGY_ACTION_UNSUPPORTED');
};

export const createPlatformDomainInvocation = (
  operation: string,
  payload?: Record<string, unknown>,
): PlatformDomainInvocation | null => {
  const body = objectPayload(payload);

  switch (operation) {
    case 'user-feedback':
      return feedbackInvocation(body);
    case 'user-activity':
      return activityInvocation(body);
    case 'moon-plans':
      return moonPlansInvocation(body);
    case 'spread-library':
    case 'spread-history':
      return spreadsInvocation(operation, body);
    case 'astrology-content':
      return astrologyInvocation(body);
    default:
      return null;
  }
};
