import useLocales from '@/shared/hooks/useLocales';
import { usePayment } from '@/features/Billing';

import type { PaymentButtonProps } from './PaymentButton.props';

import styles from './PaymentButton.module.css';

const PaymentButton = (props: PaymentButtonProps) => {
  const {
    price,
    paymentPhrase,
    icon,
    currency,
    provider,
    onClick,
    productCode,
  } = props;

  const { i18n } = useLocales();

  const { pay, isLoading, status } = usePayment({
    method: {
      provider,
      productCode,
    },
    onSuccess: () => onClick(provider),
  });

  const handlePaymentButtonClick = () => {
    // Любой поддерживаемый бэкендом метод оплаты идёт через универсальный флоу.
    return pay();
  };

  return (
    <button
      type={'button'}
      className={styles.button}
      onClick={handlePaymentButtonClick}
      disabled={isLoading}
    >
      <div>
        <div className={styles.info}>
          {`${i18n('Pay')} ${price}`}&nbsp;
          {currency}&nbsp;{i18n(paymentPhrase)}
        </div>
        {status && (
          <div className={styles.status}>
            {i18n(
              status === 'paid'
                ? 'payment_success'
                : status === 'cancelled'
                  ? 'payment_cancelled'
                  : status === 'failed' || status === 'expired'
                    ? 'payment_failed'
                    : status === 'unsupported'
                      ? 'payment_unsupported'
                      : status === 'network_error'
                        ? 'payment_error'
                        : 'payment_pending',
            )}
          </div>
        )}
      </div>

      <div className={styles.icon}>{icon}</div>
    </button>
  );
};

export default PaymentButton;
