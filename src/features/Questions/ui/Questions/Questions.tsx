import { useState, type FC } from 'react';
import { useNavigate } from 'react-router';

import { useQuestion } from '../../model/hooks/useQuestion';
import type { Question } from '../../model/types/questions';
import { THEMES } from '../../config/questions';

import Themes from '../Themes/Themes';
import Input from '../Input/QuestionInput';
import Spread from '../Spread/Spread';

import type { SpreadParams } from '@/entities/Spread';

import ArrowButton from '@/shared/ui/ArrowButton';

import { type QuestionProps } from './Questions.props';

import styles from './Questions.module.css';

export const Questions: FC<QuestionProps> = (props) => {
  const { onSpreadSelect } = props;

  const { changeStep, changeSpread, clearSpread, spread, step } = useQuestion();

  const navigate = useNavigate();

  const [isSelected, setIsSelected] = useState(false);

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
      userId: 0,
    });

    changeStep({ isBack: false, value: areDetailsNeeded ? 'input' : 'spread' });
  };

  const handleBackButtonClick = () => {
    const values: Array<keyof SpreadParams> = [];
    if (step === 'theme') {
      navigate('/tarot');
    }

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
        return (
          <Themes themes={THEMES} onQuestionChoose={handleQuestionChoose} />
        );
      case 'input':
        return (
          <Input
            spread={spread}
            onQuestionInput={handleQuestionInput}
            onQuestionSet={handleQuestionSet}
          />
        );
      case 'spread':
        return (
          <Spread
            spread={spread}
            onSpreadChange={handleSpreadChange}
            onSpreadSelect={handleSpreadSelect}
          />
        );
      default:
        return (
          <Themes themes={THEMES} onQuestionChoose={handleQuestionChoose} />
        );
    }
  };

  return (
    <div
      className={`${styles.questions}`}
      style={{ opacity: isSelected ? 0 : 1 }}
    >
      {Content()}

      <ArrowButton className={styles.back} onClick={handleBackButtonClick} />
    </div>
  );
};
