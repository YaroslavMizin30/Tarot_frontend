import { useQuery } from '@tanstack/react-query';

import { getEphemeris } from '../api/getEphemeris';
import { useUser } from '@/entities/User';
import { queryKeys } from '@/shared/api/queryKeys';
import useLocales from '@/shared/hooks/useLocales';

export const useEphemeris = () => {
  const { user } = useUser() ?? {};

  const {
    data: ephemeris,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: queryKeys.ephemeris.all,
    queryFn: getEphemeris,
    enabled: !!user,
  });

  const { i18n } = useLocales();

  const date = new Date(String(ephemeris?.timestamp));
  const hours =
    String(date.getHours()).length > 1
      ? `${date.getHours()}`
      : `0${date.getHours()}`;
  const minutes =
    String(date.getMinutes()).length > 1
      ? `${date.getMinutes()}`
      : `0${date.getMinutes()}`;

  const dateTime = `${date.toLocaleDateString()} ${i18n('at')} ${hours}:${minutes}`;

  const retrogradeBodies = ephemeris?.astrology?.retrogradeBodies?.reduce(
    (acc, curr, index, array) => {
      //eslint-disable-next-line
      acc += `${i18n(curr)}${index === array.length - 1 ? '.' : ', '}`;

      return acc;
    },
    '',
  );

  const stations = ephemeris?.astrology?.stations?.reduce(
    (acc, curr, index, array) => {
      //eslint-disable-next-line
      acc += `${i18n(curr.body)}${index === array.length - 1 ? '.' : ', '}`;

      return acc;
    },
    '',
  );

  return {
    isLoading,
    bodies: ephemeris?.bodies ?? {},
    astrology: ephemeris?.astrology,
    timestamp: ephemeris?.timestamp,
    stations,
    dateTime,
    isMoonVoidOfCourse: ephemeris?.astrology?.moonVoidOfCourse?.isVoid,
    retrogradeBodies,
    fetchCalendar: refetch,
    error,
  };
};
