import { useState, type FC } from 'react';
import { useNavigate } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';
import Button from '@/shared/ui/Button';
import Modal from '@/shared/ui/Modal';
import Pentacle from '@/shared/ui/Pentacle';

import { SPREADS } from '@/features/TarotSpread';

import type { ThemeProps } from './Themes.props';
import type { Question } from '../../model/types/questions';
import { ThemeIcon, type ThemeIconName } from './ThemeIcon';

import styles from './Themes.module.css';

const THEME_ICONS: ThemeIconName[] = [
  'anxiety',
  'decision',
  'love',
  'career',
  'money',
  'self',
  'emotion',
  'spirituality',
  'transformation',
  'balance',
];

const Themes: FC<ThemeProps> = (props) => {
  const { onQuestionChoose, themes } = props;

  const { i18n } = useLocales();
  const navigate = useNavigate();
  const [activeThemeName, setActiveThemeName] = useState(
    themes[0]?.name ?? '',
  );
  const [isAllQuestionsOpen, setIsAllQuestionsOpen] = useState(false);

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
      <span className={styles.priceRange}>
        {`${Math.min(...SPREADS.map(({ cardCount }) => cardCount))}–${Math.max(
          question.spreadNumber,
          ...SPREADS.map(({ cardCount }) => cardCount),
        )}`}
        <Pentacle className={styles.priceIcon} />
      </span>
    </button>
  );

  return (
    <div className={styles.content}>
      <div className={styles.personalizationSlot} aria-hidden={true} />

      <Button className={styles.button} onClick={handleOwnQuestionClick}>
        {i18n('My own question')}
      </Button>

      <h3 className={styles.title}>{i18n('Topics')}</h3>

      <div
        aria-label={i18n('Topics')}
        className={styles.filters}
        role={'group'}
      >
        {themes.map((theme, index) => {
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
                name={THEME_ICONS[index] ?? 'spirituality'}
              />
            </button>
          );
        })}
      </div>

      <div className={styles.grid}>
        {activeTheme?.questions.slice(0, 4).map(renderQuestion)}
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

      <button
        className={styles.history}
        onClick={() => navigate('/history')}
        type={'button'}
      >
        <span>{i18n('Spreads history')}</span>
        <span aria-hidden={true}>→</span>
      </button>

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
