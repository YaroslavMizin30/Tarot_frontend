import useLocales from '@/shared/hooks/useLocales';
import Pentacle from '@/shared/ui/Pentacle';
import ArrowButton from '@/shared/ui/ArrowButton';

import PaymentButton from '../PaymentButton/PaymentButton';

import { composePaymentMethods } from '../../lib/formPaymentMethod';

import type { PaymentSelectionProps } from './PaymentSelection.props';

import styles from './PaymentSelection.module.css';

const PaymentSelection = (props: PaymentSelectionProps) => {
  const { tariff, onBackButtonClick } = props;

  const { prices, amount } = tariff;

  const paymentMethods = composePaymentMethods(prices);

  const { i18n } = useLocales();

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        {i18n('Buying')}&nbsp;
        {amount}&nbsp;
        {i18n('coins')}&nbsp;
        <Pentacle />
      </h3>

      <div className={styles.buttons}>
        {paymentMethods.map((method) => {
          const { code } = method;

          return (
            <PaymentButton
              onClick={() => undefined}
              key={code}
              amount={amount}
              {...method}
            />
          );
        })}
      </div>

      <ArrowButton onClick={onBackButtonClick} />
    </div>
  );
};

export default PaymentSelection;
