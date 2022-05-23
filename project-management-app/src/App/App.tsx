import React from 'react';
import AppRouter from '../components/app-router/AppRouter';
import Footer from '../components/footer/Footer';
import styles from './App.module.scss';
import background from './assets/Belarus_Castles_Sky.jpg';

function App() {
  return (
    <div className={styles.app}>
      <img className={styles.background} src={background} alt="background image" />
      <div className={styles.content_wrapper}>
        <AppRouter />
      </div>
      <Footer />
    </div>
  );
}

export default App;
