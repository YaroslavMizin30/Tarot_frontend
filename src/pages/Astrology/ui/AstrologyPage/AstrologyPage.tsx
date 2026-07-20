import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router';

import type { User } from '@/entities/User';

import { SUBSECTIONS } from '../../config/subsections';
import type { Subsection } from '../../config/subsections';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/astrology';
import TRANSLATIONS_RU from '@/shared/locales/ru/astrology';
import FORECAST_TRANSLATIONS_EN from '@/shared/locales/en/forecast';
import FORECAST_TRANSLATIONS_RU from '@/shared/locales/ru/forecast';
import TRANSITS_TRANSLATIONS_EN from '@/shared/locales/en/transits';
import TRANSITS_TRANSLATIONS_RU from '@/shared/locales/ru/transits';

import styles from './AstrologyPage.module.css';
import { AstrologySectionIcon } from './AstrologySectionIcon';
import { SkyOverview } from '../SkyOverview/SkyOverview';

const SECTION_ICONS = {
  '/horoscopes': 'horoscopes',
  '/natal-chart': 'natal-chart',
  '/calendar': 'calendar',
  '/transits': 'transits',
} as const;

export const AstrologyPage = () => {
  const { i18n, addTranslations, locale } = useLocales();
  const navigate = useNavigate();
  const { user } = useOutletContext<{ user?: User }>();

  useEffect(() => {
    addTranslations({
      en: { ...FORECAST_TRANSLATIONS_EN, ...TRANSLATIONS_EN, ...TRANSITS_TRANSLATIONS_EN },
      ru: { ...FORECAST_TRANSLATIONS_RU, ...TRANSLATIONS_RU, ...TRANSITS_TRANSLATIONS_RU },
    });
  }, [addTranslations, locale]);

  const handleOpen = (subsection: `${Subsection}`) => {
    navigate(subsection);
  };

  return (
    <div className={styles.container}>
      <SkyOverview
        hasNatalChart={Boolean(user?.natalChart)}
        sign={user?.sign}
        actions={(
          <nav className={styles.menu} aria-label={i18n('Astrology')}>
            {SUBSECTIONS.map(({ key, label }) => (
              <button
                type={'button'}
                key={key}
                className={`${styles.menuButton} ${
                  key === '/transits' ? styles.primaryMenuButton : ''
                }`}
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
          </nav>
        )}
      />
    </div>
  );
};
