import type { FC } from 'react';
import TariffButton from '../TariffButton/TariffButton';

import type { TariffSelectionProps } from './TariffSelection.props';

import styles from './Tariffselection.module.css';

const TariffSelection: FC<TariffSelectionProps> = (props) => {
  const { tariffs, onTariffSelect } = props;

  return (
    <div className={styles.selection}>
      {tariffs.map((tariff, index) => {
        const handleTariffSelect = () => {
          onTariffSelect(tariff);
        };

        return (
          <TariffButton
            key={tariff.productCode}
            {...tariff}
            className={styles[`button${index}`]}
            onTariffSelect={handleTariffSelect}
          />
        );
      })}
    </div>
  );
};

export default TariffSelection;
