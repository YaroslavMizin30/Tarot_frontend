import { useState } from 'react';

import { useUser } from '@/entities/User';
import NatalChart from '@/widgets/NatalChart';

import ArrowButton from '@/shared/ui/ArrowButton';

import styles from '../SettingsPage.module.css';

const UserSettings = (props: { onBackButtonClick: () => void }) => {
  const { onBackButtonClick } = props;

  const { user } = useUser();

  const [options, setOptions] = useState<string[]>([]);

  const handleBackButtonClick = () => {
    if (options.length) {
      setOptions([]);

      return;
    }

    onBackButtonClick();
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <NatalChart user={user} className={styles.chart} />

      <ArrowButton className={styles.arrow} onClick={handleBackButtonClick} />
    </>
  );
};

export default UserSettings;
