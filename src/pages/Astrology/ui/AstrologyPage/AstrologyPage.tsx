import { useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';

import StarsComposition from '@/pages/ui/StarsComposition';
import { SUBSECTIONS } from '../../config/subsections';
import type { Subsection } from '../../config/subsections';

import styles from './AstrologyPage.module.css';

export const AstrologyPage = () => {
  const navigate = useNavigate();

  const handleOpen = (subsection: Subsection) => {
    if (subsection === 'natal-chart') {
      navigate('/natal-chart');
    }
  };

  return (
    <div className={styles.container}>
      <StarsComposition />

      <div className={styles.menu}>
        {SUBSECTIONS.map(({ key, label }) => (
          <Button
            key={key}
            className={styles.menuButton}
            onClick={() => handleOpen(key)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};
