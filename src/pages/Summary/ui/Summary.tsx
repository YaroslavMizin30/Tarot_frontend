import { useEffect, useState } from 'react';

import { Link, useLocation } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';
import TextContainer from '@/shared/ui/TextContainer';
import TRANSLATIONS_EN from '@/shared/locales/en/history';
import TRANSLATIONS_RU from '@/shared/locales/ru/history';
import RatingInput from '@/shared/ui/RatingInput';
import Arrow from '@/shared/assets/svg/common/deck-arrow.svg';

import { type Summary, updateSummary } from '@/entities/Spread';

import styles from './Summary.module.css';

export const SummaryPage = () => {
  const { state } = useLocation();
  const { i18n, addTranslations } = useLocales();

  const { date, summary, rating, id } = state as Summary;

  const [rate, setRate] = useState(rating);

  const handleRatingInputChange = async (value: number) => {
    setRate(value);

    await updateSummary(id, { rating: value });
  };

  useEffect(() => {
    addTranslations({
      en: TRANSLATIONS_EN,
      ru: TRANSLATIONS_RU,
    });
  }, []);

  return (
    <div className={`${styles.container} custom-scrollbar`}>
      <div className={styles.info}>
        <span>
          {i18n('Date')}: {date}
        </span>
      </div>

      <TextContainer
        paragraphs={summary.replace(/[*|#]/g, '').split('\n')}
        maxHeight={350}
        maxHeightMeasure={'px'}
        className={styles.interpretation}
      />

      <RatingInput value={rate ?? 0} onChange={handleRatingInputChange} />

      <Link className={styles.link} to={'/history'}>
        <Arrow />
      </Link>
    </div>
  );
};
