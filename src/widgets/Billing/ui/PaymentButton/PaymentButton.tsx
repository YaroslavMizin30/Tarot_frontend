import useLocales from '@/shared/hooks/useLocales';

import type { PaymentButtonProps } from './PaymentButton.props';

import styles from './PaymentButton.module.css';

const PaymentButton = (props: PaymentButtonProps) => {
  const { price, paymentPhrase, icon, currency, code, onClick } = props;

  const { i18n } = useLocales();

  const handlePaymentButtonClick = () => {
    onClick(code);
  };

  return (
    <div className={styles.button} onClick={handlePaymentButtonClick}>
      <div className={styles.info}>
        {`${i18n('Pay')} ${price}`}&nbsp;
        {currency}&nbsp;{i18n(paymentPhrase)}
      </div>

      <div className={styles.icon}>{icon}</div>
    </div>
  );
};

export default PaymentButton;
