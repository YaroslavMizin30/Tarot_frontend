import { useEffect, useMemo, useState } from 'react';

import { useUser } from '@/entities/User';

import TextContainer from '@/shared/ui/TextContainer';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import Button from '@/shared/ui/Button';
import Spinner from '@/shared/ui/Spinner';

import useLocales from '@/shared/hooks/useLocales';
import { useViewportHeight } from '@/shared/hooks/useViewportHeight';
import TRANSLATIONS_EN from '@/shared/locales/en/natalchart';
import TRANSLATIONS_RU from '@/shared/locales/ru/natalchart';

import { COUNTRIES } from '@/pages/Registry/config/countries';
import { YEARS, MONTHS, getDaysInMonth } from '@/pages/Registry/config/date';
import { useUpdateNatalChart } from '../model/useUpdateNatalChart/useUpdateNatalChart';

import type { NatalChartProps } from './NatalChart.props';

import styles from './NatalChart.module.css';

export interface NatalChartEditValues {
  name: string;
  country: string;
  city: string;
  day: string;
  month: string;
  year: string;
  time: string;
}

const parseBirthDate = (
  birthDate: string,
): { day: string; month: string; year: string } => {
  const parts = birthDate.split('.');

  return {
    day: parts[0] ?? '',
    month: parts[1] ?? '',
    year: parts[2] ?? '',
  };
};

const parseBirthPlace = (
  birthPlace: string,
): { country: string; city: string } => {
  const [country, ...rest] = birthPlace.split(',');

  return {
    country: country?.trim() ?? '',
    city: rest.join(',').trim(),
  };
};

