import { useQuery } from '@tanstack/react-query';

import { getCalendar } from '../api/getCalendar';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';
import useLocales from '@/shared/hooks/useLocales';

export const useCalendar = () => {
  const { user } = useUser() ?? {};

  const {
    data: calendar,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: queryKeys.calendar.all,
    queryFn: getCalendar,
    enabled: !!user,
  });

  const { i18n } = useLocales();

  const getMoonDescription = (isMoonVoidOfCourse?: boolean) => {
    if (isMoonVoidOfCourse) {
      return i18n(
        'The moon is void of course. Time for rest, routine activities or wrapping old matters.',
      );
    }

    switch (calendar?.phase?.name) {
      case 'New Moon':
        return i18n(
          'A time for new beginnings and planting seeds of intention.',
        );
      case 'First Quarter':
        return i18n('A moment to exercise willpower and overcome doubts');
      case 'Last Quarter':
        return i18n('Let go of what no longer serves.');
      case 'Full Moon':
        return i18n(
          'A powerful moment for release and celebrating achievements',
        );
      case 'Waning Crescent':
        return i18n(
          'A time for solitude, meditation, and preparing for new beginnings',
        );
      case 'Waning Gibbous':
        return i18n(
          "Energy begins to wane. Share experiences, express appreciation for what you've received",
        );
      case 'Waxing Crescent':
        return i18n('A time to act, overcoming early obstacles');
      case 'Waxing Gibbous':
        return i18n('A time for patience, analysis, and faith in your path');
    }
  };

  const moonPhases = Object.entries(calendar?.nextPhases ?? {})
    .sort((prev, next) => {
      const [, prevDate] = prev;
      const [, nextDate] = next;

      return new Date(prevDate) < new Date(nextDate) ? -1 : 1;
    })
    .map(([name, date]) => {
      return { name, date };
    });

  return {
    isLoading,
    calendar,
    phaseName: calendar?.phase?.name,
    zodiac: calendar?.zodiac?.sign,
    moonPhases,
    fetchCalendar: refetch,
    getMoonDescription,
    error,
  };
};
