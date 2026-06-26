import camelize from 'camelize';
import type { CalendarResponse } from '../types';

export const getCalendar = async () => {
  const { data } = await window.supabase.functions.invoke('calendar', {
    body: { type: 'moon' },
  });

  if (!data) {
    return null;
  }

  return camelize(JSON.parse(data) as CalendarResponse);
};
