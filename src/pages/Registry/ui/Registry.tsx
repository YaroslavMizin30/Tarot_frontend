import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';
import Select from '@/shared/ui/Select';
import Modal from '@/shared/ui/Modal';
import TextContainer from '@/shared/ui/TextContainer';
import Spinner from '@/shared/ui/Spinner';
import Price from '@/shared/ui/Price';
import Error from '@/shared/ui/Error/index.ts';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_RU from '../../../shared/locales/ru/registry.ts';
import TRANSLATIONS_EN from '../../../shared/locales/en/registry.ts';

import { COUNTRIES } from '../config/countries';
import { TERMS_OF_SERVICE_LINES } from '../config/terms';
import { YEARS, MONTHS, getDaysInMonth } from '../config/date';

import { useCreateUser } from '../model/useCreateUser/useCreateUser';

import styles from './Registry.module.css';

type Locale = 'ru' | 'en';

interface BasicFormData {
  name: string;
  month: string;
  year: string;
  day: string;
}

interface ChartFormData extends BasicFormData {
  country: string;
  city: string;
  time: string;
}

interface NatalChartWidgetFormProps {
  formData: BasicFormData;
  setError: (value: string) => void;
  errorText: string;
  onClose: () => void;
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    withNatalChart: boolean,
  ) => void;
  i18n: (id: string) => string;
  locale: Locale;
}

const NatalChartWidgetForm = (props: NatalChartWidgetFormProps) => {
  const { formData, setError, errorText, onClose, onSubmit, i18n, locale } =
    props;

  const [chartData, setChartData] = useState<ChartFormData>({
    country: 'RU',
    city: '',
    time: '',
    month: formData.month,
    year: formData.year,
    day: formData.day,
  });

  const [timeUnknown, setTimeUnknown] = useState(false);

  const translatedCountries = useMemo(() => {
    return COUNTRIES.map(({ value, label }) => {
      return { value, label: i18n(label) };
    });
  }, [locale, i18n]);

  const handleChartFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setChartData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCountrySelectChange = (value: string) => {
    setChartData((prev) => ({ ...prev, country: value }));
  };

  const handleYearChange = (value: string) => {
    setChartData((prev) => ({ ...prev, year: value }));
  };

  const handleMonthChange = (value: string) => {
    setChartData((prev) => ({ ...prev, month: value }));
  };

  const handleDayChange = (value: string) => {
    setChartData((prev) => ({ ...prev, day: value }));
  };

  const handleTimeCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked;

    setTimeUnknown(isChecked);

    if (isChecked) {
      setChartData((prev) => ({ ...prev, time: '' }));
    }
  };

  const handleWidgetSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const { name } = formData;
    const { country, city, day, month, year } = chartData;

    if (!name || !country || !city || !day || !month || !year) {
      setError(i18n('All necessary fields must be filled'));
      return;
    }

    onSubmit(e, true);
  };

  return (
    <form onSubmit={handleWidgetSubmit} className={styles.widgetForm}>
      <h3 className={styles.title}>{i18n('Natal chart')}</h3>

      <div className={styles.item}>
        <span className={styles.subtitle}>{i18n('Name')}*</span>

        <Input type={'text'} name={'name'} value={formData.name} disabled />
      </div>

      <div className={styles.item}>
        <span className={styles.subtitle}>{i18n('Country of birth')}*</span>

        <Select
          onChange={handleCountrySelectChange}
          options={translatedCountries}
          value={chartData.country}
          hasSearch
        />
      </div>

      <div className={styles.item}>
        <span className={styles.subtitle}>{i18n('City of birth')}*</span>

        <Input
          onChange={handleChartFieldChange}
          type={'text'}
          name={'city'}
          value={chartData.city}
        />
      </div>

      <div className={styles.item}>
        <span className={styles.subtitle}>{i18n('Birth date')}*</span>

        <div className={styles.date}>
          <Select
            options={MONTHS[locale]}
            onChange={handleMonthChange}
            value={chartData.month}
            placeholder={i18n('month')}
          />

          <Select
            options={getDaysInMonth(chartData.month, Number(chartData.year))}
            onChange={handleDayChange}
            value={chartData.day}
            placeholder={i18n('day')}
            emptyPhrase={i18n('choose month')}
          />

          <Select
            options={YEARS}
            onChange={handleYearChange}
            value={chartData.year}
            placeholder={i18n('year')}
            hasSearch
          />
        </div>
      </div>

      <div className={styles.item}>
        <span className={styles.subtitle}>{i18n('Birth time')}</span>

        <div className={styles['birth-item']}>
          <Input
            onChange={handleChartFieldChange}
            type={'time'}
            name={'time'}
            value={chartData.time}
            disabled={timeUnknown}
          />

          <div className={styles.birth}>
            <span className={styles.subtitle}>
              {i18n("I don't remember")}
            </span>

            <Input
              type={'checkbox'}
              checked={timeUnknown}
              onChange={handleTimeCheckboxClick}
            />
          </div>
        </div>
      </div>

      <div className={styles.widgetActions}>
        <Button type={'button'} className={styles.button} onClick={onClose}>
          {i18n('Cancel')}
        </Button>

        <Button
          type={'submit'}
          className={styles.button}
          iconRight={<Price cost={10} />}
        >
          {i18n('Create')}
        </Button>
      </div>

      {errorText && <span className={styles.error}>{errorText}</span>}
    </form>
  );
};

