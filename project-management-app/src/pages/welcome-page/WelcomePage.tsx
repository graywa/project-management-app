import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './WelcomePage.module.scss';
import logo from './assets/vezha.png';
import hero from './assets/hero.png';
import cn from 'classnames';
import { useAppSelector } from '../../redux-hooks/redux-hooks';
import { useTranslation } from 'react-i18next';
import CustomSelect from '../../components/custom-select/CustomSelect';
import { toast, ToastContainer } from 'react-toastify';

const WelcomePage = () => {
  const { errorBoard } = useAppSelector((state) => state.boards);
  const { errorColumn } = useAppSelector((state) => state.columns);
  const { isAuth } = useAppSelector((state) => state.auth);
  const [scroll, setScroll] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const scrollHandler = () => {
      setScroll(window.scrollY > 50);
    };

    window.addEventListener('scroll', scrollHandler);
  }, []);

  useEffect(() => {
    if (errorBoard === 'Unauthorized') {
      toast.error(errorBoard, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
    if (errorColumn === 'Unauthorized') {
      toast.error(errorColumn, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  }, [errorBoard, errorColumn]);

  return (
    <div className={styles.welcome_page}>
      <ToastContainer />
      <div className={cn(styles.header_wrapper, { [styles.scroll]: scroll })}>
        <header className={styles.header}>
          <Link to="/" className={styles.header__logo}>
            <img width={40} src={logo} alt="logo" />
            <span>Vezha</span>
          </Link>
          <div className={styles.btn_wrapper}>
            {isAuth ? (
              <div>
                <Link to="/main">
                  <button>{t('go_main')}</button>
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button>{t('log_in')}</button>
                </Link>
                <Link to="/registration">
                  <button>{t('sign_up')}</button>
                </Link>
              </>
            )}
            <CustomSelect />
          </div>
        </header>
      </div>
      <div className={styles.intro}>
        <div className={styles.intro__block}>
          <div className={styles.intro__title}>{t('title1')}</div>
          <p>{t('description')}</p>
        </div>
        <img src={hero} alt="hero" />
      </div>
    </div>
  );
};

export default WelcomePage;
