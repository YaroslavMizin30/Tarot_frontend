import React, { type FC } from 'react';

import Button from '@/shared/ui/Button';
import useLocales from '@/shared/hooks/useLocales';

import type { ThemeProps } from './Themes.props';

import styles from './Themes.module.css';

const Themes: FC<ThemeProps> = (props) => {
  const { onThemeChoose, themes } = props;

  const { i18n } = useLocales();

  return (
    <>
      <h3 className={styles.title}>{i18n('Topics')}</h3>

      {themes.map((theme) => {
        const { questions, name } = theme;

        const handleThemeChoose = () => {
          onThemeChoose({ questions, name: i18n(name) });
        };

        return <Button onClick={handleThemeChoose}>{i18n(name)}</Button>;
      })}
    </>
  );
};

export default Themes;
