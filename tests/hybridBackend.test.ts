import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getMode: vi.fn(),
  legacyInvoke: vi.fn(),
  platformRequest: vi.fn(),
}));

vi.mock(
  '../src/shared/api/platformBackend',
  () => ({
    createPlatformDomainInvocation: (operation: string) =>
      operation === 'user-feedback'
        ? { domain: 'feedback', request: mocks.platformRequest }
        : null,
    getUniversalDomainMode: mocks.getMode,
  }),
);

vi.mock(
  '../src/shared/api/backend/supabaseBackend',
  () => ({
    supabaseBackend: { invoke: mocks.legacyInvoke },
  }),
);

import { hybridBackend } from '../src/shared/api/backend/hybridBackend';

beforeEach(() => {
  mocks.getMode.mockReset();
  mocks.legacyInvoke.mockReset();
  mocks.platformRequest.mockReset();
});

describe('hybrid backend gateway', () => {
  it('keeps unrelated operations on legacy', async () => {
    mocks.legacyInvoke.mockResolvedValue({ ok: true });

    await expect(hybridBackend.invoke('create-invoice')).resolves.toEqual({
      ok: true,
    });
    expect(mocks.getMode).not.toHaveBeenCalled();
    expect(mocks.platformRequest).not.toHaveBeenCalled();
  });

  it('returns the platform response in authoritative domain mode', async () => {
    mocks.getMode.mockReturnValue('platform');
    mocks.platformRequest.mockResolvedValue({ feedback: null });

    await expect(
      hybridBackend.invoke('user-feedback', { action: 'get' }),
    ).resolves.toEqual({ feedback: null });
    expect(mocks.legacyInvoke).not.toHaveBeenCalled();
  });

  it('returns legacy immediately and isolates a rejected shadow request', async () => {
    mocks.getMode.mockReturnValue('shadow');
    mocks.legacyInvoke.mockResolvedValue({ feedback: null });
    mocks.platformRequest.mockRejectedValue(new Error('offline'));

    await expect(
      hybridBackend.invoke('user-feedback', { action: 'get' }),
    ).resolves.toEqual({ feedback: null });
    expect(mocks.platformRequest).toHaveBeenCalledOnce();
  });
});
