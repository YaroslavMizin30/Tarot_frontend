import camelize from 'camelize';
import type { CalendarResponse } from '../types';
import { getDataFromDB } from '@/shared/api/supabase';

export const getCalendar = async () => {
  const data = await getDataFromDB('calendar', {
    key: 'type',
    value: 'moon',
  });

  if (!data) {
    return null;
  }

  // @ts-expect-error error
  return camelize(JSON.parse(data[0].data) as CalendarResponse);
};
