import { type FC } from 'react';

import Torch from '@/shared/ui/Torch/ui/Torch';

import styles from './TorchComposition.module.css';

const TorchComposition: FC = () => {
  return (
    <div className={styles.composition}>
      <Torch
        style={{
          position: 'absolute',
          top: '51%',
          width: '30px',
          height: '73px',
          left: '51%',
        }}
        delay={'1s'}
      />

      <Torch
        style={{
          position: 'absolute',
          top: '42%',
          width: '30px',
          height: '100px',
          right: '20%',
        }}
        delay={'5s'}
      />

      <Torch
        style={{
          position: 'absolute',
          top: '43%',
          width: '30px',
          height: '120px',
          left: '46%',
        }}
        delay={'1s'}
      />

      <Torch
        style={{
          position: 'absolute',
          top: '46%',
          width: '30px',
          height: '110px',
          left: '43%',
        }}
        delay={'3s'}
      />

      <Torch
        style={{
          position: 'absolute',
          top: '46%',
          width: '30px',
          height: '120px',
          right: '4%',
        }}
        delay={'1s'}
      />

      <Torch
        style={{
          position: 'absolute',
          top: '46%',
          width: '40px',
          left: '22%',
          height: '130px',
        }}
        delay={'3s'}
      />
      <Torch
        style={{
          position: 'absolute',
          top: '47%',
          width: '40px',
          right: '10%',
        }}
        delay={'10s'}
      />
      <Torch
        style={{
          position: 'absolute',
          top: '47%',
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
          top: '51%',
          width: '70px',
          height: '170px',
          left: '10%',
        }}
        delay={'15s'}
      />
      <Torch
        style={{
          position: 'absolute',
          top: '55%',
          width: '72px',
          height: '148px',
          right: '17%',
        }}
        delay={'2s'}
      />
    </div>
  );
};

export default TorchComposition;
