import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import getTelegramUser from '@/entities/TelegramUser';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';
import Select from '@/shared/ui/Select';
import Modal from '@/shared/ui/Modal';
import TextContainer from '@/shared/ui/TextContainer';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_RU from '../../../shared/locales/ru/registry.ts';
import TRANSLATIONS_EN from '../../../shared/locales/en/registry.ts';

import { TERMS_OF_SERVICE_LINES } from '../config/terms';
import { YEARS, MONTHS, getDaysInMonth } from '../config/date';
import { useCreateUser } from '../model/useCreateUser/useCreateUser';

import styles from './Registry.module.css';

type RegistrationStep = 'name' | 'birthDate';

interface FormData {
  name: string;
  month: string;
  year: string;
  day: string;
}

const getTelegramName = () => {
  const telegramUser = getTelegramUser();

  if (
    telegramUser &&
    'first_name' in telegramUser &&
    typeof telegramUser.first_name === 'string'
  ) {
    return telegramUser.first_name.trim();
  }

  return '';
};

export const Registry = () => {
  const { i18n, locale, addTranslations } = useLocales();
  const navigate = useNavigate();

  const [step, setStep] = useState<RegistrationStep>('name');
  const [formData, setFormData] = useState<FormData>(() => ({
    name: getTelegramName(),
    month: '',
    year: '',
    day: '',
  }));
  const [showUserAgreement, setShowUserAgreement] = useState(false);
  const [error, setError] = useState('');

  const { createUser, isLoading, user, error: creationError } = useCreateUser();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setFormData((current) => ({
      ...current,
      name: event.target.value,
    }));
  };

  const handleYearChange = (year: string) => {
    setError('');
    setFormData((current) => ({ ...current, year }));
  };

  const handleMonthChange = (month: string) => {
    setError('');
    setFormData((current) => {
      const availableDays = getDaysInMonth(month, Number(current.year));
      const dayIsAvailable = availableDays.some(
        (option) => option.value === current.day,
      );

      return {
        ...current,
        month,
        day: dayIsAvailable ? current.day : '',
      };
    });
  };

  const handleDayChange = (day: string) => {
    setError('');
    setFormData((current) => ({ ...current, day }));
  };

  const handleContinue = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = formData.name.trim();
    if (!name) {
      setError(i18n('Please enter your name'));
      return;
    }

    setFormData((current) => ({ ...current, name }));
    setError('');
    setStep('birthDate');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { name, day, month, year } = formData;
    if (!day || !month || !year) {
      setError(i18n('Please enter your birth date'));
      return;
    }

    setError('');
    await createUser({ name, day, month, year, withNatalChart: false });
  };

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [addTranslations, locale]);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [navigate, user]);

  const displayedError = error || (creationError
    ? i18n('Error during request, please try again')
    : '');

  return (
    <div className={styles.container}>
      <section className={styles.card} aria-live={'polite'}>
        <div className={styles.brand} aria-hidden={'true'}>
          <span className={styles.brandStar}>✦</span>
          <span>TAROTOPIA</span>
        </div>

        <div className={styles.progress}>
          <span>
            {i18n('Step {step} of 2', {
              step: step === 'name' ? 1 : 2,
            })}
          </span>
          <div className={styles.progressDots} aria-hidden={'true'}>
            <span className={styles.progressDotActive} />
            <span
              className={
                step === 'birthDate' ? styles.progressDotActive : ''
              }
            />
          </div>
        </div>

        {step === 'name' ? (
          <form
            className={styles.step}
            key={'name'}
            onSubmit={handleContinue}
          >
            <div className={styles.heading}>
              <h1>{i18n('How should we address you?')}</h1>
              <p>
                {i18n(
                  'We will use this name in personal readings. You can change it later.',
                )}
              </p>
            </div>

            <label className={styles.field}>
              <span>{i18n('Name')}</span>
              <Input
                autoComplete={'given-name'}
                autoFocus
                className={styles.textInput}
                maxLength={50}
                name={'name'}
                onChange={handleNameChange}
                placeholder={i18n('Your name')}
                type={'text'}
                value={formData.name}
              />
            </label>

            <Button className={styles.primaryButton} type={'submit'}>
              {i18n('Continue')}
            </Button>
          </form>
        ) : (
          <form
            className={styles.step}
            key={'birthDate'}
            onSubmit={handleSubmit}
          >
            <div className={styles.heading}>
              <h1>{i18n('When were you born?')}</h1>
              <p>
                {i18n(
                  'Your birth date helps us determine your zodiac sign and personalize the app.',
                )}
              </p>
            </div>

            <fieldset className={styles.fieldset}>
              <legend>{i18n('Birth date')}</legend>
              <div className={styles.date}>
                <Select
                  className={styles.dateSelect}
                  onChange={handleMonthChange}
                  options={MONTHS[locale]}
                  placeholder={i18n('month')}
                  value={formData.month}
                />
                <Select
                  className={styles.dateSelect}
                  emptyPhrase={i18n('choose month')}
                  onChange={handleDayChange}
                  options={getDaysInMonth(
                    formData.month,
                    Number(formData.year),
                  )}
                  placeholder={i18n('day')}
                  value={formData.day}
                />
                <Select
                  className={styles.dateSelect}
                  hasSearch
                  onChange={handleYearChange}
                  options={YEARS}
                  placeholder={i18n('year')}
                  value={formData.year}
                />
              </div>
            </fieldset>

            <p className={styles.privacy}>
              {i18n(
                'We use this information for personalized features and do not show it to other users.',
              )}{' '}
              <button
                className={styles.link}
                onClick={() => setShowUserAgreement(true)}
                type={'button'}
              >
                {i18n('Privacy policy')}
              </button>
            </p>

            <div className={styles.actions}>
              <Button
                className={styles.secondaryButton}
                disabled={isLoading}
                onClick={() => {
                  setError('');
                  setStep('name');
                }}
                type={'button'}
              >
                {i18n('Back')}
              </Button>
              <Button
                className={styles.primaryButton}
                disabled={isLoading}
                isLoading={isLoading}
                type={'submit'}
              >
                {isLoading ? i18n('Creating account') : i18n('Get started')}
              </Button>
            </div>
          </form>
        )}

        <div className={styles.errorSlot}>
          {displayedError && (
            <span className={styles.error} role={'alert'}>
              {displayedError}
            </span>
          )}
        </div>
      </section>

      <Modal
        className={styles.modal}
        contentClassName={styles.modalContent}
        isOpen={showUserAgreement}
        onClose={() => setShowUserAgreement(false)}
        overlayClassName={styles.policyOverlay}
      >
        <h3 className={styles.modalTitle}>
          {i18n('Terms of Service and Privacy Policy for the TAROTOPIA App')}
        </h3>
        <TextContainer
          className={styles.agreement}
          maxHeight={500}
          maxHeightMeasure={'px'}
          paragraphs={TERMS_OF_SERVICE_LINES}
        />
      </Modal>
    </div>
  );
};
