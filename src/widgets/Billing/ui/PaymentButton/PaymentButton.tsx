import useLocales from '@/shared/hooks/useLocales';
import { usePayment } from '@/features/Billing';

import type { PaymentButtonProps } from './PaymentButton.props';

import styles from './PaymentButton.module.css';

const PaymentButton = (props: PaymentButtonProps) => {
  const { price, paymentPhrase, icon, currency, code, onClick, amount } = props;

  const { i18n } = useLocales();

  const { pay, isLoading } = usePayment({
    method: {
      code,
      amount,
      price,
      currency: typeof currency === 'string' ? currency : 'XTR',
    },
    onSuccess: () => onClick(code),
  });

  const handlePaymentButtonClick = () => {
    // Любой поддерживаемый бэкендом метод оплаты идёт через универсальный флоу.
    return pay();
  };

  return (
    <div
      className={styles.button}
      onClick={handlePaymentButtonClick}
      style={{
        opacity: isLoading ? 0.6 : 1,
        pointerEvents: isLoading ? 'none' : 'auto',
      }}
    >
      <div className={styles.info}>
        {`${i18n('Pay')} ${price}`}&nbsp;
        {currency}&nbsp;{i18n(paymentPhrase)}
      </div>

      <div className={styles.icon}>{icon}</div>
    </div>
  );
};

export default PaymentButton;
