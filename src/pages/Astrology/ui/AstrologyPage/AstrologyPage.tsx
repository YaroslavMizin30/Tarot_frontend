import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';

import StarsComposition from '@/pages/ui/StarsComposition';
import { SUBSECTIONS } from '../../config/subsections';
import type { Subsection } from '../../config/subsections';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/astrology';
import TRANSLATIONS_RU from '@/shared/locales/ru/astrology';

import { useCalendar } from '@/entities/Horoscope';

import Moon from '../Moon/Moon';

import styles from './AstrologyPage.module.css';

export const AstrologyPage = () => {
  const { i18n, addTranslations, locale } = useLocales();
  const navigate = useNavigate();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  const handleOpen = (subsection: `${Subsection}`) => {
    navigate(subsection);
  };

  const { calendar } = useCalendar();

  const { phase, zodiac, nextPhases } = calendar ?? {};
  const { name } = phase ?? {};
  const { sign } = zodiac ?? {};

  const moonPhases = Object.entries(nextPhases ?? {})
    .sort((prev, next) => {
      const [, prevDate] = prev;
      const [, nextDate] = next;

      return new Date(prevDate) < new Date(nextDate) ? -1 : 1;
    })
    .map(([name, date]) => {
      return { name, date };
    });

  return (
    <div className={styles.container}>
      <StarsComposition />

      <div className={styles.menu}>
        <div className={styles.calendar}>
          {name ? (
            <Moon
              phase={name?.toLowerCase().replace(/\s/g, '')}
              size={'l'}
              style={{ position: 'absolute', right: 0 }}
            />
          ) : null}

          <h4 className={styles.title}>{`${i18n('Moon')} ${new Date().toLocaleDateString()}`}</h4>

          <div className={styles.current}>
            {name ? <span>{`${i18n('Phase')}: ${i18n(name)}`}</span> : null}
            {sign ? <span>{`${i18n('In sign')}: ${i18n(sign)}`}</span> : null}
          </div>

          {nextPhases ? `${i18n('Next phases')}:` : null}

          {moonPhases ? (
            <div className={styles.nextPhases}>
              {moonPhases.map(({name, date}) => {
                return (
                  <div className={styles.phase} key={date}>
                    <span style={{ zIndex: 1 }}>
                      {new Date(date).toLocaleDateString()}
                    </span>

                    <Moon phase={name?.toLowerCase()} size={'s'} />

                    <span>{i18n(name)}</span>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

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
