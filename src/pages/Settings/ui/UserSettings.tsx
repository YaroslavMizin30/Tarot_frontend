import { useState } from 'react';

import { useUserData } from '@/entities/User';
import NatalChart from '@/entities/NatalChart';

import Arrow from '@/shared/assets/svg/common/deck-arrow.svg';

import styles from './SettingsPage.module.css';

const UserSettings = (props: { onBackButtonClick: () => void }) => {
  const { onBackButtonClick } = props;

  const { userData } = useUserData();

  const [options, setOptions] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('About you');

  const handleBackButtonClick = () => {
    if (options.length) {
      setOptions([]);

      setTitle('About you');

      return;
    }

    onBackButtonClick();
  };

  if (!userData) {
    return null;
  }

  return (
    <>
      <h3>{title}</h3>

      <NatalChart
        {...userData}
        zodiacSign={userData.sign}
        name={userData.userName}
        chartDescription={userData.natalChart}
      />

      <Arrow
        width={30}
        height={30}
        className={styles.arrow}
        onClick={handleBackButtonClick}
      />
    </>
  );
};

export default UserSettings;
