import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout/Layout';
import Calendar from './components/Calendar/Calendar';
import styles from './App.module.scss';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Layout>
        <div className={styles.calendarContainer}>
          <Calendar />
        </div>
      </Layout>
    </Provider>
  );
};

export default App;