export const NatalChart = (props: NatalChartProps) => {
  const { user, className = '', onUpdated } = props;

  const { i18n, addTranslations, locale } = useLocales();

  const { refetchUser } = useUser();

  const { updateNatalChart, isLoading: isUpdating } = useUpdateNatalChart();

  const [isEditing, setIsEditing] = useState(false);

  const [editValues, setEditValues] = useState<NatalChartEditValues>(() => {
    const { day, month, year } = parseBirthDate(user.birthDate);
    const { country, city } = parseBirthPlace(user.birthPlace);

    return {
      name: user.userName,
      country,
      city,
      day,
      month,
      year,
      time: user.birthTime ?? '',
    };
  });

  const [error, setError] = useState('');

  const viewportHeight = useViewportHeight();

  /**
   * Adapt the chart description height to the current viewport so the
   * action button always stays visible. On very short screens the
   * description collapses to a small 60px preview.
   */
  const descriptionMaxHeight = useMemo(() => {
    const vh = viewportHeight ?? 0;

    if (vh <= 0) return 350;

    if (vh < 420) return 60;

    if (vh < 500) return 100;

    if (vh < 560) return 160;

    return isEditing ? 250 : 350;
  }, [viewportHeight, isEditing]);

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  const translatedCountries = useMemo(() => {
    return COUNTRIES.map(({ value, label }) => {
      return { value, label: i18n(label) };
    });
  }, [locale, i18n]);

  const handleEdit = () => {
    const { day, month, year } = parseBirthDate(user.birthDate);
    const { country, city } = parseBirthPlace(user.birthPlace);

    setEditValues({
      name: user.userName,
      country,
      city,
      day,
      month,
      year,
      time: user.birthTime ?? '',
    });

    setError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const handleFieldChange = <K extends keyof NatalChartEditValues>(
    field: K,
    value: NatalChartEditValues[K],
  ) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleTimeCheckboxClick = () => {
    handleFieldChange('time', '');
  };

  const handleSave = async () => {
    const { name, country, city, day, month, year, time } = editValues;

    if (!name || !country || !city || !day || !month || !year) {
      setError(i18n('All necessary fields must be filled'));

      return;
    }

    setError('');

    const success = await updateNatalChart({
      userId: String(user.id),
      name,
      country,
      city,
      day,
      month,
      year,
      time,
    });

    if (success) {
      await refetchUser();
      setIsEditing(false);
      onUpdated?.();
    }
  };

  if (isUpdating) {
    return (
      <div className={styles.loader}>
        <span>{i18n('Updating your natal chart')}...</span>

        <Spinner size={'l'} />
      </div>
    );
  }

  return (
    <div
      className={`${styles.chart} ${isEditing ? styles.chartEdit : ''} ${className}`}
    >
      <header className={styles.header}>
        <h2 className={styles.title}>{i18n('Natal chart')}</h2>

        <h3 className={styles.title}>{user.userName}</h3>
      </header>

      <section
        className={`${styles.section} ${isEditing ? styles.infoEdit : styles.info}`}
      >
        {isEditing ? (
          <>
            <div className={styles.formItem}>
              <span className={styles.subtitle}>{i18n('Name')}</span>

              <Input
                type={'text'}
                name={'name'}
                value={editValues.name}
                onChange={(e) =>
                  handleFieldChange('name', e.currentTarget.value)
                }
              />
            </div>

            <div className={styles.formItem}>
              <span className={styles.subtitle}>
                {i18n('Country of birth')}
              </span>

              <Select
                options={translatedCountries}
                value={editValues.country}
                onChange={(value) => handleFieldChange('country', value)}
                hasSearch
              />
            </div>

            <div className={styles.formItem}>
              <span className={styles.subtitle}>{i18n('City of birth')}</span>

              <Input
                type={'text'}
                name={'city'}
                value={editValues.city}
                onChange={(e) =>
                  handleFieldChange('city', e.currentTarget.value)
                }
              />
            </div>

            <div className={styles.formItem}>
              <span className={styles.subtitle}>{i18n('Birth date')}</span>

              <div className={styles.date}>
                <Select
                  options={MONTHS[locale]}
                  onChange={(value) => handleFieldChange('month', value)}
                  value={editValues.month}
                  placeholder={i18n('month')}
                />

                <Select
                  options={getDaysInMonth(
                    editValues.month,
                    Number(editValues.year),
                  )}
                  onChange={(value) => handleFieldChange('day', value)}
                  value={editValues.day}
                  placeholder={i18n('day')}
                  emptyPhrase={i18n('choose month')}
                />

                <Select
                  options={YEARS}
                  onChange={(value) => handleFieldChange('year', value)}
                  value={editValues.year}
                  placeholder={i18n('year')}
                  hasSearch
                />
              </div>
            </div>

            <div className={styles.formItem}>
              <span className={styles.subtitle}>{i18n('Birth time')}</span>

              <div className={styles.birthItem}>
                <Input
                  type={'time'}
                  name={'time'}
                  value={editValues.time}
                  onChange={(e) =>
                    handleFieldChange('time', e.currentTarget.value)
                  }
                />

                <div className={styles.birth}>
                  <span className={styles.subtitle}>
                    {i18n("I don't remember")}
                  </span>

                  <Input
                    type={'checkbox'}
                    checked={!editValues.time}
                    onChange={handleTimeCheckboxClick}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.item}>
              <label>{i18n('Birth date')}:</label>

              <span>{user.birthDate}</span>
            </div>

            {user.birthTime && (
              <div>
                <label>{i18n('Birth time')}:</label>

                <span>{user.birthTime}</span>
              </div>
            )}

            <div className={styles.item}>
              <label>{i18n('Birth place')}:</label>

              <span>{user.birthPlace}</span>
            </div>

            <div className={styles.item}>
              <label>{i18n('Zodiac sign')}:</label>

              <span>{user.sign}</span>
            </div>
          </>
        )}
      </section>

      <section
        className={`${styles.section} ${styles.chartContainer} ${isEditing ? styles.chartContainerEdit : ''}`}
      >
        {!isEditing && (
          <TextContainer
            title={i18n('Chart description')}
            paragraphs={user.natalChart.split(/\n/)}
            maxHeight={descriptionMaxHeight}
            maxHeightMeasure={'px'}
            className={styles.text}
          />
        )}

        <div className={styles.actions}>
          {isEditing ? (
            <>
              <Button
                className={styles.actionButton}
                onClick={handleCancel}
                disabled={isUpdating}
              >
                {i18n('Cancel')}
              </Button>

              <Button
                className={styles.actionButton}
                onClick={handleSave}
                disabled={isUpdating}
              >
                {i18n('Save')}
              </Button>
            </>
          ) : (
            <Button
              className={styles.actionButton}
              onClick={handleEdit}
              disabled={isUpdating}
            >
              {i18n('Edit')}
            </Button>
          )}
        </div>

        {error && <span className={styles.errorMessage}>{error}</span>}
      </section>
    </div>
  );
};
