import React, { useEffect, useMemo, useState } from 'react';

import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';
import Select from '@/shared/ui/Select';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_RU from '@/shared/locales/ru/chart';
import TRANSLATIONS_EN from '@/shared/locales/en/chart';

import { COUNTRIES } from '../config/countries';

import styles from './Card.module.css';

export const Card = () => {
  const { i18n, locale, addTranslations } = useLocales();

  const [isAgreed, setIsAgreed] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    country: 'RU',
    city: '',
    date: '',
    time: '',
  });

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

  const handleTermsRead = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(e.currentTarget.checked);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');

    const { name, country, city, date } = formData;

    console.log(formData);

    if (!name || !country || !city || !date) {
      setError(i18n('All necessary fields must be filled'));

      return;
    }
  };

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  return (
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
          />
        </div>

        <div className={styles.item}>
          <span className={styles.subtitle}>{i18n('City of birth')}*</span>

          <Input onChange={handleChange} type={'text'} name={'city'} />
        </div>

        <div className={styles.item}>
          <span className={styles.subtitle}>{i18n('Birth date')}*</span>

          <Input onChange={handleChange} type={'date'} name={'date'} />
        </div>

        <div className={styles.item}>
          <span className={styles.subtitle}>{i18n('Birth time')}</span>

          <div className={styles['birth-item']}>
            <Input onChange={handleChange} type={'time'} name={'time'} />

            <div className={styles.birth}>
              <span className={styles.subtitle}>
                {i18n("I don't remember")}
              </span>

              <Input type={'checkbox'} />
            </div>
          </div>
        </div>

        <div className={styles.terms}>
          <span className={styles.subtitle}>
            {i18n('I agree with the')}{' '}
            <a className={styles.link}>{i18n('privacy policy')}</a>
          </span>

          <Input onChange={handleTermsRead} type={'checkbox'} />
        </div>

        <Button disabled={!isAgreed} className={styles.button} type={'submit'}>
          {i18n('Submit')}
        </Button>

        {error && <span className={styles.error}>{error}</span>}
      </form>
    </div>
  );
};
