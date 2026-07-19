import type {
  PersonalTransitReport,
  TransitHistoryItem,
} from '../types/transitReport';
import type { PersonalTransitSummary } from '../types/transit';

const invoke = async <T>(body: Record<string, unknown>): Promise<T> => {
  const { data, error } = await window.supabase.functions.invoke<T>('personal-transits', {
    body,
  });

  if (error) throw error;
  if (data && typeof data === 'object' && 'error' in data) {
    throw new Error(String((data as { error: unknown }).error));
  }

  return data as T;
};

export const getPersonalTransitPreview = (targetDate?: string, timezone?: string) =>
  invoke<{
    targetDate: string;
    timezone: string;
    facts: PersonalTransitSummary;
    currentReport: PersonalTransitReport | null;
  }>({
    action: 'preview',
    targetDate,
    timezone,
  });

export const quotePersonalTransitReport = (
  locale: string,
  targetDate?: string,
  timezone?: string,
) => invoke<{ report: PersonalTransitReport; reused: boolean }>({
  action: 'quote',
  locale,
  targetDate,
  timezone,
});

export const purchasePersonalTransitReport = (reportId: string) =>
  invoke<
    | { status: 'completed'; report: PersonalTransitReport }
    | { status: 'processing'; report: PersonalTransitReport }
    | { status: 'failed' | 'refunded'; report: PersonalTransitReport }
    | {
      status: 'insufficient_balance';
      reportId: string;
      required: number;
      current: number;
      paidBalance: number;
      bonusBalance: number;
    }
  >({ action: 'purchase', reportId });

export const getPersonalTransitHistory = () =>
  invoke<{ reports: TransitHistoryItem[] }>({ action: 'history' });

export const getPersonalTransitReport = (reportId: string) =>
  invoke<{ report: PersonalTransitReport }>({ action: 'get', reportId });

export const savePersonalTransitReflection = (reportId: string, content: string) =>
  invoke<{ reflection: { id: string; report_id: string; content: string } }>({
    action: 'reflect',
    reportId,
    content,
  });
