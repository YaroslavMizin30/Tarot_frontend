import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useSpreads, useSummaries } from '@/entities/Spread';
import TarotCard from '@/entities/TarotCard';
import { useUser, useSubscription } from '@/entities/User';

import ArrowButton from '@/shared/ui/ArrowButton';
import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/history';
import TRANSLATIONS_RU from '@/shared/locales/ru/history';
import Zodiac from '@/shared/ui/Zodiac';
import Button from '@/shared/ui/Button';
import Spinner from '@/shared/ui/Spinner';
import Tooltip from '@/shared/ui/Tooltip';

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
  const { isAvailableForCurrentTariff, getExpiredMessage } = useSubscription();

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

  const getSummaryTooltipContent = () => {
    if (Number(unsummarizedSpreads?.length) < 1) {
      return i18n('Need at least 2 spreads, that are not summarized');
    }

    return getExpiredMessage();
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{i18n('Spreads history')}</h3>

      <Zodiac sign={user?.sign} className={styles.zodiac} />

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

      <Tooltip
        position={'top'}
        content={getSummaryTooltipContent()}
        isEnabled={!isAvailableForCurrentTariff({
          trial: false,
          standard: false,
          extended: true,
        })}
        style={{textAlign: 'center'}}
      >
        <Button
          className={styles['summary-button']}
          onClick={handleSummaryButtonClick}
          disabled={!isAvailableForCurrentTariff({
            trial: false,
            standard: false,
            extended: true,
          })}
        >
          {i18n('Make summary')}
        </Button>
      </Tooltip>

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
