import { type FC } from 'react';

import { type PlaceholderProps } from './Placeholder.props';

import Question from '@/shared/assets/svg/common/question.svg';
import { Tooltip } from '@/shared/ui/Tooltip/ui/Tooltip';

import styles from './Placeholder.module.css';

const Placeholder: FC<PlaceholderProps> = (props) => {
  const {
    style,
    index,
    title,
    description,
    tooltipPosition = 'bottom',
    tooltipStyle,
    children,
  } = props;

  return (
    <div className={styles.placeholder} style={style}>
      <div className={styles['placeholder-cover']}>{index}</div>

      {description && (
        <Tooltip
          content={description}
          className={`${styles['tooltip-container']}`}
          position={tooltipPosition}
          tooltipClassName={styles.tooltip}
          style={tooltipStyle}
        >
          <Question className={`${styles.question}`} />
        </Tooltip>
      )}

      {children}

      {title && <span>{title}</span>}
    </div>
  );
};

export default Placeholder;
