import React from 'react';
import { Link } from 'react-router-dom';
import styles from './WelcomePage.module.scss';
import logo from './assets/trello.svg';
import hero from './assets/hero.png';

const WelcomePage = () => {
  return (
    <div className={styles.welcome_page}>
      <header className={styles.header}>
        <div className={styles.header__wrapper}>
          <Link to="/" className={styles.header__logo}>
            <img width={25} src={logo} alt="logo" />
            <span>Trello</span>
          </Link>
          <div>
            <Link to="/login">
              <button>Log in</button>
            </Link>
            <Link to="/login">
              <button>Sign up</button>
            </Link>
          </div>
        </div>
      </header>
      <div className={styles.intro}>
        <div className={styles.intro__block}>
          <div className={styles.intro__title}>Trello helps teams move work forward.</div>
          <p>
            Collaborate, manage projects, and reach new productivity peaks. From high rises to the
            home office, the way your team works is unique—accomplish it all with Trello.
          </p>
        </div>
        <img width={445} src={hero} alt="hero" />
      </div>
    </div>
  );
};

export default WelcomePage;
