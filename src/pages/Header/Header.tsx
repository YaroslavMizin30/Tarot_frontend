import React from 'react';
import { Link } from 'react-router';

import Button from '@/shared/ui/Button';

import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to={'/'}>
        <Button>Main</Button>
      </Link>

      <Link to={'/reading'}>
        <Button>Reading</Button>
      </Link>

      <Link to={'/history'}>
        <Button>History</Button>
      </Link>
    </header>
  );
};

export default Header;
