import { v4 } from 'uuid';

import { ensureSupabase } from '@/shared/api/supabase';

import type { SpreadDraftResult, SpreadParams } from '../types';
import { spreadParamsFromRow, type SpreadRow } from './spreadMapper';

export const isSpreadDraftId = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

const parseDraftResult = (value: unknown): SpreadDraftResult => {
  if (!value || typeof value !== 'object' || !('status' in value)) {
    throw new Error('Invalid spread draft response');
  }

  const result = value as SpreadDraftResult & { spread?: SpreadRow };

  if (!isSpreadDraftId(result.draftId)) {
    throw new Error('Invalid spread draft id in server response');
  }

  if (result.status === 'ready') {
    if (!result.spread) {
      throw new Error('Missing spread in server response');
    }

    return {
      ...result,
      spread: spreadParamsFromRow(result.spread),
    };
  }

  return result;
};

export const startSpreadDraft = async (
  spread: SpreadParams,
): Promise<SpreadDraftResult> => {
  await ensureSupabase();

  const draftId = spread.spreadId ?? v4();
  const { data, error } = await window.supabase.functions.invoke(
    'tarot-reading',
    {
      body: {
        action: 'start',
        draftId,
        spread: {
          question: spread.question,
          userAnswer: spread.userAnswer,
          details: spread.details,
          detailsAnswer: spread.detailsAnswer,
          spreadType: spread.id,
          title: spread.title,
          cardsCount: spread.cardsCount,
        },
      },
    },
  );

  if (error) throw error;

  return parseDraftResult(data);
};

export const resumeSpreadDraft = async (
  draftId: string,
): Promise<SpreadDraftResult> => {
  if (!isSpreadDraftId(draftId)) {
    throw new Error('Invalid spread draft id');
  }

  await ensureSupabase();

  const { data, error } = await window.supabase.functions.invoke(
    'tarot-reading',
    {
      body: { action: 'resume', draftId },
    },
  );

  if (error) throw error;

  return parseDraftResult(data);
};
