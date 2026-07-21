import { useMemo, useState } from 'react';

import {
  toTariffs,
  type Tariff,
  usePaymentCatalog,
} from '@/entities/Billing';
import TextContainer from '@/shared/ui/TextContainer';
import useLocales from '@/shared/hooks/useLocales';
import Spinner from '@/shared/ui/Spinner';

import TariffSelection from '../TariffSelection/TariffSelection';
import PaymentSelection from '../PaymentSelection/PaymentSelection';

import styles from './Billing.module.css';

export const Billing = (props: { onPaymentSuccess?: () => void }) => {
  const { onPaymentSuccess } = props;
  const [tariff, setTariff] = useState<Tariff | null>(null);
  const { i18n } = useLocales();
  const { products, isLoading, error, refetch } = usePaymentCatalog();
  const tariffs = useMemo(() => toTariffs(products), [products]);

  const handleTariffSelect = (trf: Tariff) => {
    setTariff(trf);
  };

  const renderContent = () => {
    if (tariff) {
      return (
        <PaymentSelection
          onBackButtonClick={() => setTariff(null)}
          onPaymentSuccess={onPaymentSuccess}
          tariff={tariff}
        />
      );
    }

    if (isLoading) return <Spinner size={'l'} />;
    if (error) {
      return (
        <button className={styles.retry} type={'button'} onClick={() => refetch()}>
          {i18n('billing_catalog_error')}
        </button>
      );
    }

    return (
      <TariffSelection onTariffSelect={handleTariffSelect} tariffs={tariffs} />
    );
  };

  const descriptionParagraphs = [
    i18n('desc_title'),
    i18n('desc_2'),
    i18n('desc_3'),
  ];

  return (
    <div className={styles.container}>
      <TextContainer
        paragraphs={descriptionParagraphs}
        maxHeight={200}
        maxHeightMeasure={'px'}
      />

      {renderContent()}
    </div>
  );
};
