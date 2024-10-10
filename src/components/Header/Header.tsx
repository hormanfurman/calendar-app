import React from 'react';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.searchBar}>
        <input type="text" placeholder="Search transactions, invoices or help" />
      </div>
      <div className={styles.userInfo}>
        <span className={styles.userName}>John Doe</span>
        <div className={styles.userAvatar}></div>
      </div>
    </header>
  );
};

export default Header;
