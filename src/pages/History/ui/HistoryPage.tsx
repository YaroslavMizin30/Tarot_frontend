import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useSpreads, useSummaries } from '@/entities/Spread';
import TarotCard from '@/entities/TarotCard';
import { useUser } from '@/entities/User';

import ArrowButton from '@/shared/ui/ArrowButton';
import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/history';
import TRANSLATIONS_RU from '@/shared/locales/ru/history';
import Zodiac from '@/shared/ui/Zodiac';
import Button from '@/shared/ui/Button';
import Spinner from '@/shared/ui/Spinner';

import styles from './HistoryPage.module.css';

export const HistoryPage = () => {
  const {
    spreads,
    isLoading: areSpreadsLoading,
    unsummarizedSpreads,
  } = useSpreads();
  const {
    summaries,
    addSummary,
    isLoading: areSummariesLoading,
    isAnalyzing,
  } = useSummaries();

  const navigate = useNavigate();

  const { i18n, addTranslations, locale } = useLocales();
  const { user, isLoading: isUserLoading } = useUser();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  if (isUserLoading || areSpreadsLoading || areSummariesLoading) {
    return <Spinner size={'l'} />;
  }

  if (isAnalyzing) {
    return (
      <div className={styles.loading}>
        {i18n('Analyzing spreads')}...
        <Spinner size={'l'} className={styles.spinner} />
      </div>
    );
  }

  const handleSummaryButtonClick = async () => {
    if (!spreads) {
      return;
    }

    await addSummary(spreads);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{i18n('Spreads history')}</h3>

      <Zodiac sign={user?.sign} className={styles.zodiac} />

      <div className={`${styles.spreads} custom-scrollbar`}>
        {spreads &&
          spreads.map((spread) => (
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

      {Number(unsummarizedSpreads?.length) > 1 && (
        <Button
          className={styles['summary-button']}
          onClick={handleSummaryButtonClick}
        >
          {i18n('Make summary')}
        </Button>
      )}

      {Boolean(summaries?.length) && (
        <>
          <h3 className={styles.title}>{i18n('Summaries')}</h3>

          <div className={`${styles.summaries} custom-scrollbar`}>
            {summaries?.map((item) => {
              const { id, summary, date } = item;

              return (
                <div key={id} className={styles.summary}>
                  <div className={styles.info}>
                    {`${i18n('Date')}: ${new Date(date).toLocaleDateString()}`}{' '}
                    <Button
                      onClick={() =>
                        navigate(`/history/summary/${id}`, { state: item })
                      }
                    >
                      {i18n('View')}
                    </Button>
                  </div>
                  <div className={`${styles.interpretation} custom-scrollbar`}>
                    {summary.replace(/[*|#]/g, '')}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <ArrowButton
        className={styles['back-button']}
        onClick={() => navigate('/')}
      />
    </div>
  );
};
