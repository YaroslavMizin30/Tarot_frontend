import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { useNavigate } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';
import Button from '@/shared/ui/Button';
import Modal from '@/shared/ui/Modal';
import { useUser, type TarotProfile } from '@/entities/User';

import type { ThemeProps } from './Themes.props';
import type { Question } from '../../model/types/questions';
import { ThemeIcon, type ThemeIconName } from './ThemeIcon';
import { QuestionCardFan } from './QuestionCardFan';
import { Personalization } from '../Personalization/Personalization';

import styles from './Themes.module.css';

const THEME_ICONS: Record<string, ThemeIconName> = {
  'Decisions and future': 'decision',
  'Love and relationships': 'love',
  'Work and money': 'career',
  'Inner state': 'emotion',
  'Self-knowledge and change': 'self',
  'Spiritual path': 'spirituality',
};

const FOCUS_THEME: Record<NonNullable<TarotProfile['focus']>[number], string> = {
  relationships: 'Love and relationships',
  career: 'Work and money',
  money: 'Work and money',
  wellbeing: 'Inner state',
  change: 'Self-knowledge and change',
  direction: 'Decisions and future',
};

const LIFE_STAGE_THEME: Partial<Record<NonNullable<TarotProfile['lifeStage']>, string>> = {
  starting: 'Self-knowledge and change',
  choosing: 'Decisions and future',
  moving: 'Work and money',
  changing: 'Self-knowledge and change',
  recovering: 'Inner state',
  uncertain: 'Decisions and future',
};

const getPreferredThemeNames = (profile?: TarotProfile) => {
  const focusThemes = (profile?.focus ?? []).map((focus) => FOCUS_THEME[focus]);
  const lifeStageTheme = profile?.lifeStage
    ? LIFE_STAGE_THEME[profile.lifeStage]
    : undefined;

  return [...new Set([
    ...focusThemes,
    ...(focusThemes.length === 0 && lifeStageTheme ? [lifeStageTheme] : []),
  ])];
};

