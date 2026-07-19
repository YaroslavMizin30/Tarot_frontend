import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import {
  getPersonalTransitHistory,
  getPersonalTransitPreview,
  getPersonalTransitReport,
  purchasePersonalTransitReport,
  quotePersonalTransitReport,
  savePersonalTransitReflection,
} from '@/entities/Horoscope';
import type {
  PersonalTransitReport,
  PersonalTransitSummary,
  TransitHistoryItem,
} from '@/entities/Horoscope';
import { useUser } from '@/entities/User';
import useLocales from '@/shared/hooks/useLocales';
import TRANSITS_TRANSLATIONS_EN from '@/shared/locales/en/transits';
import NATAL_TRANSLATIONS_EN from '@/shared/locales/en/natalchart';
import TRANSITS_TRANSLATIONS_RU from '@/shared/locales/ru/transits';
import NATAL_TRANSLATIONS_RU from '@/shared/locales/ru/natalchart';
import Button from '@/shared/ui/Button';
import { PersonalTransits } from '@/widgets/NatalChart';

import styles from './TransitsPage.module.css';

type TransitsView = 'today' | 'history';
type PendingAction = 'quote' | 'purchase' | 'reflection' | 'history-report' | null;

const todayKey = () => {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((part, index) => index ? String(part).padStart(2, '0') : String(part))
    .join('-');
};

const LoadingLabel = ({ children }: { children: string }) => (
  <span className={styles.loadingLabel}>
    <i aria-hidden={'true'} />
    {children}
  </span>
);

