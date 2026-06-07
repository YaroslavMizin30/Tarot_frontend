import { type FC } from 'react';

import Button from '@/shared/ui/Button';
import useLocales from '@/shared/hooks/useLocales';
import Tooltip from '@/shared/ui/Tooltip';
import { checkSubscriptionStatus } from '@/shared/utils/checkSubscriptionStatus';
import { isTrialAvailable } from '@/shared/utils/isTrialAvailable';

import { useUser } from '@/entities/User';

import type { ListProps } from './List.props';

import styles from './List.module.css';

const List: FC<ListProps> = (props) => {
  const { questions, onQuestionChoose, currentTheme } = props;

  const { i18n } = useLocales();
  const { user } = useUser();

  const { tariff, freeSpreads, expirationDate } = user ?? {};

  const { isExpired } = checkSubscriptionStatus(expirationDate ?? '');

  return (
    <>
      <h3 className={styles.title}>{currentTheme}</h3>

      {questions.map((q) => {
        const {
          label,
          text,
          spreadTitle,
          detailsQuestion,
          detailsAnswer,
          tariffs,
        } = q;

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

        const isAvailable = () => {
          return (
            (tariff && tariffs[tariff]) ||
            (tariff === 'trial' && isTrialAvailable(Number(freeSpreads)))
          );
        };

        const getTooltipDescription = () => {
          if (tariff === 'standard') {
            return i18n('Available for extended tariff');
          } else if (
            tariff === 'trial' &&
            !isTrialAvailable(Number(freeSpreads))
          ) {
            return i18n('No free queries left 😔. Available via subscription');
          } else if (isExpired) {
            return i18n(
              'Your subscription has expired 😔. Available via subscription',
            );
          }
        };

        return (
          <div className={styles['question-item']} key={text}>
            <Tooltip
              content={getTooltipDescription()}
              position={'top'}
              isEnabled={!isAvailable()}
              style={{textAlign: 'center'}}
            >
              <Button
                onClick={handleQuestionChoose}
                className={styles.button}
                disabled={!isAvailable()}
              >
                {i18n(label)}
              </Button>
            </Tooltip>

            <div className={styles.description}>{i18n(text)}</div>
          </div>
        );
      })}
    </>
  );
};

export default List;