export const Registry = () => {
  const { i18n, locale, addTranslations } = useLocales();

  const [isAgreed, setIsAgreed] = useState(false);

  const [formData, setFormData] = useState<BasicFormData>({
    name: '',
    month: '',
    year: '',
    day: '',
  });

  const [showUserAgreement, setShowUserAgreement] = useState(false);
  const [showNatalChartWidget, setShowNatalChartWidget] = useState(false);

  const { createUser, isLoading, user, error: creationError } = useCreateUser();

  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');

    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  const handleCloseNatalChartWidget = () => {
    setShowNatalChartWidget(false);
  };

  const handleCreateNatalChartClick = () => {
    setShowNatalChartWidget(true);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    withNatalChart: boolean,
  ) => {
    e.preventDefault();

    setError('');

    const { name, day, month, year } = formData;

    if (!name || !day || !month || !year) {
      setError(i18n('All necessary fields must be filled'));

      return;
    }

    if (withNatalChart) {
      setShowNatalChartWidget(false);
    }

    await createUser({ ...formData, withNatalChart });
  };

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <span>{i18n('Creating account')}...</span>

        <Spinner size={'l'} />
      </div>
    );
  }

  if (creationError) {
    return (
      <Error
        error={i18n('Error during request, please try again')}
        onRetryButtonClick={() =>
          createUser({ ...formData, withNatalChart: false })
        }
      />
    );
  }

  return (
    <>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={(e) => handleSubmit(e, false)}>
          <h3 className={styles.title}>{i18n('Registration')}</h3>

          <div className={styles.item}>
            <span className={styles.subtitle}>{i18n('Name')}*</span>

            <Input
              onChange={handleChange}
              type={'text'}
              name={'name'}
              value={formData.name}
            />
          </div>

          <div className={styles.item}>
            <span className={styles.subtitle}>{i18n('Birth date')}*</span>

            <div className={styles.date}>
              <Select
                options={MONTHS[locale]}
                onChange={handleMonthChange}
                value={formData.month}
                placeholder={i18n('month')}
              />

              <Select
                options={getDaysInMonth(formData.month, Number(formData.year))}
                onChange={handleDayChange}
                value={formData.day}
                placeholder={i18n('day')}
                emptyPhrase={i18n('choose month')}
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

          <div className={styles.terms}>
            <span className={styles.subtitle}>
              {i18n('I agree with the')}{' '}
              <a onClick={handleUserAgreementClick} className={styles.link}>
                {i18n('privacy policy')}
              </a>
            </span>

            <Input
              onChange={handleTermsRead}
              type={'checkbox'}
              checked={isAgreed}
            />
          </div>

          <div className={styles.actions}>
            <Button
              disabled={!isAgreed}
              className={styles.button}
              type={'submit'}
            >
              {i18n('Submit')}
            </Button>

            <Button
              disabled={!isAgreed}
              className={styles.button}
              type={'button'}
              onClick={handleCreateNatalChartClick}
              iconRight={<Price cost={10} />}
            >
              {i18n('Create natal chart')}
            </Button>
          </div>

          {error && <span className={styles.error}>{error}</span>}
        </form>
      </div>

      <Modal
        isOpen={showNatalChartWidget}
        onClose={handleCloseNatalChartWidget}
        className={styles.modal}
        contentClassName={styles.modalContent}
      >
        <NatalChartWidgetForm
          formData={formData}
          setError={setError}
          errorText={error}
          onClose={handleCloseNatalChartWidget}
          onSubmit={handleSubmit}
          i18n={i18n}
          locale={locale}
        />
      </Modal>

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
