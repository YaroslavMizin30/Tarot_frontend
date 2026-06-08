import TextContainer from '@/shared/ui/TextContainer';
import ArrowButton from '@/shared/ui/ArrowButton';

import { TERMS_OF_SERVICE_LINES } from '../config/terms';

import styles from './UserAgreement.module.css';
import useLocales from '@/shared/hooks/useLocales';

const UserAgreement = (props: { onBackButtonClick: () => void }) => {
  const { onBackButtonClick } = props;

  const { i18n } = useLocales();

  return (
    <>
      <div className={styles.container}>
        <TextContainer
          title={i18n('Terms of Service and Privacy Policy for the TAROTOPIA App')}
          paragraphs={TERMS_OF_SERVICE_LINES}
          maxHeight={100}
          maxHeightMeasure={'%'}
          className={styles.agreement}
        />
      </div>

      <ArrowButton className={styles.arrow} onClick={onBackButtonClick} />
    </>
  );
};

export default UserAgreement;