const Themes: FC<ThemeProps> = (props) => {
  const { onQuestionChoose, themes } = props;

  const { i18n } = useLocales();
  const { user } = useUser();
  const navigate = useNavigate();
  const preferredThemeNames = useMemo(
    () => getPreferredThemeNames(user?.tarotProfile),
    [user?.tarotProfile],
  );
  const orderedThemes = useMemo(() => {
    const priority = new Map(
      preferredThemeNames.map((themeName, index) => [themeName, index]),
    );

    return themes
      .map((theme, defaultIndex) => ({ theme, defaultIndex }))
      .sort((left, right) => {
        const leftPriority = priority.get(left.theme.name);
        const rightPriority = priority.get(right.theme.name);

        if (leftPriority !== undefined || rightPriority !== undefined) {
          if (leftPriority === undefined) return 1;
          if (rightPriority === undefined) return -1;
          return leftPriority - rightPriority;
        }

        return left.defaultIndex - right.defaultIndex;
      })
      .map(({ theme }) => theme);
  }, [preferredThemeNames, themes]);
  const [activeThemeName, setActiveThemeName] = useState(
    orderedThemes[0]?.name ?? '',
  );
  const [isAllQuestionsOpen, setIsAllQuestionsOpen] = useState(false);
  const hasAppliedPersonalOrder = useRef(false);

  useEffect(() => {
    if (hasAppliedPersonalOrder.current || preferredThemeNames.length === 0) {
      return;
    }

    setActiveThemeName(orderedThemes[0]?.name ?? '');
    hasAppliedPersonalOrder.current = true;
  }, [orderedThemes, preferredThemeNames.length]);

  const activeTheme =
    themes.find((theme) => theme.name === activeThemeName) ?? themes[0];

  const handleOwnQuestionClick = () => {
    onQuestionChoose({
      label: i18n('My own question'),
      text: '',
      spreadId: 'single',
      spreadNumber: 0,
      areDetailsNeeded: true,
      detailsQuestion: i18n('What would you like to ask?'),
      detailsAnswer: i18n('Your question'),
    });
  };

  const handleQuestionClick = (question: Question) => {
    setIsAllQuestionsOpen(false);

    const { label, text, spreadTitle, detailsQuestion, detailsAnswer } =
      question;

    onQuestionChoose({
      ...question,
      label: i18n(label),
      text: i18n(text),
      detailsAnswer: i18n(detailsAnswer ?? ''),
      detailsQuestion: i18n(detailsQuestion ?? ''),
      spreadTitle: i18n(spreadTitle ?? ''),
    });
  };

  const renderQuestion = (question: Question) => (
    <button
      className={styles.question}
      key={question.label}
      onClick={() => handleQuestionClick(question)}
      type={'button'}
    >
      <span className={styles.label}>{i18n(question.label)}</span>
      <span className={styles.description}>{i18n(question.text)}</span>
      <QuestionCardFan className={styles.cardFan} />
    </button>
  );

  return (
    <div className={styles.content}>
      <Button className={styles.button} onClick={handleOwnQuestionClick}>
        {i18n('My own question')}
      </Button>

      <h3 className={styles.title}>{i18n('Topics')}</h3>

      <div
        aria-label={i18n('Topics')}
        className={styles.filters}
        role={'group'}
      >
        {orderedThemes.map((theme) => {
          const isActive = theme.name === activeTheme?.name;

          return (
            <button
              aria-pressed={isActive}
              className={`${styles.filter} ${isActive ? styles.active : ''}`}
              key={theme.name}
              onClick={() => setActiveThemeName(theme.name)}
              type={'button'}
            >
              <span className={styles.filterLabel}>{i18n(theme.name)}</span>
              <ThemeIcon
                className={styles.icon}
                name={THEME_ICONS[theme.name] ?? 'spirituality'}
              />
            </button>
          );
        })}
      </div>

      <div className={styles.grid}>
        {activeTheme?.questions
          .filter((question) => question.featured)
          .slice(0, 4)
          .map(renderQuestion)}
      </div>

      {(activeTheme?.questions.length ?? 0) > 4 && (
        <button
          className={styles.showAll}
          onClick={() => setIsAllQuestionsOpen(true)}
          type={'button'}
        >
          {i18n('Show all questions')}
          <span aria-hidden={true}>→</span>
        </button>
      )}

      <nav aria-label={i18n('Tarot')} className={styles.secondaryActions}>
        <button
          className={styles.secondaryAction}
          onClick={() => navigate('/history')}
          type={'button'}
        >
          <span>{i18n('Spreads history')}</span>
          <span aria-hidden={true}>→</span>
        </button>

        <button
          className={styles.secondaryAction}
          onClick={() => navigate('/about')}
          type={'button'}
        >
          <span>{i18n('About Tarot')}</span>
          <span aria-hidden={true}>→</span>
        </button>
      </nav>

      <div className={styles.personalizationSlot}>
        <Personalization />
      </div>

      <Modal
        className={styles.overlayScreen}
        contentClassName={`${styles.overlayContent} custom-scrollbar`}
        isClosable={false}
        isOpen={isAllQuestionsOpen}
        onClose={() => setIsAllQuestionsOpen(false)}
        overlayClassName={styles.overlay}
      >
        <header className={styles.overlayHeader}>
          <button
            className={styles.overlayBack}
            onClick={() => setIsAllQuestionsOpen(false)}
            type={'button'}
          >
            <span aria-hidden={true}>←</span>
            {i18n('Back')}
          </button>
        </header>

        <div className={styles.overlayBody}>
          <span className={styles.overlayEyebrow}>
            {activeTheme ? i18n(activeTheme.name) : ''}
          </span>
          <h2>{i18n('All questions')}</h2>
          <div className={styles.overlayGrid}>
            {activeTheme?.questions.map(renderQuestion)}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Themes;
