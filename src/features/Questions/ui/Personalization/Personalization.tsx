import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { useUser, type TarotProfile } from '@/entities/User';
import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/reading';
import TRANSLATIONS_RU from '@/shared/locales/ru/reading';
import Modal from '@/shared/ui/Modal';

import styles from './Personalization.module.css';

const REQUIRED_FIELDS = [
  'focus',
  'lifeStage',
  'readingPreference',
  'tone',
] as const;

type RequiredField = (typeof REQUIRED_FIELDS)[number];

interface PersonalizationProps {
  renderTrigger?: (options: {
    completed: number;
    open: () => void;
    progress: number;
    total: number;
  }) => ReactNode;
}

const STEPS: Array<{
  field: RequiredField | 'context';
  title: string;
  multiple?: boolean;
  options?: Array<{ label: string; value: string }>;
}> = [
  {
    field: 'focus',
    title: 'What is taking up most of your thoughts right now?',
    multiple: true,
    options: [
      { label: 'Relationships', value: 'relationships' },
      { label: 'Work and growth', value: 'career' },
      { label: 'Money', value: 'money' },
      { label: 'Inner state', value: 'wellbeing' },
      { label: 'Changes', value: 'change' },
      { label: 'Finding direction', value: 'direction' },
    ],
  },
  {
    field: 'lifeStage',
    title: 'Where do you feel you are now?',
    options: [
      { label: 'Starting something new', value: 'starting' },
      { label: 'Choosing a direction', value: 'choosing' },
      { label: 'Moving toward a goal', value: 'moving' },
      { label: 'Going through changes', value: 'changing' },
      { label: 'Recovering', value: 'recovering' },
      { label: 'Hard to define yet', value: 'uncertain' },
    ],
  },
  {
    field: 'readingPreference',
    title: 'What is most useful to hear in a reading?',
    options: [
      { label: 'A clear conclusion', value: 'conclusion' },
      { label: 'Possible scenarios', value: 'scenarios' },
      { label: 'Hidden reasons', value: 'causes' },
      { label: 'A practical next step', value: 'next_step' },
    ],
  },
  {
    field: 'tone',
    title: 'What tone feels right for you?',
    options: [
      { label: 'Gentle and supportive', value: 'supportive' },
      { label: 'Calm and neutral', value: 'neutral' },
      { label: 'Direct and specific', value: 'direct' },
    ],
  },
  {
    field: 'context',
    title: 'Is there any context worth keeping in mind?',
  },
];

const getCompletedFields = (profile: TarotProfile): RequiredField[] =>
  REQUIRED_FIELDS.filter((field) => {
    const value = profile[field];
    const hasValue = Array.isArray(value) ? value.length > 0 : Boolean(value);

    return hasValue || profile.completedSteps?.includes(field);
  });

export const Personalization = ({ renderTrigger }: PersonalizationProps = {}) => {
  const { i18n, addTranslations, locale } = useLocales();
  const { user, updateUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<TarotProfile>({ version: 1 });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    setProfile(user?.tarotProfile ?? { version: 1 });
  }, [user?.tarotProfile]);

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [addTranslations, locale]);

  const completedFields = useMemo(() => getCompletedFields(profile), [profile]);
  const progress = Math.round(
    (completedFields.length / REQUIRED_FIELDS.length) * 100,
  );
  const step = STEPS[stepIndex];

  const saveProfile = async (nextProfile: TarotProfile) => {
    if (!user) return;

    const value: TarotProfile = {
      ...nextProfile,
      version: 1,
      completedSteps: getCompletedFields(nextProfile),
      updatedAt: new Date().toISOString(),
    };

    setProfile(value);
    setIsSaving(true);
    setSaveError(false);

    try {
      await updateUser({ tarotProfile: value });
    } catch {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };

  const selectOption = (value: string) => {
    if (step.field === 'focus') {
      const current = profile.focus ?? [];
      const focus = current.includes(value as never)
        ? current.filter((item) => item !== value)
        : [...current, value].slice(-2);

      setProfile({ ...profile, focus: focus as TarotProfile['focus'] });
      return;
    }

    setProfile({ ...profile, [step.field]: value });
  };

  const isSelected = (value: string) => {
    const current = profile[step.field];
    return Array.isArray(current) ? current.includes(value as never) : current === value;
  };

  const canContinue =
    step.field === 'context' ||
    (Array.isArray(profile[step.field])
      ? (profile[step.field] as string[]).length > 0
      : Boolean(profile[step.field]));

  const continueFlow = async () => {
    if (!canContinue || isSaving) return;

    await saveProfile(profile);

    if (stepIndex === STEPS.length - 1) {
      setIsOpen(false);
      return;
    }

    setStepIndex((index) => index + 1);
  };

  const openFlow = () => {
    const firstIncomplete = REQUIRED_FIELDS.findIndex(
      (field) => !completedFields.includes(field),
    );
    setStepIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
    setIsOpen(true);
  };

  return (
    <>
      {renderTrigger ? (
        renderTrigger({
          completed: completedFields.length,
          open: openFlow,
          progress,
          total: REQUIRED_FIELDS.length,
        })
      ) : (
        <button className={styles.progressCard} onClick={openFlow} type={'button'}>
          <span
            aria-hidden={true}
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
          <span className={styles.progressCopy}>
            <strong>
              {i18n(progress === 100 ? 'Readings are personalized' : 'Make readings more personal')}
            </strong>
            <span>
              {progress === 100
                ? i18n('You can update your answers anytime')
                : `${i18n('Personalization')} · ${completedFields.length} ${i18n('of')} ${REQUIRED_FIELDS.length}`}
            </span>
          </span>
          <span aria-hidden={true} className={styles.progressValue}>{progress}%</span>
        </button>
      )}

      <Modal
        className={styles.screen}
        contentClassName={styles.screenContent}
        isClosable={false}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        overlayClassName={styles.overlay}
      >
        <header className={styles.header}>
          <button onClick={() => setIsOpen(false)} type={'button'}>
            <span aria-hidden={true}>←</span>
            {i18n('Back')}
          </button>
          <span>{stepIndex + 1} / {STEPS.length}</span>
        </header>

        <div className={styles.body}>
          <div className={styles.stepProgress}>
            <span style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }} />
          </div>
          <span className={styles.eyebrow}>{i18n('Personalization')}</span>
          <h2>{i18n(step.title)}</h2>
          {step.multiple && <p className={styles.hint}>{i18n('Choose up to two')}</p>}

          {step.options ? (
            <div className={styles.options}>
              {step.options.map((option) => (
                <button
                  aria-pressed={isSelected(option.value)}
                  className={isSelected(option.value) ? styles.selected : ''}
                  key={option.value}
                  onClick={() => selectOption(option.value)}
                  type={'button'}
                >
                  {i18n(option.label)}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              maxLength={300}
              onChange={(event) => setProfile({ ...profile, context: event.target.value })}
              placeholder={i18n('For example: I am considering a career change')}
              value={profile.context ?? ''}
            />
          )}

          {saveError && <p className={styles.error}>{i18n('Could not save answers')}</p>}

          <div className={styles.actions}>
            {stepIndex > 0 && (
              <button
                className={styles.previous}
                onClick={() => setStepIndex((index) => index - 1)}
                type={'button'}
              >
                {i18n('Back')}
              </button>
            )}
            <button
              className={styles.continue}
              disabled={!canContinue || isSaving}
              onClick={continueFlow}
              type={'button'}
            >
              {i18n(stepIndex === STEPS.length - 1 ? 'Save' : 'Continue')}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
