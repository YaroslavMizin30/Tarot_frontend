import React, { useEffect, useMemo, useState } from 'react';

import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';
import Select from '@/shared/ui/Select';
import Modal from '@/shared/ui/Modal';
import TextContainer from '@/shared/ui/TextContainer';
import Spinner from '@/shared/ui/Spinner';

import NatalChart from '@/entities/NatalChart';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_RU from '../../../shared/locales/ru/registry.ts';
import TRANSLATIONS_EN from '../../../shared/locales/en/registry.ts';

import { COUNTRIES } from '../config/countries';
import { TERMS_OF_SERVICE_LINES } from '../config/terms';
import { YEARS, MONTHS, getDaysInMonth } from '../config/date';

import { useCreateUser } from '../model/useCreateUser/useCreateUser';

import styles from './Registry.module.css';

export const Registry = () => {
  const { i18n, locale, addTranslations } = useLocales();

  const [isAgreed, setIsAgreed] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    country: 'RU',
    city: '',
    time: '',
    month: '',
    year: '',
    day: '',
  });

  const [showUserAgreement, setShowUserAgreement] = useState(false);

  const { createUser, isLoading, user } = useCreateUser();

  const translatedCountries = useMemo(() => {
    return COUNTRIES.map(({ value, label }) => {
      return { value, label: i18n(label) };
    });
  }, [locale, i18n]);

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');

    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCountrySelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, country: value }));
  };

  const handleYearChange = (value: string) => {
    setFormData((prev) => ({ ...prev, year: value }));
  };

  const handleMonthChange = (value: string) => {
    setFormData((prev) => ({ ...prev, month: value }));
  };

  const handleDayChange = (value: string) => {
    setFormData((prev) => ({ ...prev, day: value }));
  };

  const handleTermsRead = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(e.currentTarget.checked);
  };

  const handleUserAgreementClick = () => {
    setShowUserAgreement(true);
  };

  const handleModalClose = () => {
    setShowUserAgreement(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');

    const { name, country, city, day, month, year } = formData;

    if (!name || !country || !city || !day || !month || !year) {
      setError(i18n('All necessary fields must be filled'));

      return;
    }

    await createUser(formData);
  };

  const handleTimeCheckboxClick = () => {
    setFormData((data) => {
      return { ...data, time: '' };
    });
  };

  const handleBotButtonClick = () => {
    window.Telegram?.WebApp?.close();
  };

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <span>{i18n('Creating your natal chart')}...</span>

        <Spinner size={'l'} />
      </div>
    );
  }

  if (user) {
    return (
      <>
        <NatalChart
          {...user}
          name={user.userName}
          zodiacSign={user.sign}
          chartDescription={user.natalChart}
        />
        <Button className={styles.botButton} onClick={handleBotButtonClick}>
          {i18n('Continue')}
        </Button>
      </>
    );
  }

  return (
    <>
      {' '}
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.title}>{i18n('Natal chart')}</h3>

          <div className={styles.item}>
            <span className={styles.subtitle}>{i18n('Name')}*</span>

            <Input onChange={handleChange} type={'text'} name={'name'} />
          </div>

          <div className={styles.item}>
            <span className={styles.subtitle}>{i18n('Country of birth')}*</span>

            <Select
              onChange={handleCountrySelectChange}
              options={translatedCountries}
              value={formData.country}
              hasSearch
            />
          </div>

          <div className={styles.item}>
            <span className={styles.subtitle}>{i18n('City of birth')}*</span>

            <Input
              onChange={handleChange}
              type={'text'}
              name={'city'}
              value={formData.city}
            />
          </div>

          <div className={styles.item}>
            <span className={styles.subtitle}>{i18n('Birth date')}*</span>

            <div className={styles.date}>
              <Select
                options={getDaysInMonth(formData.month, Number(formData.year))}
                onChange={handleDayChange}
                value={formData.day}
                placeholder={i18n('day')}
                emptyPhrase={i18n('choose month')}
              />

              <Select
                options={MONTHS[locale]}
                onChange={handleMonthChange}
                value={formData.month}
                placeholder={i18n('month')}
              />

              <Select
                options={YEARS}
                onChange={handleYearChange}
                value={formData.year}
                placeholder={i18n('year')}
                hasSearch
              />
            </div>
          </div>

          <div className={styles.item}>
            <span className={styles.subtitle}>{i18n('Birth time')}</span>

            <div className={styles['birth-item']}>
              <Input
                onChange={handleChange}
                type={'time'}
                name={'time'}
                value={formData.time}
              />

              <div className={styles.birth}>
                <span className={styles.subtitle}>
                  {i18n("I don't remember")}
                </span>

                <Input type={'checkbox'} onChange={handleTimeCheckboxClick} />
              </div>
            </div>
          </div>

          <div className={styles.terms}>
            <span className={styles.subtitle}>
              {i18n('I agree with the')}{' '}
              <a onClick={handleUserAgreementClick} className={styles.link}>
                {i18n('privacy policy')}
              </a>
            </span>

            <Input onChange={handleTermsRead} type={'checkbox'} />
          </div>

          <Button
            disabled={!isAgreed}
            className={styles.button}
            type={'submit'}
          >
            {i18n('Submit')}
          </Button>

          {error && <span className={styles.error}>{error}</span>}
        </form>
      </div>
      <Modal
        isOpen={showUserAgreement}
        onClose={handleModalClose}
        className={styles.modal}
        contentClassName={styles.modalContent}
      >
        <h3 className={styles.modalTitle}>
          {i18n('Terms of Service and Privacy Policy for the TAROTOPIA App')}
        </h3>

        <TextContainer
          paragraphs={TERMS_OF_SERVICE_LINES}
          maxHeight={500}
          className={styles.agreement}
          maxHeightMeasure={'px'}
        />
      </Modal>
    </>
  );
};
