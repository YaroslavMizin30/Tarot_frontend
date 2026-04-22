import { useState } from 'react';
import snakeize from 'snakeize';

import { useUserData, type User } from '@/entities/User';

import useLocales from '@/shared/hooks/useLocales';
import Button from '@/shared/ui/Button';
import Arrow from '@/shared/assets/svg/common/deck-arrow.svg';

import { HIDDEN_FIELDS } from '../config/fields';
import { OPTIONS } from '../config/options';

import styles from './SettingsPage.module.css';

const UserSettings = (props: { onBackButtonClick: () => void }) => {
  const { onBackButtonClick } = props;

  const { userData, updateUserData, isLoading } = useUserData();

  const [options, setOptions] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('About you');
  const [currentUpdate, setCurrentUpdate] = useState<string>('');

  const { i18n } = useLocales();

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

  const getContent = () => {
    if (options.length) {
      return options.map((option) => {
        const handleOptionClick = async () => {
          setCurrentUpdate(option);

          await updateUserData(
            String(userData?.id),
            snakeize({
              ...userData,
              [title]: i18n(option),
            }),
          );
        };

        return (
          <Button
            isActive={
              i18n(option) === userData?.[title as keyof typeof userData]
            }
            isLoading={currentUpdate === option && isLoading}
            onClick={handleOptionClick}
            className={styles.button}
            key={option}
          >
            {i18n(option)}
          </Button>
        );
      });
    }

    return (
      <>
        {Object.keys(userData).map((key) => {
          if (HIDDEN_FIELDS.includes(key) || !userData[key as keyof User]) {
            return null;
          }

          const handleOptionButtonClick = () => {
            setOptions(OPTIONS[key as keyof User]);

            setTitle(key);
          };

          return (
            <div key={key} className={styles.option}>
              <p>{i18n(key)}</p>

              <Button onClick={handleOptionButtonClick}>
                {userData[key as keyof typeof userData]}
              </Button>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <h4 className={styles.title}>{i18n(title)}</h4>

      <div className={`${styles.section} custom-scrollbar`}>{getContent()}</div>

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
