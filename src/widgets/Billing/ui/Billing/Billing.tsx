import { useState } from 'react';

import { TARIFFS, type Tariff } from '@/entities/Billing';
import TextContainer from '@/shared/ui/TextContainer';

import { DESCRIPTION } from '../../config/description';
import TariffSelection from '../TariffSelection/TariffSelection';
import PaymentSelection from '../PaymentSelection/PaymentSelection';

import styles from './Billing.module.css';

export const Billing = () => {
  const [tariff, setTariff] = useState<Tariff | null>(null);

  const handleTariffSelect = (trf: Tariff) => {
    setTariff(trf);
  };

  const renderContent = () => {
    if (tariff) {
      return (
        <PaymentSelection
          onBackButtonClick={() => setTariff(null)}
          tariff={tariff}
        />
      );
    }

    return (
      <TariffSelection onTariffSelect={handleTariffSelect} tariffs={TARIFFS} />
    );
  };

  return (
    <div className={styles.container}>
      <TextContainer
        paragraphs={DESCRIPTION}
        maxHeight={200}
        maxHeightMeasure={'px'}
      />

      {renderContent()}
    </div>
  );
};
