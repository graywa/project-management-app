import React from 'react';
import AppRouter from '../components/app-router/AppRouter';
import Footer from '../components/footer/Footer';
import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.content_wrapper}>
        <AppRouter />
      </div>
      <Footer />
    </div>
  );
}

export default App;
