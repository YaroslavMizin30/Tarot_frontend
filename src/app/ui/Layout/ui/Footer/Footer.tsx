import { useLocation, useNavigate } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';

import TarotPage from '@/shared/assets/svg/common/tarot_page.svg';
import AstrologyPage from '@/shared/assets/svg/common/astrology_page.svg';
import RoulettePage from '@/shared/assets/svg/common/roulette_page.svg';
import BillingPage from '@/shared/assets/svg/common/billing_page.svg';
import ProfilePage from '@/shared/assets/svg/common/profile_page.svg';

import styles from './Footer.module.css';

const Footer = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const TAROT_PAGES = ['/', '/reading', '/about', '/daily', '/history'];
  const SETTING_PAGES = ['/settings'];
  const ASTROLOGY_PAGES = ['/astrology', '/natal-chart'];

  const { i18n } = useLocales();

  return (
    <footer className={styles.footer}>
      <div className={styles.wrapper}>
        <div className={styles.cover}></div>
        <div
          className={`${styles.section} ${TAROT_PAGES.includes(pathname) ? styles.active : ''}`}
          onClick={() => navigate('/')}
        >
          <TarotPage />

          <span>{i18n('Tarot')}</span>
        </div>

        <div
          className={`${styles.section} ${ASTROLOGY_PAGES.includes(pathname) ? styles.active : ''}`}
          onClick={() => navigate('/astrology')}
        >
          <AstrologyPage />

          <span>{i18n('Astrology')}</span>
        </div>

        <div className={styles.section}>
          <RoulettePage />

          <span>{i18n('Roulette')}</span>
        </div>

        <div className={styles.section}>
          <BillingPage />

          <span>{i18n('Purchase')}</span>
        </div>

        <div
          className={`${styles.section} ${SETTING_PAGES.includes(pathname) ? styles.active : ''}`}
          onClick={() => navigate('/settings')}
        >
          <ProfilePage />

          <span>{i18n('Profile')}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
