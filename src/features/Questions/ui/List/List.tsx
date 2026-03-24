import React, { type FC } from 'react';

import Button from '@/shared/ui/Button';
import useLocales from '@/shared/hooks/useLocales';

import type { ListProps } from './List.props';

import styles from './List.module.css';

const List: FC<ListProps> = (props) => {
  const { questions, onQuestionChoose, currentTheme } = props;

  const { i18n } = useLocales();

  return (
    <>
      <h3 className={styles.title}>{currentTheme}</h3>

      {questions.map((q) => {
        const { label, text, spreadTitle, detailsQuestion, detailsAnswer } = q;

        const handleQuestionChoose = () => {
          onQuestionChoose({
            ...q,
            label: i18n(label),
            text: i18n(text),
            detailsAnswer: i18n(detailsAnswer ?? ''),
            detailsQuestion: i18n(detailsQuestion ?? ''),
            spreadTitle: i18n(spreadTitle ?? ''),
          });
        };

        return (
          <div className={styles['question-item']}>
            <Button onClick={handleQuestionChoose} className={styles.button}>
              {i18n(label)}
            </Button>

            <div className={styles.description}>{i18n(text)}</div>
          </div>
        );
      })}
    </>
  );
};

export default List;
