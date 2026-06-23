import useLocales from '@/shared/hooks/useLocales';

import StarsComposition from '@/pages/ui/StarsComposition';

import TextContainer from '@/shared/ui/TextContainer';
import Button from '@/shared/ui/Button';
import ArrowButton from '@/shared/ui/ArrowButton';

import styles from './Horoscopes.module.css';

export const Horoscopes = () => {
  const TYPES = [{ name: 'Daily' }, { name: 'Weekly' }, { name: 'Monthly' }];

  const { i18n } = useLocales();

  return (
    <div className={styles.container}>
      <StarsComposition />

      <div className={styles.content}>
        <div className={styles['content-header']}>
          {TYPES.map((type) => {
            return <Button className={styles.button}>{type.name}</Button>;
          })}
        </div>

        <TextContainer
          paragraphs={[]}
          maxHeight={80}
          maxHeightMeasure={'%'}
          className={styles.feed}
        />

        <Button>{i18n('Compose')}</Button>
      </div>

      <ArrowButton />
    </div>
  );
};
