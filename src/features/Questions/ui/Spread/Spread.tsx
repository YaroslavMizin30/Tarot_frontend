import { useState, type ChangeEvent, type FC } from 'react';

import Button from '@/shared/ui/Button';
import useLocales from '@/shared/hooks/useLocales';
import Price from '@/shared/ui/Price';
import TextArea from '@/shared/ui/TextArea/TextArea';

import { SPREADS, type Spread as SpreadOption } from '@/features/TarotSpread';

import type { SpreadProps } from './Spread.props';

import styles from './Spread.module.css';

const Spread: FC<SpreadProps> = (props) => {
  const {
    spread,
    onQuestionInput,
    onSpreadChange,
    onSpreadPrepare,
    onSpreadSelect,
  } = props;
  const { title, cardsCount, question, details, userAnswer } = spread;

  const { i18n } = useLocales();

  const [isPreparing, setIsPreparing] = useState(false);
  const [prepareError, setPrepareError] = useState<string | null>(null);
  const [recommendedSpread] = useState(() =>
    spread.title
      ? {
        id: spread.id,
        label: spread.title,
        cardCount: spread.cardsCount,
      }
      : null,
  );

  const needsAnswer = !question || Boolean(details);
  const canStart =
    Boolean(title) && (!needsAnswer || Boolean(userAnswer?.trim()));

  const spreadOptions: SpreadOption[] = [
    ...(recommendedSpread ? [recommendedSpread] : []),
    ...SPREADS,
  ].filter(
    (option, index, options) =>
      options.findIndex((item) => item.id === option.id) === index,
  );
  const selectedSpread = spreadOptions.find(({ id }) => id === spread.id);

  const handleStartClick = async () => {
    if (!canStart || isPreparing) return;

    setIsPreparing(true);
    setPrepareError(null);

    try {
      const preparedSpread = await onSpreadPrepare(spread);

      if (!preparedSpread) return;

      onSpreadChange(preparedSpread);
      onSpreadSelect(preparedSpread);
    } catch {
      setPrepareError(i18n('Unable to prepare spread'));
    } finally {
      setIsPreparing(false);
    }
  };

  const handleAnswerChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onQuestionInput(event.target.value);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span>{i18n('Question')}</span>
        <h2>{question || i18n('My own question')}</h2>
      </header>

      {needsAnswer && (
        <label className={styles.answer}>
          <span>{details || i18n('What would you like to ask?')}</span>
          <TextArea
            className={styles.input}
            maxLength={500}
            onChange={handleAnswerChange}
            placeholder={i18n('Type here...')}
            value={userAnswer ?? ''}
          />
        </label>
      )}

      <section className={styles.spreadSection}>
        <div className={styles.sectionTitle}>
          <h3>{i18n('Choose spread')}</h3>
          {cardsCount > 0 && <Price cost={cardsCount} />}
        </div>

        <div className={styles.spreads}>
          {spreadOptions.map((option) => {
            const isSelected = option.id === spread.id && Boolean(title);
            const isRecommended = option.id === recommendedSpread?.id;

            return (
              <button
                aria-pressed={isSelected}
                className={`${styles.spreadOption} ${isSelected ? styles.selected : ''}`}
                key={option.id}
                onClick={() =>
                  onSpreadChange({
                    ...spread,
                    cardsCount: option.cardCount,
                    title: i18n(option.label),
                    id: option.id,
                  })
                }
                type={'button'}
              >
                {isRecommended && (
                  <span className={styles.recommended}>
                    {i18n('Recommended')}
                  </span>
                )}
                <strong>{i18n(option.label)}</strong>
                <span>{`${option.cardCount} · ${i18n('cards')}`}</span>
              </button>
            );
          })}
        </div>

        {selectedSpread && title && (
          <div className={styles.selectedInfo}>
            <strong>{i18n(selectedSpread.label)}</strong>
            <span>
              {selectedSpread.description
                ? i18n(selectedSpread.description)
                : i18n('Recommended for this question')}
            </span>
          </div>
        )}
      </section>

      <div className={styles.action}>
        <Button
          className={styles.button}
          disabled={!canStart}
          iconRight={cardsCount ? <Price cost={cardsCount} /> : null}
          isLoading={isPreparing}
          onClick={handleStartClick}
        >
          {isPreparing
            ? i18n('Checking balance')
            : i18n('Go to cards')}
        </Button>
      </div>

      {prepareError && (
        <p className={styles.prepareError} role={'alert'}>
          {prepareError}
        </p>
      )}
    </div>
  );
};

export default Spread;
