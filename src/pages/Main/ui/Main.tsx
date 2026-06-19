import { useEffect, type SyntheticEvent } from 'react';
import { useNavigate, useOutletContext } from 'react-router';

import Button from '@/shared/ui/Button';
import TRANSLATIONS_EN from '@/shared/locales/en/common';
import TRANSLATIONS_RU from '@/shared/locales/ru/common';
import useLocales from '@/shared/hooks/useLocales';
import Zodiac from '@/shared/ui/Zodiac';
import Tooltip from '@/shared/ui/Tooltip';

import { type User, useSubscription } from '@/entities/User';

import styles from './Main.module.css';

export const MainPage = () => {
  const navigate = useNavigate();

  const handleNavigationButtonClick = (
    e: SyntheticEvent<HTMLButtonElement>,
  ) => {
    navigate(e.currentTarget.value);
  };

  const { i18n, addTranslations, locale } = useLocales();

  const { user } = useOutletContext<{ user: User }>();

  const { isAvailableForCurrentTariff, getExpiredMessage } = useSubscription();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  return (
    <div className={styles.container}>
      <Zodiac sign={user?.sign} />

      {JSON.stringify({ device: window.Telegram?.WebApp?.platform })}
      {JSON.stringify({
        settings: window.Telegram?.WebApp?.SettingsButton?.isVisible,
      })}
      {JSON.stringify({
        expanded: window.Telegram?.WebApp?.isExpanded,
      })}

      <Tooltip
        position={'top'}
        content={getExpiredMessage()}
        isEnabled={
          !isAvailableForCurrentTariff({
            standard: true,
            extended: true,
            trial: false,
          })
        }
      >
        <Button
          value={'/daily'}
          onClick={handleNavigationButtonClick}
          disabled={
            !isAvailableForCurrentTariff({
              standard: true,
              extended: true,
              trial: false,
            })
          }
        >
          {i18n('Card of the day')}
        </Button>
      </Tooltip>

      <Tooltip
        position={'top'}
        content={getExpiredMessage()}
        isEnabled={
          !isAvailableForCurrentTariff({
            standard: true,
            extended: true,
            trial: false,
          })
        }
      >
        <Button
          value={'/reading'}
          onClick={handleNavigationButtonClick}
          disabled={
            !isAvailableForCurrentTariff({
              standard: true,
              extended: true,
              trial: false,
            })
          }
        >
          {i18n('Make spread')}
        </Button>
      </Tooltip>

      <Button value={'/history'} onClick={handleNavigationButtonClick}>
        {i18n('Spreads history')}
      </Button>

      <Button value={'/about'} onClick={handleNavigationButtonClick}>
        {i18n('About Tarot')}
      </Button>
    </div>
  );
};
