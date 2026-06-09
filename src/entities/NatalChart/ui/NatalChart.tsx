import { useEffect } from 'react';

import TextContainer from '@/shared/ui/TextContainer';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/natalchart';
import TRANSLATIONS_RU from '@/shared/locales/ru/natalchart';

import type { NatalChartProps } from './NatalChart.props';

import styles from './NatalChart.module.css';

export const NatalChart = (props: NatalChartProps) => {
  const {
    name,
    birthDate,
    birthTime,
    birthPlace,
    zodiacSign,
    chartDescription,
    className = '',
  } = props;

  const { i18n, addTranslations, locale } = useLocales();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  return (
    <div className={`${styles.chart} ${className}`}>
      <header className={styles.header}>
        <h2 className={styles.title}>{i18n('Natal chart')}</h2>

        <h3 className={styles.title}>{name}</h3>
      </header>

      <section className={`${styles.section} ${styles.info}`}>
        <div className={styles.item}>
          <label>{i18n('Birth date')}:</label>

          <span>{birthDate}</span>
        </div>

        {birthTime && (
          <div>
            <label>{i18n('Birth time')}:</label>

            <span>{birthTime}</span>
          </div>
        )}

        <div className={styles.item}>
          <label>{i18n('Birth place')}:</label>

          <span>{birthPlace}</span>
        </div>

        <div className={styles.item}>
          <label>{i18n('Zodiac sign')}:</label>

          <span>{zodiacSign}</span>
        </div>
      </section>

      <section className={`${styles.section} ${styles.chartContainer}`}>
        <TextContainer
          title={i18n('Chart description')}
          paragraphs={chartDescription.replace(/[*|#]/g, '').split(/\n/)}
          maxHeight={350}
          maxHeightMeasure={'px'}
          className={styles.text}
        />
      </section>
    </div>
  );
};
