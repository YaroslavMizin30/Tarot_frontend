import { snakeize } from '@/shared/api/http/http';
import { backend } from '@/shared/api/backend';
import camelize from 'camelize';

import type { NatalChart } from '@/entities/Horoscope';

export interface CreateChartParams {
  name: string;
  year: number | string;
  month: number | string;
  day: number | string;
  timeKnown: boolean;
  hour?: number | string;
  minute?: number | string;
  city: string;
  country?: string;
  lang: 'ru-RU' | 'en-EN';
}

export const createChart = async (
  params: CreateChartParams,
): Promise<NatalChart> => {
  const chart = await backend.invoke<unknown>('chart',
    snakeize({ ...params, requestId: crypto.randomUUID() }),
  );

  if (!chart) {
    throw new Error('NATAL_CHART_FAILED');
  }

  return camelize(chart) as NatalChart;
};
