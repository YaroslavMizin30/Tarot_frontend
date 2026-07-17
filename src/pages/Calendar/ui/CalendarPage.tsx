import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import {
  getMoonCalendarLocalization,
  getZodiacTranslationKey,
  Moon,
  parseIsoDate,
  todayIsoString,
  useCalendar,
} from '@/entities/Horoscope';
import TRANSLATIONS_EN from '@/shared/locales/en/calendar';
import TRANSLATIONS_RU from '@/shared/locales/ru/calendar';
import useLocales from '@/shared/hooks/useLocales';
import ArrowButton from '@/shared/ui/ArrowButton';
import Zodiac from '@/shared/ui/Zodiac';
import MoonCalendar from '@/widgets/MoonCalendar';

import styles from './CalendarPage.module.css';

const DATE_LOCALES = {
  en: 'en-US',
  ru: 'ru-RU',
} as const;

export const CalendarPage = () => {
  const { i18n, addTranslations, locale } = useLocales();
  const { items, itemIndex, isLoading, error } = useCalendar();
  const navigate = useNavigate();

  const [today] = useState(todayIsoString);
  const [selectedDate, setSelectedDate] = useState<string | null>(today);

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [addTranslations]);

  const selectedItem =
    (selectedDate ? itemIndex.get(selectedDate) : undefined) ??
    itemIndex.get(today) ??
    items.find((item) => item.date > today) ??
    items.at(-1) ??
    null;

  const effectiveSelectedDate = selectedItem?.date ?? null;
  const selectedDateValue = parseIsoDate(effectiveSelectedDate);
  const phase = selectedItem?.data.phase.name;
  const moonAge = selectedItem?.data.phase.ageDays;
  const moonDay =
    typeof moonAge === 'number' && Number.isFinite(moonAge)
      ? Math.min(30, Math.max(1, Math.floor(moonAge) + 1))
      : null;
  const zodiac = selectedItem?.data.zodiac.sign;
  const localization = selectedItem
    ? getMoonCalendarLocalization(selectedItem, locale)
    : null;

  return (
    <div className={styles.container}>
      <div className={styles.calendar}>
        {isLoading ? (
          <div className={styles.status} role={'status'}>
            {i18n('Loading moon calendar...')}
          </div>
        ) : error ? (
          <div className={styles.status} role={'alert'}>
            {i18n('Unable to load the moon calendar.')}
          </div>
        ) : selectedItem && phase ? (
          <>
            <section className={styles.summary}>
              <div className={styles.summaryHeader}>
                <Moon
                  phase={phase}
                  phaseAngleDeg={selectedItem.data.phase.phaseAngleDeg}
                  isWaxing={selectedItem.data.phase.isWaxing}
                  size={'l'}
                  className={styles.currentMoon}
                />

                <h1 className={styles.date}>
                  {selectedDateValue
                    ? selectedDateValue.toLocaleDateString(
                      DATE_LOCALES[locale],
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      },
                    )
                    : effectiveSelectedDate}
                </h1>

                <div className={styles.current}>
                  <span>{i18n(phase)}</span>

                  {zodiac ? (
                    <>
                      <span>
                        {`${i18n('is in sign')} ${i18n(
                          getZodiacTranslationKey(zodiac),
                        )}.`}
                      </span>

                      <div
                        className={styles.currentZodiac}
                        aria-hidden={'true'}
                      >
                        <Zodiac
                          sign={getZodiacTranslationKey(zodiac)}
                          type={'small'}
                        />
                      </div>
                    </>
                  ) : null}
                </div>

                {moonDay ? (
                  <div className={styles.moonDay}>
                    {`${i18n('Moon day')}: ${moonDay}`}
                  </div>
                ) : null}
              </div>

              {localization?.body ? (
                <p className={`${styles.interpretation} custom-scrollbar`}>
                  {localization.body}
                </p>
              ) : null}
            </section>

            <MoonCalendar
              items={items}
              locale={locale}
              selectedDate={effectiveSelectedDate}
              onDaySelect={(item) => setSelectedDate(item.date)}
              className={styles.calendarWidget}
            />
          </>
        ) : (
          <div className={styles.status} role={'status'}>
            {i18n('Moon calendar data is unavailable.')}
          </div>
        )}
      </div>

      <div className={styles.bottom}>
        <ArrowButton
          onClick={() => navigate('/astrology')}
          style={{ zIndex: 1 }}
        />
      </div>
    </div>
  );
};
