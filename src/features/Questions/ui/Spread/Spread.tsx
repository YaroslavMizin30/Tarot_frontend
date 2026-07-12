import { useEffect, useState, type FC } from 'react';

import Button from '@/shared/ui/Button';
import useLocales from '@/shared/hooks/useLocales';
import Price from '@/shared/ui/Price';

import TarotDeck from '@/entities/TarotDeck';
import { SPREADS } from '@/features/TarotSpread';
import { useUser } from '@/entities/User';

import type { SpreadProps } from './Spread.props';

import styles from './Spread.module.css';

const Spread: FC<SpreadProps> = (props) => {
  const { spread, onSpreadChange, onSpreadSelect } = props;

  const { title, cardsCount, question, detailsAnswer, userAnswer } = spread;

  const { i18n } = useLocales();

  const [isReading, setIsReading] = useState(false);

  const { user } = useUser();

  const handleReadEnd = () => {
    setIsReading(false);

    onSpreadSelect(spread);
  };

  const audio = new Audio('/assets/sfx/gong.mp3');

  const handleSpreadButtonClick = () => {
    setIsReading(true);

    if (user?.audio) {
      audio.volume = 0.1;
      audio.play();
    }
  };

  const getQuestion = () => {
    if (question) {
      return (
        <>
          <h3>{`${i18n('Question')}: ${question}`}</h3>
          {detailsAnswer && userAnswer ? (
            <h3>{`${detailsAnswer}: ${userAnswer}`}</h3>
          ) : null}
        </>
      );
    }

    return <h3>{`${i18n('Question')}: ${userAnswer}`}</h3>;
  };

  const getCardWithCase = (count: number) => {
    switch (true) {
      case count === 1:
        return i18n('card');
      case count > 1 && count < 5:
        return i18n('cards(nominative)');
      default:
        return i18n('cards(accusative)');
    }
  };

  const getSpread = () => {
    if (title && cardsCount) {
      return (
        <h3>{`${i18n('Spread')}: "${i18n(title)}" (${cardsCount} ${getCardWithCase(cardsCount)})`}</h3>
      );
    }

    return (
      <>
        <h3>{i18n('Select spread')}:</h3>

        {SPREADS.map((spreadTemplate) => {
          const { label, cardCount, id } = spreadTemplate;

          const handleSpreadButtonClick = () => {
            onSpreadChange({
              ...spread,
              cardsCount: cardCount,
              title: i18n(label),
              id,
            });
          };

          return (
            <Button key={id} onClick={handleSpreadButtonClick}>
              {`${i18n(label)} (${cardCount} ${getCardWithCase(cardCount)})`}
            </Button>
          );
        })}
      </>
    );
  };

  useEffect(() => {
    return () => audio.pause();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {getQuestion()}

        {getSpread()}

        <TarotDeck
          isReady={true}
          isReading={isReading}
          onReadEnd={handleReadEnd}
          className={styles.deck}
        />

        <span
          className={styles.loadingMessage}
          style={{
            visibility: isReading ? 'visible' : 'hidden',
          }}
        >
          {i18n('Shuffling the deck')}
        </span>

        <div className={styles.finish}>
          <h3>{i18n('Ready?')}</h3>

          <Button
            className={styles.button}
            disabled={!title}
            onClick={handleSpreadButtonClick}
            isLoading={isReading}
            iconRight={<Price cost={spread.cardsCount} />}
          >
            {i18n('Click')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Spread;
