import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router';

import type { User } from '@/entities/User';
import Button from '@/shared/ui/Button';
import Zodiac from '@/shared/ui/Zodiac';

import { SUBSECTIONS } from '../../config/subsections';
import type { Subsection } from '../../config/subsections';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/astrology';
import TRANSLATIONS_RU from '@/shared/locales/ru/astrology';

import styles from './AstrologyPage.module.css';
import { DailyForecast } from '../DailyForecast/DailyForecast';

export const AstrologyPage = () => {
  const { i18n, addTranslations, locale } = useLocales();
  const navigate = useNavigate();
  const { user } = useOutletContext<{ user?: User }>();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  const handleOpen = (subsection: `${Subsection}`) => {
    navigate(subsection);
  };

  return (
    <div className={styles.container}>
      <Zodiac sign={user?.sign} className={styles.zodiacBackground} />

      <DailyForecast />

      <div className={styles.menu}>
        {SUBSECTIONS.map(({ key, label }) => (
          <Button
            key={key}
            className={styles.menuButton}
            onClick={() => handleOpen(key)}
          >
            {i18n(label)}
          </Button>
        ))}
      </div>
    </div>
  );
};
