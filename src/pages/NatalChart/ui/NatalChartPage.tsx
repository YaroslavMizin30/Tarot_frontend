import { useLocation, useNavigate } from 'react-router';

import { useUser } from '@/entities/User';
import type { PersonalTransit } from '@/entities/Horoscope/types/transit';
import NatalChart from '@/widgets/NatalChart';

import styles from './NatalChartPage.module.css';

export const NatalChartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refetchUser } = useUser();
  const routeState = location.state as {
    selectedTransit?: PersonalTransit;
    returnTo?: string;
  } | null;
  const selectedTransit = routeState?.selectedTransit ?? null;
  const returnTo = routeState?.returnTo?.startsWith('/')
    ? routeState.returnTo
    : '/astrology';

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {user && (
          <NatalChart
            user={user}
            onUpdated={refetchUser}
            onBack={() => navigate(returnTo)}
            onTransits={() => navigate('/transits')}
            initialTransit={selectedTransit}
          />
        )}
      </div>
    </div>
  );
};
