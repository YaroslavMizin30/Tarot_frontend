import { useLocation, useNavigate } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';

import TodayPage from '@/shared/assets/svg/common/home.svg';
import TarotPage from '@/shared/assets/svg/common/tarot_page.svg';
import AstrologyPage from '@/shared/assets/svg/common/astrology_page.svg';
import ProfilePage from '@/shared/assets/svg/common/profile_page.svg';

import { getPageAttachment } from '../../config/pages';

import styles from './Footer.module.css';

const Footer = (props: { isLoading?: boolean }) => {
  const { isLoading } = props;

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { i18n } = useLocales();

  return (
    <footer
      className={`${styles.footer} ${isLoading ? styles['footer-loading'] : ''}`}
    >
      <div
        className={`${styles.wrapper} ${isLoading ? styles['wrapper-loading'] : ''}`}
      >
        <div className={styles.cover}></div>
        <button
          type={'button'}
          className={`${styles.section} ${getPageAttachment('today', pathname) ? styles.active : ''}`}
          onClick={() => navigate('/')}
        >
          <TodayPage className={styles.homeIcon} />

          <span>{i18n('Home')}</span>
        </button>

        <button
          type={'button'}
          className={`${styles.section} ${getPageAttachment('tarot', pathname) ? styles.active : ''}`}
          onClick={() => navigate('/tarot')}
        >
          <TarotPage />

          <span>{i18n('Tarot')}</span>
        </button>

        <button
          type={'button'}
          className={`${styles.section} ${getPageAttachment('astrology', pathname) ? styles.active : ''}`}
          onClick={() => navigate('/astrology')}
        >
          <AstrologyPage />

          <span>{i18n('Astrology')}</span>
        </button>

        <button
          type={'button'}
          className={`${styles.section} ${getPageAttachment('profile', pathname) ? styles.active : ''}`}
          onClick={() => navigate('/settings')}
        >
          <ProfilePage />

          <span>{i18n('Profile')}</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
