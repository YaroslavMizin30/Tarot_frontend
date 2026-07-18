import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router';

import type { User } from '@/entities/User';
import Zodiac from '@/shared/ui/Zodiac';

import { SUBSECTIONS } from '../../config/subsections';
import type { Subsection } from '../../config/subsections';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/astrology';
import TRANSLATIONS_RU from '@/shared/locales/ru/astrology';
import FORECAST_TRANSLATIONS_EN from '@/shared/locales/en/forecast';
import FORECAST_TRANSLATIONS_RU from '@/shared/locales/ru/forecast';

import styles from './AstrologyPage.module.css';
import { AstrologySectionIcon } from './AstrologySectionIcon';
import { SkyOverview } from '../SkyOverview/SkyOverview';

const SECTION_ICONS = {
  '/horoscopes': 'horoscopes',
  '/natal-chart': 'natal-chart',
  '/calendar': 'calendar',
} as const;

export const AstrologyPage = () => {
  const { i18n, addTranslations, locale } = useLocales();
  const navigate = useNavigate();
  const { user } = useOutletContext<{ user?: User }>();

  useEffect(() => {
    addTranslations({
      en: { ...FORECAST_TRANSLATIONS_EN, ...TRANSLATIONS_EN },
      ru: { ...FORECAST_TRANSLATIONS_RU, ...TRANSLATIONS_RU },
    });
  }, [addTranslations, locale]);

  const handleOpen = (subsection: `${Subsection}`) => {
    navigate(subsection);
  };

  return (
    <div className={styles.container}>
      <Zodiac sign={user?.sign} className={styles.zodiacBackground} />

      <SkyOverview sign={user?.sign} />

      <div className={styles.menu}>
        {SUBSECTIONS.map(({ key, label }) => (
          <button
            type={'button'}
            key={key}
            className={styles.menuButton}
            onClick={() => handleOpen(key)}
          >
            <AstrologySectionIcon
              className={styles.menuIcon}
              name={SECTION_ICONS[key]}
            />
            <strong>{i18n(label)}</strong>
            <span>{i18n(`${label} hint`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
