import { v4 } from 'uuid';

import { backend } from '@/shared/api/backend';

import type {
  PendingSpreadDraftResult,
  CardSelectionResult,
  FinalizeSpreadResult,
  SpreadDraftResult,
  SpreadParams,
} from '../types';
import {
  spreadFromRow,
  spreadParamsFromRow,
  type SpreadRow,
} from './spreadMapper';

export const isSpreadDraftId = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

const invokeTarotReading = <T>(body: Record<string, unknown>) =>
  backend.invoke<T>('tarot-reading', body);

const parseDraftResult = (value: unknown): SpreadDraftResult => {
  if (!value || typeof value !== 'object' || !('status' in value)) {
    throw new Error('Invalid spread draft response');
  }

  const result = value as SpreadDraftResult & { spread?: SpreadRow };

  if (!isSpreadDraftId(result.draftId)) {
    throw new Error('Invalid spread draft id in server response');
  }

  if (result.status !== 'insufficient_balance' && result.spread) {
    return {
      ...result,
      spread: {
        ...spreadParamsFromRow(result.spread),
        selectedCount: result.selectedCount,
        selectedIndices: result.selectedIndices ?? [],
      },
    };
  }

  return result;
};

export const selectSpreadCard = async (
  draftId: string,
  options: { index?: number; autoFill?: boolean },
): Promise<CardSelectionResult> => {
  const data = await invokeTarotReading<CardSelectionResult>({
    action: 'select',
    draftId,
    ...options,
  });
  if (!data || data.status !== 'selecting') throw new Error('Invalid card selection response');
  return data as CardSelectionResult;
};

export const finalizeSpreadDraft = async (
  draftId: string,
): Promise<FinalizeSpreadResult> => {
  const data = await invokeTarotReading<FinalizeSpreadResult & {
    spread?: SpreadRow;
  }>({ action: 'finalize', draftId });
  if (data?.status === 'insufficient_balance') return data as FinalizeSpreadResult;
  if (data?.status !== 'ready' || !data.spread) throw new Error('Invalid finalize response');
  return { ...data, spread: spreadFromRow(data.spread as SpreadRow) } as FinalizeSpreadResult;
};

export const interpretSpreadDraft = (
  draftId: string,
  locale: string,
): Promise<{ status: string; draftId: string; interpretation?: string }> => {
  return invokeTarotReading<{
    status: string;
    draftId: string;
    interpretation?: string;
  }>({ action: 'interpret', draftId, locale });
};

export const startSpreadDraft = async (
  spread: SpreadParams,
): Promise<SpreadDraftResult> => {
  const draftId = spread.spreadId ?? v4();
  const data = await invokeTarotReading<unknown>({
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
  });

  return parseDraftResult(data);
};

export const resumeSpreadDraft = async (
  draftId: string,
): Promise<SpreadDraftResult> => {
  if (!isSpreadDraftId(draftId)) {
    throw new Error('Invalid spread draft id');
  }

  const data = await invokeTarotReading<unknown>({
    action: 'resume',
    draftId,
  });

  return parseDraftResult(data);
};

export const getPendingSpreadDraft = async (): Promise<PendingSpreadDraftResult> => {
  const data = await invokeTarotReading<Record<string, unknown>>({
    action: 'pending',
  });
  if (!data || data.status === 'empty') return { status: 'empty' };
  if (data.status !== 'found' || !isSpreadDraftId(data.draftId) || !data.spread) {
    throw new Error('Invalid pending spread response');
  }

  return {
    status: 'found',
    draftId: data.draftId,
    spread: spreadParamsFromRow(data.spread as SpreadRow),
  };
};
