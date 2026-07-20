import {
  useLocation,
  useNavigate,
  useNavigation,
} from 'react-router';

import { preloadPrimaryRoute } from '@/app/router/routeLoaders';

import useLocales from '@/shared/hooks/useLocales';

import TodayPage from '@/shared/assets/svg/common/home.svg';
import TarotPage from '@/shared/assets/svg/common/tarot_page.svg';
import AstrologyPage from '@/shared/assets/svg/common/astrology_page.svg';
import ProfilePage from '@/shared/assets/svg/common/profile_page.svg';

import { getPageAttachment } from '../../config/pages';
import { preloadBackdropForPath } from '../RouteTransitionBackdrop';

import styles from './Footer.module.css';

const Footer = (props: { isLoading?: boolean }) => {
  const { isLoading } = props;

  const { pathname: currentPathname } = useLocation();
  const { location: pendingLocation } = useNavigation();
  const navigate = useNavigate();
  const pathname = pendingLocation?.pathname ?? currentPathname;

  const { i18n } = useLocales();

  const preloadTarget = (pathname: string) => {
    Promise.all([
      preloadPrimaryRoute(pathname),
      preloadBackdropForPath(pathname),
    ]).catch(() => undefined);
  };

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
          onPointerDown={() => {
            preloadTarget('/');
          }}
        >
          <TodayPage className={styles.homeIcon} />

          <span>{i18n('Home')}</span>
        </button>

        <button
          type={'button'}
          className={`${styles.section} ${getPageAttachment('tarot', pathname) ? styles.active : ''}`}
          onClick={() => navigate('/tarot')}
          onPointerDown={() => {
            preloadTarget('/tarot');
          }}
        >
          <TarotPage />

          <span>{i18n('Tarot')}</span>
        </button>

        <button
          type={'button'}
          className={`${styles.section} ${getPageAttachment('astrology', pathname) ? styles.active : ''}`}
          onClick={() => navigate('/astrology')}
          onPointerDown={() => {
            preloadTarget('/astrology');
          }}
        >
          <AstrologyPage />

          <span>{i18n('Astrology')}</span>
        </button>

        <button
          type={'button'}
          className={`${styles.section} ${getPageAttachment('profile', pathname) ? styles.active : ''}`}
          onClick={() => navigate('/settings')}
          onPointerDown={() => {
            preloadTarget('/settings');
          }}
        >
          <ProfilePage />

          <span>{i18n('Profile')}</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
