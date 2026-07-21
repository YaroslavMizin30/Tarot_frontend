import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

import { useMoonPlans } from '@/entities/MoonPlan';
import {
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
import Button from '@/shared/ui/Button';
import Zodiac from '@/shared/ui/Zodiac';
import MoonCalendar from '@/widgets/MoonCalendar';

import styles from './CalendarPage.module.css';

const DATE_LOCALES = {
  en: 'en-US',
  ru: 'ru-RU',
} as const;

const SPECIAL_MOON_LABELS = [
  ['isSupermoon', 'Supermoon'],
  ['isMicromoon', 'Micromoon'],
  ['isBlueMoon', 'Blue Moon'],
  ['isBlackMoon', 'Black Moon'],
  ['isHarvestMoon', 'Harvest Moon'],
  ['isHunterMoon', "Hunter's Moon"],
] as const;

export const CalendarPage = () => {
  const { i18n, addTranslations, locale } = useLocales();
  const { items, itemIndex, isLoading, error } = useCalendar();
  const navigate = useNavigate();

  const [today] = useState(todayIsoString);
  const [selectedDate, setSelectedDate] = useState<string | null>(today);
  const [planText, setPlanText] = useState('');
  const [notificationTime, setNotificationTime] = useState('08:00');

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
  const canCreatePlan = Boolean(
    effectiveSelectedDate && effectiveSelectedDate > today,
  );
  const {
    plans,
    isLoading: arePlansLoading,
    isSaving: isPlanSaving,
    deletingId,
    error: plansError,
    createPlan,
    deletePlan,
  } = useMoonPlans(canCreatePlan ? effectiveSelectedDate : null);
  const selectedDateValue = parseIsoDate(effectiveSelectedDate);
  const phase = selectedItem?.data.phase.name;
  const moonAge = selectedItem?.data.phase.ageDays;
  const moonDay =
    typeof moonAge === 'number' && Number.isFinite(moonAge)
      ? Math.min(30, Math.max(1, Math.floor(moonAge) + 1))
      : null;
  const zodiac = selectedItem?.data.zodiac.sign;
  const illumination = selectedItem
    ? Math.round(selectedItem.data.phase.illumination * 100)
    : null;
  const zodiacDegree = selectedItem?.data.zodiac.degree;
  const nextPhase = selectedItem
    ? (Object.entries(selectedItem.data.nextPhases) as Array<
      [keyof typeof selectedItem.data.nextPhases, string]
    >)
      .map(([name, date]) => ({ name, date, value: new Date(date) }))
      .filter(({ value }) => !Number.isNaN(value.getTime()))
      .sort((left, right) => left.value.getTime() - right.value.getTime())[0]
    : null;
  const specialMoonLabels = selectedItem?.data.specialMoon
    ? SPECIAL_MOON_LABELS.filter(
      ([key]) => selectedItem.data.specialMoon?.[key],
    ).map(([, label]) => label)
    : [];
  const eclipse = selectedItem?.data.eclipse?.isEclipse
    ? selectedItem.data.eclipse
    : null;

  const handlePlanSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const text = planText.trim();
    if (!effectiveSelectedDate || !canCreatePlan || !text) return;

    try {
      await createPlan({
        planDate: effectiveSelectedDate,
        text,
        locale,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        notificationTime,
      });
      setPlanText('');
    } catch {
      // Mutation state renders the localized error below the form.
    }
  };

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

              <div className={styles.facts}>
                <div className={styles.fact}>
                  <span>{i18n('Illumination')}</span>
                  <strong>{illumination !== null ? `${illumination}%` : '—'}</strong>
                </div>
                <div className={styles.fact}>
                  <span>{i18n('Moon age')}</span>
                  <strong>
                    {typeof moonAge === 'number'
                      ? `${moonAge.toLocaleString(DATE_LOCALES[locale], {
                        maximumFractionDigits: 1,
                      })} ${i18n('days')}`
                      : '—'}
                  </strong>
                </div>
                <div className={styles.fact}>
                  <span>{i18n('Position in sign')}</span>
                  <strong>
                    {zodiac && typeof zodiacDegree === 'number'
                      ? `${zodiacDegree.toLocaleString(DATE_LOCALES[locale], {
                        maximumFractionDigits: 1,
                      })}° ${i18n(getZodiacTranslationKey(zodiac))}`
                      : '—'}
                  </strong>
                </div>
              </div>

              {nextPhase ? (
                <div className={styles.nextEvent}>
                  <span>{i18n('Next phase')}</span>
                  <strong>{i18n(nextPhase.name)}</strong>
                  <time dateTime={nextPhase.date}>
                    {nextPhase.value.toLocaleDateString(DATE_LOCALES[locale], {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </time>
                </div>
              ) : null}

              {specialMoonLabels.length > 0 || eclipse ? (
                <div className={styles.events}>
                  {specialMoonLabels.map((label) => (
                    <span key={label}>{i18n(label)}</span>
                  ))}
                  {eclipse ? <span>{i18n('Lunar eclipse nearby')}</span> : null}
                </div>
              ) : null}
            </section>

            {canCreatePlan ? (
              <section className={styles.plans}>
                <div className={styles.plansHeader}>
                  <div>
                    <span>{i18n('Plans for this day')}</span>
                    <strong>{i18n('Telegram reminder')}</strong>
                  </div>
                  <span>{`${plans.length}/5`}</span>
                </div>

                {arePlansLoading ? (
                  <p className={styles.plansState}>{i18n('Loading plans...')}</p>
                ) : plans.length > 0 ? (
                  <ul className={styles.planList}>
                    {plans.map((plan) => (
                      <li key={plan.id}>
                        <span>{plan.text}</span>
                        <button
                          type={'button'}
                          aria-label={i18n('Delete plan')}
                          disabled={deletingId === plan.id}
                          onClick={() => {
                            deletePlan(plan.id).catch(() => undefined);
                          }}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {plans.length < 5 ? (
                  <form className={styles.planForm} onSubmit={handlePlanSubmit}>
                    <textarea
                      value={planText}
                      maxLength={500}
                      placeholder={i18n('What would you like to remember?')}
                      aria-label={i18n('Plan text')}
                      onChange={(event) => setPlanText(event.target.value)}
                    />
                    <div className={styles.planActions}>
                      <label>
                        <span>{i18n('Remind at')}</span>
                        <input
                          type={'time'}
                          value={notificationTime}
                          onChange={(event) => setNotificationTime(event.target.value)}
                        />
                      </label>
                      <Button
                        type={'submit'}
                        disabled={!planText.trim()}
                        isLoading={isPlanSaving}
                      >
                        {i18n('Add plan')}
                      </Button>
                    </div>
                  </form>
                ) : null}

                {plansError ? (
                  <p className={styles.planError} role={'alert'}>
                    {i18n('Unable to save plans. Try again later.')}
                  </p>
                ) : null}
              </section>
            ) : null}

            <MoonCalendar
              items={items}
              locale={locale}
              selectedDate={effectiveSelectedDate}
              onDaySelect={(item) => {
                setSelectedDate(item.date);
                setPlanText('');
              }}
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
