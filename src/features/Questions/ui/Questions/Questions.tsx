import { type FC } from 'react';
import { useNavigate } from 'react-router';

import { useQuestion } from '../../model/hooks/useQuestion';
import type { Question } from '../../model/types/questions';
import { THEMES } from '../../config/questions';

import Themes from '../Themes/Themes';
import Spread from '../Spread/Spread';

import {
  startSpreadDraft,
  type SpreadParams,
} from '@/entities/Spread';
import { BILLING_REDIRECT_STATE_KEY } from '@/features/Billing/model/useBalance';

import ArrowButton from '@/shared/ui/ArrowButton';

import { type QuestionProps } from './Questions.props';

import styles from './Questions.module.css';

export const Questions: FC<QuestionProps> = (props) => {
  const { onSpreadSelect } = props;

  const { changeStep, changeSpread, clearSpread, spread, step } = useQuestion();

  const navigate = useNavigate();

  const handleQuestionChoose = (q: Question) => {
    const {
      spreadNumber,
      spreadTitle,
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

    changeStep({ isBack: false, value: 'setup' });
  };

  const handleBackButtonClick = () => {
    const values: Array<keyof SpreadParams> = [];
    if (step === 'theme') {
      navigate('/tarot');
      return;
    }

    if (step === 'setup') {
      values.push('detailsAnswer');
      values.push('cardsCount');
      values.push('title');
      values.push('details');
      values.push('userAnswer');
      values.push('question');
      values.push('id');
    }

    clearSpread(values);
    changeStep({ isBack: true });
  };

  const handleQuestionInput = (userAnswer: string) => {
    changeSpread({ ...spread, userAnswer });
  };

  const handleSpreadChange = (spread: SpreadParams) => {
    changeSpread(spread);
  };

  const handleSpreadPrepare = async (params: SpreadParams) => {
    const result = await startSpreadDraft(params);

    if (result.status === 'insufficient_balance') {
      navigate('/billing', {
        state: {
          [BILLING_REDIRECT_STATE_KEY]: {
            current: result.current,
            draftId: result.draftId,
            required: result.required,
            returnTo: `/tarot?draft=${result.draftId}`,
          },
        },
      });

      return null;
    }

    const preparedSpread = {
      ...result.spread,
      spreadId: result.draftId,
    };

    changeSpread(preparedSpread);

    return preparedSpread;
  };

  const handleSpreadSelect = (selectedSpread: SpreadParams) => {
    onSpreadSelect(selectedSpread);
  };

  const Content = () => {
    switch (step) {
      case 'theme':
        return (
          <Themes themes={THEMES} onQuestionChoose={handleQuestionChoose} />
        );
      case 'setup':
        return (
          <Spread
            spread={spread}
            onQuestionInput={handleQuestionInput}
            onSpreadChange={handleSpreadChange}
            onSpreadPrepare={handleSpreadPrepare}
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
    <div className={`${styles.questions}`}>
      <div className={styles.content}>{Content()}</div>

      {step !== 'theme' && (
        <ArrowButton className={styles.back} onClick={handleBackButtonClick} />
      )}
    </div>
  );
};
