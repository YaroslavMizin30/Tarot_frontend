import type {
  GeneralHoroscope,
  GeneralHoroscopeLocale,
} from '../types';
import { backend } from '@/shared/api/backend';

export const getGeneralHoroscopes = async (
  sign: string,
  locale: GeneralHoroscopeLocale,
): Promise<GeneralHoroscope[]> => {
  const { forecasts } = await backend.invoke<{
    forecasts: GeneralHoroscope[];
  }>('astrology-content', {
    action: 'generalHoroscopes',
    sign,
    locale,
  });

  return forecasts;
};
