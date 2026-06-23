import { useNavigate } from 'react-router';

import { useUser } from '@/entities/User';
import ArrowButton from '@/shared/ui/ArrowButton';
import StarsComposition from '@/pages/Astrology/ui/StarsComposition/StarsComposition';
import NatalChart from '@/widgets/NatalChart';

import styles from './NatalChartPage.module.css';

export const NatalChartPage = () => {
  const navigate = useNavigate();
  const { user, refetchUser } = useUser();

  return (
    <div className={styles.container}>
      <StarsComposition />

      <div className={styles.content}>
        {user && <NatalChart user={user} onUpdated={refetchUser} />}

        <ArrowButton onClick={() => navigate('/astrology')} />
      </div>
    </div>
  );
};
