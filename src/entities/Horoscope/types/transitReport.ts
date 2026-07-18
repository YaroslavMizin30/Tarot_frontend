import type { PersonalTransitSummary } from './transit';

export interface TransitReadingFactor {
  text: string;
  basis: string[];
}

export interface TransitReadingContent {
  title: string;
  summary: string;
  main_influence: TransitReadingFactor;
  supportive_factor: TransitReadingFactor;
  tension: TransitReadingFactor;
  practical_step: string;
  reflection_question: string;
}

export type TransitReportStatus =
  | 'quoted'
  | 'charged'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface PersonalTransitReport {
  id: string;
  target_date: string;
  timezone: string;
  locale: 'ru' | 'en';
  status: TransitReportStatus;
  quoted_cost: number;
  facts: PersonalTransitSummary;
  content: TransitReadingContent | null;
  completed_at: string | null;
  last_error?: string | null;
  personal_transit_reflections?: Array<{ content: string }>;
}

export interface TransitHistoryItem {
  id: string;
  target_date: string;
  locale: 'ru' | 'en';
  status: 'completed';
  quoted_cost: number;
  content: TransitReadingContent;
  completed_at: string;
}
