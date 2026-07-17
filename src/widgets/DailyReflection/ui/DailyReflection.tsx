import { useQuery } from '@tanstack/react-query';

import { ensureSupabase } from '@/shared/api/supabase';
import { queryKeys } from '@/shared/api/queryKeys';
import useLocales from '@/shared/hooks/useLocales';
import { useUser } from '@/entities/User';

import styles from './DailyReflection.module.css';

type ReflectionResponse = {
  question?: { text_ru?: string; text_en?: string } | null;
};

const getDailyReflection = async () => {
  await ensureSupabase();
  const { data, error } = await window.supabase.functions.invoke<ReflectionResponse>(
    'daily-reflection',
    { body: { action: 'get' } },
  );
  if (error) throw error;
  return data;
};

export const DailyReflection = () => {
  const { user } = useUser();
  const { locale, i18n } = useLocales();
  const date = new Date().toLocaleDateString('en-CA');
  const { data } = useQuery({
    queryKey: queryKeys.dailyReflection.byUserDate(user?.id ?? 'no-user', date),
    queryFn: getDailyReflection,
    enabled: Boolean(user),
    staleTime: 60 * 60 * 1000,
  });

  const question = locale === 'ru'
    ? data?.question?.text_ru
    : data?.question?.text_en;

  return (
    <section className={styles.root} aria-live={'polite'}>
      {question && (
        <>
          <span className={styles.eyebrow}>{i18n('A question for yourself')}</span>
          <p>{question}</p>
        </>
      )}
    </section>
  );
};

export default DailyReflection;
