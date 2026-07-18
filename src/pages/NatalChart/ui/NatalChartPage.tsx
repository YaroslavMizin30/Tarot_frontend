import { useNavigate } from 'react-router';

import { useUser } from '@/entities/User';
import NatalChart from '@/widgets/NatalChart';

import styles from './NatalChartPage.module.css';

export const NatalChartPage = () => {
  const navigate = useNavigate();
  const { user, refetchUser } = useUser();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {user && (
          <NatalChart
            user={user}
            onUpdated={refetchUser}
            onBack={() => navigate('/astrology')}
          />
        )}
      </div>
    </div>
  );
};
