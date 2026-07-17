import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import useLocales from '@/shared/hooks/useLocales';
import Billing from '@/widgets/Billing';
import TRANSLATIONS_EN from '@/shared/locales/en/billing';
import TRANSLATIONS_RU from '@/shared/locales/ru/billing';

import {
  BILLING_REDIRECT_STATE_KEY,
  type BillingRedirectState,
} from '@/features/Billing/model/useBalance';

import styles from './BillingPage.module.css';

const isBillingRedirectState = (
  state: unknown,
): state is BillingRedirectState => {
  if (!state || typeof state !== 'object') {
    return false;
  }

  return BILLING_REDIRECT_STATE_KEY in state;
};

export const BillingPage = () => {
  const { addTranslations, locale, i18n } = useLocales();

  const location = useLocation();
  const navigate = useNavigate();

  const redirectState = isBillingRedirectState(location.state)
    ? location.state
    : null;

  const insufficient = redirectState?.[BILLING_REDIRECT_STATE_KEY] ?? null;

  const handlePaymentSuccess = () => {
    if (insufficient?.returnTo) {
      navigate(insufficient.returnTo, { replace: true });
    }
  };

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  return (
    <div className={styles.page}>
      {insufficient && (
        <div className={styles.notice} role={"alert"}>
          <h3 className={styles.noticeTitle}>
            {i18n('insufficient_balance_title')}
          </h3>

          <p className={styles.noticeMessage}>
            {i18n('insufficient_balance_message')
              .replace('{required}', String(insufficient.required))
              .replace('{current}', String(insufficient.current))}
          </p>
        </div>
      )}

      <Billing onPaymentSuccess={handlePaymentSuccess} />
    </div>
  );
};
