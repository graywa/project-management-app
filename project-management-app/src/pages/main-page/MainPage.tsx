import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MainPage.module.scss';

const MainPage = () => {
  return (
    <div className={styles.page}>
      <h3>Main Page</h3>
      <div>
        <Link to="/">
          <button>Go to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
