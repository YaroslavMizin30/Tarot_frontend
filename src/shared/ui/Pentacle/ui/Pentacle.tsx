import PentacleIcon from '@/shared/assets/svg/common/pentagram.svg';

import styles from './Pentacle.module.css';

export const Pentacle = (props: {
  className?: string;
  svgClassName?: string;
}) => {
  const { className = '', svgClassName = '' } = props;

  return (
    <div className={`${styles.container} ${className}`}>
      <PentacleIcon className={`${styles.pentacle} ${svgClassName}`} />
    </div>
  );
};
