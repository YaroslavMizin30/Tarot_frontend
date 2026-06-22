import { type FC } from 'react';

import Torch from '@/shared/ui/Torch/ui/Torch';

import type { TorchCompositionProps } from './TorchComposition.props';

import styles from './TorchComposition.module.css';

const TorchComposition: FC<TorchCompositionProps> = (props) => {
  const { className } = props;

  return (
    <div className={className}>
      <div className={styles.composition}>
        <Torch
          style={{
            position: 'absolute',
            top: '38%',
            width: '30px',
            height: '120px',
            left: '35%',
          }}
          delay={'1s'}
        />

        <Torch
          style={{
            position: 'absolute',
            top: '40%',
            width: '40px',
            left: '15%',
          }}
          delay={'3s'}
        />
        <Torch
          style={{
            position: 'absolute',
            top: '40%',
            width: '40px',
            right: '10%',
          }}
          delay={'10s'}
        />
        <Torch
          style={{
            position: 'absolute',
            top: '50%',
            width: '55px',
            left: '5%',
          }}
        />
        <Torch
          style={{
            position: 'absolute',
            top: '50%',
            width: '55px',
            right: '5%',
          }}
          delay={'7s'}
        />
        <Torch
          style={{
            position: 'absolute',
            top: '60%',
            width: '70px',
            height: '170px',
            left: '10%',
          }}
          delay={'15s'}
        />
        <Torch
          style={{
            position: 'absolute',
            top: '63%',
            width: '72px',
            height: '174px',
            right: '17%',
          }}
          delay={'2s'}
        />
      </div>
    </div>
  );
};

export default TorchComposition;
