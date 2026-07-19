import { useNavigate } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';

import styles from './ProfileServices.module.css';

const InfoIcon = () => (
  <svg aria-hidden={true} viewBox={'0 0 24 24'}>
    <circle cx={'12'} cy={'12'} r={'8.5'} />
    <path d={'M12 10.7v5.5M12 7.6h.01'} />
  </svg>
);

const FeedbackIcon = () => (
  <svg aria-hidden={true} viewBox={'0 0 24 24'}>
    <path d={'M5 5.5h14v10H10l-4.5 3v-3H5v-10Z'} />
    <path d={'M8 9h8M8 12h5'} />
  </svg>
);

const DocumentsIcon = () => (
  <svg aria-hidden={true} viewBox={'0 0 24 24'}>
    <path d={'M7 3.5h7l3 3v14H7v-17Z'} />
    <path d={'M14 3.5v3h3M9.5 11h5M9.5 14h5M9.5 17h3'} />
  </svg>
);

export const ProfileServices = () => {
  const navigate = useNavigate();
  const { i18n } = useLocales();

  const openSection = (section?: 'rate the app' | 'user agreement') => {
    navigate('/about-app', {
      state: {
        returnTo: '/settings',
        section,
      },
    });
  };

  return (
    <nav className={styles.container} aria-label={i18n('Profile links')}>
      <button onClick={() => openSection()} type={'button'}>
        <InfoIcon />
        <span>{i18n('About App')}</span>
      </button>

      <button onClick={() => openSection('rate the app')} type={'button'}>
        <FeedbackIcon />
        <span>{i18n('Feedback')}</span>
      </button>

      <button onClick={() => openSection('user agreement')} type={'button'}>
        <DocumentsIcon />
        <span>{i18n('Documents')}</span>
      </button>
    </nav>
  );
};

export default ProfileServices;
