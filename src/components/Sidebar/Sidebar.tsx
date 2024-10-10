import React from 'react';
import styles from './Sidebar.module.scss';

const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.logo}>IMPEKABLE</h1>
      <nav className={styles.nav}>
        <ul>
          <li>Home</li>
          <li>Dashboard</li>
          <li>Inbox</li>
          <li>Products</li>
          <li>Invoices</li>
          <li>Customers</li>
          <li>Chat Room</li>
          <li>Calendar</li>
          <li>Help Center</li>
          <li>Settings</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