const SectionSkeleton = ({ history = false }: { history?: boolean }) => (
  <section
    className={`${styles.skeleton} ${history ? styles.historySkeleton : ''}`}
    aria-busy={'true'}
    aria-label={'Loading'}
  >
    <span className={styles.skeletonTitle} />
    <span className={styles.skeletonText} />
    <div className={styles.skeletonGrid}>
      {Array.from({ length: history ? 3 : 5 }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  </section>
);

export const TransitsPage = () => {
  const navigate = useNavigate();
  const { user, refetchUser } = useUser() ?? {};
  const { i18n, addTranslations, locale } = useLocales();
  const [view, setView] = useState<TransitsView>('today');
  const [summary, setSummary] = useState<PersonalTransitSummary | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewReload, setPreviewReload] = useState(0);
  const [quotedReport, setQuotedReport] = useState<PersonalTransitReport | null>(null);
  const [activeReport, setActiveReport] = useState<PersonalTransitReport | null>(null);
  const [history, setHistory] = useState<TransitHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyReload, setHistoryReload] = useState(0);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isTodayRefunded, setIsTodayRefunded] = useState(false);
  const [isPollingPaused, setIsPollingPaused] = useState(false);
  const [reflection, setReflection] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const pendingReportId = quotedReport?.id;
  const pendingReportStatus = quotedReport?.status;
  const pollingState = useRef({ reportId: '', checks: 0 });

  useEffect(() => {
    addTranslations({
      en: { ...NATAL_TRANSLATIONS_EN, ...TRANSITS_TRANSLATIONS_EN },
      ru: { ...NATAL_TRANSLATIONS_RU, ...TRANSITS_TRANSLATIONS_RU },
    });
  }, [addTranslations, locale]);

  useEffect(() => {
    if (!user?.natalChart) {
      setIsPreviewLoading(false);
      return;
    }
    let current = true;
    setIsPreviewLoading(true);
    setPreviewError(null);
    getPersonalTransitPreview(
      todayKey(),
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    )
      .then(({ facts, currentReport }) => {
        if (!current) return;
        setSummary(facts);
        const completedReport = currentReport?.status === 'completed' ? currentReport : null;
        const pendingReport = currentReport
          && ['charged', 'processing', 'failed'].includes(currentReport.status)
          ? currentReport
          : null;
        setActiveReport(completedReport);
        setQuotedReport(pendingReport);
        setIsTodayRefunded(currentReport?.status === 'refunded');
        if (currentReport?.status === 'refunded') {
          setActionError('The reading could not be prepared and the pentacles were returned');
        }
        const savedReflection = currentReport
          ?.personal_transit_reflections?.[0]?.content ?? '';
        setReflection(savedReflection);
        setReflectionSaved(Boolean(savedReflection));
      })
      .catch((reason: unknown) => current && setPreviewError(
        reason instanceof Error ? reason.message : String(reason),
      ))
      .finally(() => current && setIsPreviewLoading(false));
    return () => {
      current = false;
    };
  }, [previewReload, user?.natalChart]);

  useEffect(() => {
    if (isPollingPaused || !pendingReportId || !pendingReportStatus
      || !['charged', 'processing'].includes(pendingReportStatus)) return;

    if (pollingState.current.reportId !== pendingReportId) {
      pollingState.current = { reportId: pendingReportId, checks: 0 };
    }

    let current = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const checkReport = async () => {
      pollingState.current.checks += 1;
      if (pollingState.current.checks > 120) {
        setIsPollingPaused(true);
        setActionError('The reading is taking longer than usual. You can check its status again');
        return;
      }
      try {
        const { report } = await getPersonalTransitReport(pendingReportId);
        if (!current) return;

        if (report.status === 'completed') {
          setActiveReport(report);
          setQuotedReport(null);
          setActionError(null);
          return;
        }

        if (report.status === 'failed' || report.status === 'refunded') {
          setQuotedReport(report.status === 'failed' ? report : null);
          setIsTodayRefunded(report.status === 'refunded');
          setActionError(report.status === 'refunded'
            ? 'The reading could not be prepared and the pentacles were returned'
            : 'The reading could not be prepared. Please try again');
          refetchUser?.().catch(() => undefined);
          return;
        }

        setQuotedReport(report);
        timer = setTimeout(checkReport, 2500);
      } catch {
        if (current) timer = setTimeout(checkReport, 4000);
      }
    };

    timer = setTimeout(checkReport, 1500);

    return () => {
      current = false;
      if (timer) clearTimeout(timer);
    };
  }, [isPollingPaused, pendingReportId, pendingReportStatus, refetchUser]);

  useEffect(() => {
    if (view !== 'history') return;
    let current = true;
    setIsHistoryLoading(true);
    setHistoryError(null);
    getPersonalTransitHistory()
      .then(({ reports }) => current && setHistory(reports))
      .catch((reason: unknown) => current && setHistoryError(
        reason instanceof Error ? reason.message : String(reason),
      ))
      .finally(() => current && setIsHistoryLoading(false));
    return () => {
      current = false;
    };
  }, [historyReload, view]);

  const handleQuote = async () => {
    setPendingAction('quote');
    setActionError(null);
    try {
      const { report } = await quotePersonalTransitReport(
        locale,
        todayKey(),
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      );
      if (report.status === 'completed') setActiveReport(report);
      else setQuotedReport(report);
    } catch {
      setActionError('Could not check the reading price. Please try again');
    } finally {
      setPendingAction(null);
    }
  };

  const handleReflection = async () => {
    if (!activeReport || !reflection.trim()) return;
    setPendingAction('reflection');
    setActionError(null);
    try {
      await savePersonalTransitReflection(activeReport.id, reflection);
      setReflectionSaved(true);
    } catch {
      setActionError('Could not save your reflection. Please try again');
    } finally {
      setPendingAction(null);
    }
  };

  const handlePurchase = async () => {
    if (!quotedReport) return;
    setPendingAction('purchase');
    setActionError(null);
    try {
      const result = await purchasePersonalTransitReport(quotedReport.id);
      if (result.status === 'insufficient_balance') {
        setActionError('Not enough balance for this reading');
      } else if (result.status === 'completed') {
        setActiveReport(result.report);
        setQuotedReport(null);
        setIsTodayRefunded(false);
        refetchUser?.().catch(() => undefined);
      } else if (result.status === 'failed' || result.status === 'refunded') {
        setQuotedReport(result.status === 'failed' ? result.report : null);
        setIsTodayRefunded(result.status === 'refunded');
        setActionError(result.status === 'refunded'
          ? 'The reading could not be prepared and the pentacles were returned'
          : 'The reading could not be prepared. Please try again');
        refetchUser?.().catch(() => undefined);
      } else {
        setQuotedReport(result.report);
        setIsPollingPaused(false);
        refetchUser?.().catch(() => undefined);
      }
    } catch {
      setActionError('Could not start the reading. Your balance was not charged');
    } finally {
      setPendingAction(null);
    }
  };

  const openHistoryReport = async (reportId: string) => {
    setPendingAction('history-report');
    setHistoryError(null);
    try {
      const { report } = await getPersonalTransitReport(reportId);
      setActiveReport(report);
      const savedReflection = report.personal_transit_reflections?.[0]?.content ?? '';
      setReflection(savedReflection);
      setReflectionSaved(Boolean(savedReflection));
      setView('today');
    } catch {
      setHistoryError(i18n('Could not open this reading. Please try again'));
    } finally {
      setPendingAction(null);
    }
  };

  const reading = activeReport?.content ? (
    <section className={styles.reading}>
      <span className={styles.sectionLabel}>{i18n('Personal reading')}</span>
      <h3>{activeReport.content.title}</h3>
      <p className={styles.summary}>{activeReport.content.summary}</p>
      <div className={styles.readingGrid}>
        <article>
          <strong>{i18n('Main influence')}</strong>
          <p>{activeReport.content.main_influence.text}</p>
        </article>
        <article>
          <strong>{i18n('Supportive factor')}</strong>
          <p>{activeReport.content.supportive_factor.text}</p>
        </article>
        <article>
          <strong>{i18n('Point of tension')}</strong>
          <p>{activeReport.content.tension.text}</p>
        </article>
      </div>
      <div className={styles.practicalStep}>
        <strong>{i18n('Practical step')}</strong>
        <p>{activeReport.content.practical_step}</p>
      </div>
      <blockquote>{activeReport.content.reflection_question}</blockquote>
      <div className={styles.reflection}>
        <label htmlFor={'transit-reflection'}>{i18n('Your reflection')}</label>
        <textarea
          id={'transit-reflection'}
          value={reflection}
          maxLength={4000}
          placeholder={i18n('Write down what resonates or what you want to revisit later')}
          onChange={(event) => {
            setReflection(event.target.value);
            setReflectionSaved(false);
          }}
        />
        <Button
          disabled={pendingAction !== null || !reflection.trim()}
          onClick={handleReflection}
        >
          {pendingAction === 'reflection'
            ? <LoadingLabel>{i18n('Saving')}</LoadingLabel>
            : reflectionSaved ? i18n('Saved') : i18n('Save reflection')}
        </Button>
      </div>
    </section>
  ) : null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type={'button'} className={styles.back} onClick={() => navigate('/astrology')}>
          <span aria-hidden={'true'}>←</span>
          {i18n('Back')}
        </button>

        <div className={styles.title}>
          <span>{i18n('Personal astrology')}</span>
          <h2>{i18n('Personal transits')}</h2>
          <p>{i18n('See how the current sky activates your natal chart')}</p>
        </div>

        <div className={styles.tabs} role={'tablist'} aria-label={i18n('Personal transits')}>
          <button
            type={'button'}
            role={'tab'}
            aria-selected={view === 'today'}
            className={view === 'today' ? styles.activeTab : ''}
            onClick={() => setView('today')}
          >
            {i18n('Today')}
          </button>
          <button
            type={'button'}
            role={'tab'}
            aria-selected={view === 'history'}
            className={view === 'history' ? styles.activeTab : ''}
            onClick={() => setView('history')}
          >
            {i18n('History')}
          </button>
        </div>
      </header>

      <main className={`${styles.content} custom-scrollbar`}>
        {!user?.natalChart ? (
          <section className={styles.emptyState}>
            <span className={styles.emptyIcon} aria-hidden={'true'}>✦</span>
            <h3>{i18n('A natal chart is needed for personal transits')}</h3>
            <p>{i18n('Create your chart to compare your placements with the current sky')}</p>
            <Button onClick={() => navigate('/natal-chart')}>
              {i18n('Create natal chart')}
            </Button>
          </section>
        ) : view === 'today' ? (
          isPreviewLoading ? <SectionSkeleton /> : previewError && !summary ? (
            <section className={styles.emptyState}>
              <span className={styles.emptyIcon} aria-hidden={'true'}>◌</span>
              <h3>{i18n('Could not load personal transits')}</h3>
              <p>{i18n('The calculation is temporarily unavailable. Your data is safe')}</p>
              <Button onClick={() => setPreviewReload((value) => value + 1)}>
                {i18n('Try again')}
              </Button>
            </section>
          ) : (
            <>
              {reading}

              <PersonalTransits
                summary={summary}
                onSelectTransit={(transit) => navigate('/natal-chart', {
                  state: { selectedTransit: transit, returnTo: '/transits' },
                })}
              />

              {!activeReport && !isTodayRefunded && (quotedReport ? (
                <section className={styles.purchasePanel}>
                  <div>
                    <span className={styles.sectionLabel}>{i18n('Detailed personal reading')}</span>
                    <h3>{i18n('Unlock the meaning behind today’s connections')}</h3>
                    <p>{i18n('The report connects the strongest transits into one practical reading and remains in your history')}</p>
                  </div>
                  <div className={styles.purchaseActions}>
                    {['charged', 'processing'].includes(quotedReport.status) ? (
                      isPollingPaused ? (
                        <Button
                          onClick={() => {
                            pollingState.current.checks = 0;
                            setActionError(null);
                            setIsPollingPaused(false);
                          }}
                        >
                          {i18n('Check reading status')}
                        </Button>
                      ) : <LoadingLabel>{i18n('Preparing reading')}</LoadingLabel>
                    ) : (
                      <>
                        <span>{quotedReport.quoted_cost} {i18n('pentacles')}</span>
                        <Button disabled={pendingAction !== null} onClick={handlePurchase}>
                          {pendingAction === 'purchase'
                            ? <LoadingLabel>{i18n('Preparing reading')}</LoadingLabel>
                            : i18n('Confirm and create reading')}
                        </Button>
                        <button type={'button'} onClick={() => setQuotedReport(null)}>
                          {i18n('Cancel')}
                        </button>
                      </>
                    )}
                  </div>
                </section>
              ) : summary?.highlights.length ? (
                <section className={styles.unlock}>
                  <div>
                    <strong>{i18n('Want to understand the whole picture?')}</strong>
                    <p>{i18n('Open a personal interpretation based only on the calculated connections above')}</p>
                  </div>
                  <Button disabled={pendingAction !== null} onClick={handleQuote}>
                    {pendingAction === 'quote'
                      ? <LoadingLabel>{i18n('Checking price')}</LoadingLabel>
                      : i18n('Get personal reading')}
                  </Button>
                </section>
              ) : null)}

              {actionError ? <p className={styles.error}>{i18n(actionError)}</p> : null}
            </>
          )
        ) : isHistoryLoading ? <SectionSkeleton history /> : historyError ? (
          <section className={styles.emptyState}>
            <span className={styles.emptyIcon} aria-hidden={'true'}>◌</span>
            <h3>{i18n('Could not load transit history')}</h3>
            <p>{i18n('Please return to the section and try again')}</p>
            <Button onClick={() => setHistoryReload((value) => value + 1)}>
              {i18n('Try again')}
            </Button>
          </section>
        ) : history.length ? (
          <section className={styles.historyList}>
            {history.map((report) => (
              <button
                type={'button'}
                key={report.id}
                disabled={pendingAction !== null}
                onClick={() => openHistoryReport(report.id)}
              >
                <time>
                  {new Intl.DateTimeFormat(locale, {
                    day: 'numeric', month: 'long', year: 'numeric',
                  }).format(new Date(`${report.target_date}T12:00:00`))}
                </time>
                <strong>{report.content.title}</strong>
                <span>{report.content.summary}</span>
              </button>
            ))}
            {pendingAction === 'history-report' ? (
              <div className={styles.historyLoadingOverlay}>
                <LoadingLabel>{i18n('Opening reading')}</LoadingLabel>
              </div>
            ) : null}
          </section>
        ) : (
          <section className={styles.emptyState}>
            <span className={styles.emptyIcon} aria-hidden={'true'}>◷</span>
            <h3>{i18n('Your transit history will appear here')}</h3>
            <p>{i18n('Purchased readings and your reflections will remain available by date')}</p>
            <Button onClick={() => setView('today')}>{i18n('Return to today')}</Button>
          </section>
        )}
      </main>
    </div>
  );
};

export default TransitsPage;
