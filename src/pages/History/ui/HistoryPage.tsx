import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useSpreads } from '@/entities/Spread';
import TarotCard from '@/entities/TarotCard';

import ArrowButton from '@/shared/ui/ArrowButton';
import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/history';
import TRANSLATIONS_RU from '@/shared/locales/ru/history';
import Button from '@/shared/ui/Button';
import Spinner from '@/shared/ui/Spinner';

import styles from './HistoryPage.module.css';

export const HistoryPage = () => {
  const { spreads, isLoading: areSpreadsLoading } = useSpreads();

  const navigate = useNavigate();

  const { i18n, addTranslations, locale } = useLocales();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  if (areSpreadsLoading) {
    return <Spinner size={'l'} />;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{i18n('Spreads history')}</h3>

      {spreads && spreads.length > 0 ? (
        <div className={`${styles.spreads} custom-scrollbar`}>
          {spreads.map((spread) => (
            <div className={styles.spread} key={spread.spreadId}>
              <div className={styles.info}>
                {spread.title ? (
                  <span>{`${i18n('Title')}: ${spread.title}`}</span>
                ) : (
                  <span>{`${i18n('Title')}: ${spread.question}`}</span>
                )}

                <span>{`${i18n('Date')}: ${spread.date}`}</span>

                <Button
                  onClick={() =>
                    navigate(`/history/${spread.spreadId}`, { state: spread })
                  }
                >
                  {i18n('View')}
                </Button>
              </div>

              <div className={`${styles.cards} custom-scrollbar`}>
                {spread.cards.map((card) => {
                  return (
                    <TarotCard
                      name={card.name}
                      localizedName={i18n(card.name)}
                      key={card.name}
                      isInverted={card.isInverted}
                      className={styles.card}
                      hasLoadingState
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles['empty-state']}>
          <span className={styles['empty-state-title']}>
            {i18n('No spreads yet')}
          </span>
          <span className={styles['empty-state-subtitle']}>
            {i18n('Make your first spread to see it here')}
          </span>
          <Button onClick={() => navigate('/reading')}>
            {i18n('Make spread')}
          </Button>
        </div>
      )}

      <ArrowButton
        className={styles['back-button']}
        onClick={() => navigate('/')}
      />
    </div>
  );
};
