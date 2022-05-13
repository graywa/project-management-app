import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/header/Header';
import styles from './MainPage.module.scss';

const MainPage = () => {
  return (
    <div className={styles.main}>
      <Header />
      <h3>Main Page</h3>
      <div>
        <Link to="/">
          <button>Go to Home</button>
        </Link>
        <div></div>
      </div>
    </div>
  );
};

export default MainPage;
