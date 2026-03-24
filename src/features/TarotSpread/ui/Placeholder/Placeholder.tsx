import { useState, type FC } from 'react';

import { type PlaceholderProps } from './Placeholder.props';

import question from '@/shared/assets/svg/common/question.svg';
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

  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className={styles.placeholder} style={style}>
      <div className={styles['placeholder-cover']}>{index}</div>

      {description && (
        <Tooltip
          content={description}
          className={`${styles['tooltip-container']}`}
          isVisible={isVisible}
          position={tooltipPosition}
          tooltipClassName={styles.tooltip}
          style={tooltipStyle}
        >
          <img
            src={question}
            className={`${styles.question}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />

          {isVisible && <div className={styles.active}></div>}
        </Tooltip>
      )}

      {children}

      {title && <span>{title}</span>}
    </div>
  );
};

export default Placeholder;
