import { snakeize } from '@/shared/api/http/http';
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
  userId: string | number;
  country?: string;
  lang: 'ru-RU' | 'en-EN';
}

export const createChart = async (
  params: CreateChartParams,
): Promise<NatalChart> => {
  const { data: chart } = await window.supabase.functions.invoke('chart', {
    body: snakeize(params),
  });

  return camelize(chart) as NatalChart;
};
