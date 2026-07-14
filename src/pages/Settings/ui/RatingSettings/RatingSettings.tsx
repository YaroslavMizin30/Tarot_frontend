import { useState, type ChangeEvent } from 'react';

import { useUser } from '@/entities/User';
import { useRating, type RatingPayload } from '@/entities/Rating';

import useLocales from '@/shared/hooks/useLocales';
import Button from '@/shared/ui/Button';
import ArrowButton from '@/shared/ui/ArrowButton';
import RatingInput from '@/shared/ui/RatingInput';
import Spinner from '@/shared/ui/Spinner';
import TextArea from '@/shared/ui/TextArea';

import styles from './RatingSettings.module.css';
import pageStyles from '../SettingsPage.module.css';

type RatingField = Exclude<keyof RatingPayload, 'feedback'>;

const RATING_FIELDS: { field: RatingField; labelKey: string }[] = [
  { field: 'convenience', labelKey: 'Rating convenience' },
  { field: 'aesthetics', labelKey: 'Rating aesthetics' },
  { field: 'predictions', labelKey: 'Rating predictions' },
  { field: 'tarotSpreads', labelKey: 'Rating tarot spreads' },
  { field: 'details', labelKey: 'Rating details' },
];

const EMPTY_VALUES: RatingPayload = {
  convenience: 0,
  aesthetics: 0,
  predictions: 0,
  tarotSpreads: 0,
  details: 0,
  feedback: '',
};

const RatingSettings = (props: { onBackButtonClick: () => void }) => {
  const { onBackButtonClick } = props;

  const { user } = useUser();
  const { i18n } = useLocales();

  const { rating, isLoading, isSubmitting, hasRated, error, submitRating } =
    useRating();

  const [values, setValues] = useState<RatingPayload>(EMPTY_VALUES);
  const [isSaved, setIsSaved] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  if (rating && !isInitialized) {
    setValues({
      convenience: rating.convenience,
      aesthetics: rating.aesthetics,
      predictions: rating.predictions,
      tarotSpreads: rating.tarotSpreads,
      details: rating.details,
      feedback: rating.feedback ?? '',
    });
    setIsInitialized(true);
  }

  if (!user) {
    return null;
  }

  const handleRatingChange = (field: RatingField) => (value: number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
    setValidationError(null);
  };

  const handleFeedbackChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, feedback: event.target.value }));
    setIsSaved(false);
    setValidationError(null);
  };

  const handleSubmit = async () => {
    const isAllRated = RATING_FIELDS.every(({ field }) => values[field] > 0);

    if (!isAllRated) {
      setValidationError(i18n('Please rate all criteria'));
      return;
    }

    setValidationError(null);

    const success = await submitRating(values);

    if (success) {
      setIsSaved(true);
    }
  };

  const isAllRated = RATING_FIELDS.every(({ field }) => values[field] > 0);

  const displayError = validationError ?? error;

  if (isLoading) {
    return (
      <>
        <h3 className={pageStyles.title}>{i18n('Rate the app')}</h3>

        <div className={pageStyles.section}>
          <div className={styles.loader}>
            <Spinner size={'l'} />
          </div>
        </div>

        <ArrowButton className={pageStyles.arrow} onClick={onBackButtonClick} />
      </>
    );
  }

  return (
    <>
      <h3 className={pageStyles.title}>{i18n('Rate the app')}</h3>

      <div className={pageStyles.section}>
        <div className={styles.form}>
          <div className={styles.criteria}>
            {RATING_FIELDS.map(({ field, labelKey }) => (
              <div key={field} className={styles.criterion}>
                <span className={styles.criterionLabel}>{i18n(labelKey)}</span>
                <RatingInput
                  value={values[field]}
                  onChange={handleRatingChange(field)}
                  size={'sm'}
                  disabled={isSubmitting}
                />
              </div>
            ))}
          </div>

          <div className={styles.feedback}>
            <label className={styles.feedbackLabel} htmlFor={'rating-feedback'}>
              {i18n('Your feedback')}
            </label>

            <TextArea
              id={'rating-feedback'}
              className={styles.textarea}
              wrapperClassName={styles.textarea}
              placeholder={i18n('Tell us what you think')}
              value={values.feedback}
              onChange={handleFeedbackChange}
              disabled={isSubmitting}
              maxLength={1000}
            />
          </div>

          {isSaved && (
            <div className={styles.success}>{i18n('Thanks for your rating!')}</div>
          )}

          {displayError && <div className={styles.error}>{displayError}</div>}

          <div className={styles.actions}>
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!isAllRated || isSubmitting}
            >
              {hasRated ? i18n('Update rating') : i18n('Submit rating')}
            </Button>
          </div>
        </div>
      </div>

      <ArrowButton className={pageStyles.arrow} onClick={onBackButtonClick} />
    </>
  );
};

export default RatingSettings;
