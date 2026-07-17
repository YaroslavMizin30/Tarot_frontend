import { useMemo } from 'react';

import {
  createMoonCalendarIndex,
  getZodiacTranslationKey,
  Moon,
  parseIsoDate,
  todayIsoString,
} from '@/entities/Horoscope';
import Zodiac from '@/shared/ui/Zodiac';

import { WEEKDAYS_BY_LOCALE } from '../config/constants';
import { buildMonthCells } from '../lib/calendar';

import type { MoonCalendarProps } from './MoonCalendar.props';

import styles from './MoonCalendar.module.css';

const DATE_LOCALES = {
  en: 'en-US',
  ru: 'ru-RU',
} as const;

export const MoonCalendar = (props: MoonCalendarProps) => {
  const {
    items,
    locale,
    selectedDate,
    onDaySelect,
    className = '',
  } = props;

  const itemIndex = useMemo(() => createMoonCalendarIndex(items), [items]);

  const monthAnchor = useMemo(() => {
    return (
      parseIsoDate(selectedDate) ??
      parseIsoDate(items[0]?.date) ??
      new Date()
    );
  }, [items, selectedDate]);

  const cells = useMemo(
    () => buildMonthCells(monthAnchor, itemIndex),
    [itemIndex, monthAnchor],
  );

  const monthTitle = useMemo(() => {
    return new Intl.DateTimeFormat(DATE_LOCALES[locale], {
      month: 'long',
      year: 'numeric',
    }).format(monthAnchor);
  }, [locale, monthAnchor]);

  const dateFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(DATE_LOCALES[locale], {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [locale]);

  const today = todayIsoString();

  return (
    <section className={`${styles.widget} ${className}`}>
      <h2 className={styles.title}>{monthTitle}</h2>

      <div className={styles.grid}>
        {WEEKDAYS_BY_LOCALE[locale].map((weekday) => (
          <div key={weekday} className={styles.weekday}>
            {weekday}
          </div>
        ))}

        {cells.map((cell) => {
          if (cell.type === 'placeholder') {
            return (
              <div
                key={cell.key}
                className={styles.placeholder}
                aria-hidden={'true'}
              />
            );
          }

          const { item } = cell;
          const isSelected = cell.date === selectedDate;
          const isToday = cell.date === today;
          const cellClassName = [
            styles.cell,
            isSelected ? styles.cellSelected : '',
            isToday ? styles.cellToday : '',
          ]
            .filter(Boolean)
            .join(' ');

          const parsedDate = parseIsoDate(cell.date);
          const accessibleDate = parsedDate
            ? dateFormatter.format(parsedDate)
            : cell.date;
          const phaseName = item?.data.phase.name;
          const zodiac = item?.data.zodiac.sign;

          return (
            <button
              key={cell.key}
              type={'button'}
              className={cellClassName}
              disabled={!item}
              onClick={() => item && onDaySelect(item)}
              aria-label={
                phaseName
                  ? `${accessibleDate}: ${phaseName}${
                    zodiac ? `, ${getZodiacTranslationKey(zodiac)}` : ''
                  }`
                  : accessibleDate
              }
              aria-current={isToday ? 'date' : undefined}
              aria-pressed={isSelected}
            >
              {phaseName ? (
                <div className={styles.moonWithZodiac} aria-hidden={'true'}>
                  <Moon phase={phaseName} size={'s'} />

                  {zodiac ? (
                    <Zodiac
                      sign={getZodiacTranslationKey(zodiac)}
                      type={'small'}
                      className={styles.zodiac}
                    />
                  ) : null}
                </div>
              ) : (
                <span className={styles.moonPlaceholder} aria-hidden={'true'} />
              )}

              <span className={styles.dayLabel}>{cell.dayOfMonth}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MoonCalendar;
