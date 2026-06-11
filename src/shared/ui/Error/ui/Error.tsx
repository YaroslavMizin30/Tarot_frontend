import { type FC } from 'react';

import useLocales from '@/shared/hooks/useLocales';
import Button from '../../Button';

import type { ErrorProps } from './Error.props';

import styles from './Error.module.css';

export const Error: FC<ErrorProps> = (props) => {
  const { onRetryButtonClick, error } = props;

  const { i18n } = useLocales();

  return (
    <div className={styles.error}>
      <span>{error}</span>

      <Button className={styles.button} onClick={onRetryButtonClick}>
        {i18n('Try again')}
      </Button>
    </div>
  );
};
