import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react';

import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import Button from '@/shared/ui/Button';
import Spinner from '@/shared/ui/Spinner';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/natalchart';
import TRANSLATIONS_RU from '@/shared/locales/ru/natalchart';
import { compareObjects } from '@/shared/utils/compareObjects';

import Circle from '@/features/Circle';

import { COUNTRIES } from '@/pages/Registry/config/countries';
import { YEARS, MONTHS, getDaysInMonth } from '@/pages/Registry/config/date';
import { useUpdateNatalChart } from '../model/useNatalChart/useNatalChart';

import Accordion from './Accordion/Accordion';

import type { NatalChartProps } from './NatalChart.props';

import styles from './NatalChart.module.css';
import { getBodies } from '../lib/bodies';
export interface NatalChartEditValues {
  name: string;
  country: string;
  city: string;
  day: string;
  month: string;
  year: string;
  hour?: string;
  minute?: string;
  timeKnown: boolean;
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

const parseBirthTime = (time?: string) => {
  if (!time) {
    return {};
  }

  const [hour, minute] = time.split(':');

  return { hour, minute };
};

export const NatalChart = (props: NatalChartProps) => {
  const { user, className = '' } = props;

  const { i18n, addTranslations, locale } = useLocales();

  const { updateNatalChart, isLoading: isUpdating } = useUpdateNatalChart();

  const [isEditing, setIsEditing] = useState(false);

  const initialValues = (() => {
    const { day, month, year } = parseBirthDate(user.birthDate);
    const { country, city } = parseBirthPlace(user.birthPlace);
    const { hour, minute } = parseBirthTime(user?.birthTime);

    return {
      name: user.userName,
      country,
      city,
      day,
      month,
      year,
      hour,
      minute,
      timeKnown: true,
    };
  })();

  const [editValues, setEditValues] =
    useState<NatalChartEditValues>(initialValues);

  const { isEqual } = compareObjects(initialValues, editValues);

  const [error, setError] = useState('');

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  const translatedCountries = useMemo(() => {
    return COUNTRIES.map(({ value, label }) => {
      return { value, label: i18n(label) };
    });
  }, [locale, i18n]);

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

  const handleTimeChange = (value: string) => {
    const [minute, hour] = value.split(':');

    setEditValues((prev) => ({ ...prev, minute, hour }));
  };

  const handleChangeButtonClick = () => {
    setIsEditing(true);
  };

  const handleTimeCheckboxClick = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;

    if (isChecked) {
      handleFieldChange('timeKnown', false);
      handleFieldChange('hour', '');
      handleFieldChange('minute', '');
    } else {
      handleFieldChange('timeKnown', true);
    }
  };

  const handleSave = async (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { name, country, city, day, month, year, minute, hour, timeKnown } =
      editValues;

    if (!name || !country || !city || !day || !month || !year) {
      setError(i18n('All necessary fields must be filled'));

      return;
    }

    setError('');

    const locales: Record<typeof locale, 'en-EN' | 'ru-RU'> = {
      ru: 'ru-RU',
      en: 'en-EN',
    };

    await updateNatalChart({
      userId: String(user.id),
      name,
      country,
      city,
      day,
      month,
      year,
      hour,
      minute,
      timeKnown,
      lang: locales[locale],
    });
  };

  if (isUpdating) {
    return (
      <div className={styles.loader}>
        <span>{i18n('Updating your natal chart')}...</span>

        <Spinner size={'l'} />
      </div>
    );
  }

  if (!user.natalChart || isEditing)
    return (
      <div
        className={`${styles.edit} ${isEditing ? styles.chartEdit : ''} ${className}`}
      >
        <form>
          <h3 className={styles.title}>
            {isEditing ? i18n('Edit chart') : i18n('Compose chart')}
          </h3>

          <div className={styles.formItem}>
            <span className={styles.subtitle}>{i18n('Name')}</span>

            <Input
              type={'text'}
              name={'name'}
              value={editValues.name}
              onChange={(e) => handleFieldChange('name', e.currentTarget.value)}
            />
          </div>

          <div className={styles.formItem}>
            <span className={styles.subtitle}>{i18n('Country of birth')}</span>

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
              onChange={(e) => handleFieldChange('city', e.currentTarget.value)}
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
                value={`${editValues.hour}:${editValues.minute}`}
                onChange={(e) => handleTimeChange(e.currentTarget.value)}
              />

              <div className={styles.birth}>
                <span className={styles.subtitle}>
                  {i18n("I don't remember")}
                </span>

                <Input
                  type={'checkbox'}
                  checked={!editValues.timeKnown}
                  onChange={handleTimeCheckboxClick}
                  style={{ marginLeft: '5px' }}
                />
              </div>
            </div>
          </div>

          <div className={styles.action}>
            {isEditing ? (
              <>
                <Button
                  type={'submit'}
                  className={styles.actionButton}
                  onClick={handleSave}
                  disabled={isEqual}
                >
                  {i18n('Edit')}
                </Button>
                <Button
                  className={styles.actionButton}
                  onClick={handleCancel}
                  style={{ marginLeft: '10px' }}
                >
                  {i18n('Cancel')}
                </Button>
              </>
            ) : (
              <Button
                type={'submit'}
                className={styles.actionButton}
                onClick={handleSave}
              >
                {i18n('Compose')}
              </Button>
            )}
          </div>

          {error && i18n(error)}
        </form>
      </div>
    );

  const { planets, interpretation, houses } = user.natalChart;

  const bodies = getBodies(planets);

  return (
    <div className={styles.chart}>
      <h3 className={styles.name}>{user.userName}</h3>

      <Circle bodies={bodies} firstHouseSignDegree={houses[0].abs_pos} />

      <Accordion sections={interpretation.sections} />

      <Button onClick={handleChangeButtonClick}>{i18n('Change')}</Button>
    </div>
  );
};
