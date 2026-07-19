import { useEffect } from 'react';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/settings';
import TRANSLATIONS_RU from '@/shared/locales/ru/settings';
import TRANSLATIONS_EN_CARDS from '@/shared/locales/en/cards';
import TRANSLATIONS_RU_CARDS from '@/shared/locales/ru/cards';
import Spinner from '@/shared/ui/Spinner';

import ProfileActions from './ProfileActions/ProfileActions';
import ProfileInsights from './ProfileInsights/ProfileInsights';
import ProfileServices from './ProfileServices/ProfileServices';
import ProfileSummary from './ProfileSummary/ProfileSummary';
import ProfileWallet from './ProfileWallet/ProfileWallet';

import { useUser } from '@/entities/User';
import { useSpreads } from '@/entities/Spread';

import styles from './SettingsPage.module.css';

export const SettingsPage = () => {
  const { user } = useUser();

  const { addTranslations, locale } = useLocales();

  const { spreads, isLoading } = useSpreads();

  useEffect(() => {
    addTranslations({
      en: { ...TRANSLATIONS_EN, ...TRANSLATIONS_EN_CARDS },
      ru: { ...TRANSLATIONS_RU, ...TRANSLATIONS_RU_CARDS },
    });
  }, [addTranslations, locale]);

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.dashboard} custom-scrollbar`}>
        <ProfileSummary user={user} />
        <ProfileWallet user={user} />
        <ProfileActions />

        <div className={styles.info}>
          {isLoading ? (
            <div className={styles['stats-loading']}>
              <Spinner size={'m'} />
            </div>
          ) : (
            <ProfileInsights spreads={spreads ?? []} />
          )}
        </div>

        <ProfileServices />
      </div>
    </div>
  );
};
