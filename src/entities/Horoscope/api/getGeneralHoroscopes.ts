import type {
  GeneralHoroscope,
  GeneralHoroscopeLocale,
} from '../types';

export const getGeneralHoroscopes = async (
  sign: string,
  locale: GeneralHoroscopeLocale,
): Promise<GeneralHoroscope[]> => {
  const { data, error } = await window.supabase
    .from('general_horoscopes')
    .select('*')
    .eq('sign', sign)
    .eq('locale', locale)
    .order('period_start', { ascending: false });

  if (error) throw error;
  return (data ?? []) as GeneralHoroscope[];
};
