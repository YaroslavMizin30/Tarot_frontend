import PentacleIcon from '@/shared/assets/svg/common/pentagram.svg';

import styles from './Pentacle.module.css';

export const Pentacle = (props: { className?: string }) => {
  const { className = '' } = props;

  return (
    <div className={`${styles.container} ${className}`}>
      <PentacleIcon className={styles.pentacle} />
    </div>
  );
};
