import { useState } from 'react';

import { useUser } from '@/entities/User';
import NatalChart from '@/entities/NatalChart';

import ArrowButton from '@/shared/ui/ArrowButton';
import useLocales from '@/shared/hooks/useLocales';

import styles from './SettingsPage.module.css';

const UserSettings = (props: { onBackButtonClick: () => void }) => {
  const { onBackButtonClick } = props;

  const { user } = useUser();
  const { i18n } = useLocales();

  const [options, setOptions] = useState<string[]>([]);
  const [title, setTitle] = useState<string>(i18n('About you'));

  const handleBackButtonClick = () => {
    if (options.length) {
      setOptions([]);

      setTitle(i18n('About you'));

      return;
    }

    onBackButtonClick();
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <h3 className={styles.title}>{title}</h3>

      <NatalChart
        {...user}
        zodiacSign={user.sign}
        name={user.userName}
        chartDescription={user.natalChart}
      />

      <ArrowButton className={styles.arrow} onClick={handleBackButtonClick} />
    </>
  );
};

export default UserSettings;
