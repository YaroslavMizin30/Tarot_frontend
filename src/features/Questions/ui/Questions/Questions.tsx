import React, { useState, type FC } from 'react';

import { useQuestion } from '../../model/hooks/useQuestion';
import type { Question, SpreadParams } from '../../model/types/questions';
import { THEMES } from '../../config/questions';

import Themes from '../Themes/Themes';
import List from '../List/List';
import Input from '../Input/QuestionInput';
import Spread from '../Spread/Spread';

import Arrow from '@/shared/assets/svg/common/deck-arrow.svg?react';
import useLocales from '@/shared/hooks/useLocales';

import { type QuestionProps } from './Questions.props';

import styles from './Questions.module.css';

export const Questions: FC<QuestionProps> = (props) => {
  const { onSpreadSelect } = props;

  const {
    changeStep,
    changeSpread,
    setQuestionsList,
    changeTopic,
    clearSpread,
    topic,
    questions,
    spread,
    step,
  } = useQuestion();

  const { i18n } = useLocales();

  const [isSelected, setIsSelected] = useState(false);

  const handleThemeChoose = (params: {
    questions: Question[];
    name: string;
  }) => {
    const { questions: questionList, name } = params;

    changeTopic(name);

    if (!questionList.length) {
      changeStep({ isBack: false, value: 'input' });

      changeSpread({ ...spread, details: i18n('My own question') });

      return;
    }

    changeStep({ isBack: false, value: 'question' });
    setQuestionsList(questionList);
  };

  const handleQuestionChoose = (q: Question) => {
    const {
      spreadNumber,
      spreadTitle,
      areDetailsNeeded,
      detailsQuestion,
      detailsAnswer,
      spreadId,
      text,
    } = q;

    changeSpread({
      cardsCount: spreadNumber,
      title: spreadTitle,
      userAnswer: '',
      details: detailsQuestion,
      detailsAnswer,
      question: text,
      id: spreadId,
    });

    changeStep({ isBack: false, value: areDetailsNeeded ? 'input' : 'spread' });
  };

  const handleBackButtonClick = () => {
    const values: Array<keyof SpreadParams> = [];

    if (step === 'question') {
      values.push('detailsAnswer');
      values.push('cardsCount');
      values.push('title');
      values.push('details');
      values.push('userAnswer');
      values.push('question');
    }

    if (step === 'input') {
      values.push('userAnswer');
    }

    clearSpread(values);
    changeStep({ isBack: true });
  };

  const handleQuestionInput = (userAnswer: string) => {
    changeSpread({ ...spread, userAnswer });
  };

  const handleQuestionSet = () => {
    if (spread.userAnswer) {
      changeStep({ isBack: false, value: 'spread' });
    }
  };

  const handleSpreadChange = (spread: SpreadParams) => {
    changeSpread(spread);
  };

  const handleSpreadSelect = () => {
    setIsSelected(true);
    setTimeout(() => {
      onSpreadSelect(spread);
    }, 1000);
  };

  const Content = () => {
    switch (step) {
      case 'theme':
        return <Themes themes={THEMES} onThemeChoose={handleThemeChoose} />;
      case 'question':
        return (
          <List
            currentTheme={topic}
            questions={questions}
            onQuestionChoose={handleQuestionChoose}
          />
        );
      case 'input':
        return <Input spread={spread} onQuestionInput={handleQuestionInput} />;
      case 'spread':
        return (
          <Spread
            spread={spread}
            onSpreadChange={handleSpreadChange}
            onSpreadSelect={handleSpreadSelect}
          />
        );
      default:
        return <Themes themes={THEMES} onThemeChoose={handleThemeChoose} />;
    }
  };

  return (
    <div
      className={`${styles.questions}`}
      style={{ opacity: isSelected ? 0 : 1 }}
    >
      {step !== 'theme' && (
        <Arrow
          width={30}
          height={30}
          className={styles.back}
          onClick={handleBackButtonClick}
        />
      )}

      {step === 'input' && (
        <Arrow
          width={30}
          height={30}
          className={styles.forward}
          onClick={handleQuestionSet}
        />
      )}

      <div className={`${styles.container} custom-scrollbar`}>{Content()}</div>
    </div>
  );
};
