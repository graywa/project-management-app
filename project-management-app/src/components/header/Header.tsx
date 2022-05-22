import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import logo from './../../pages/welcome-page/assets/trello.svg';
import CustomSelect from '../custom-select/CustomSelect';
import BoardModal from '../board-modal/BoardModal';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { changeIsAuth } from '../../store/authSlice';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [scroll, setScroll] = useState(false);
  const [isOpenBoard, setIsOpenBoard] = useState(false);
  const [isOpenBurgerMenu, setIsOpenBurgerMenu] = useState(true);
  const dispatch = useAppDispatch();
  const { login } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();

  useEffect(() => {
    const scrollHandler = () => {
      setScroll(window.scrollY > 50);
    };

    window.addEventListener('scroll', scrollHandler);
  }, []);

  const signOutHandler = () => {
    localStorage.setItem('token', '');
    dispatch(changeIsAuth(false));
  };

  return (
    <div className={cn(styles.header_wrapper, { [styles.scroll]: scroll })}>
      <header className={styles.header}>
        <Link to="/main" className={styles.header__logo}>
          <img width={25} src={logo} alt="logo" />
          <span className={styles.logo}>Trello</span>
        </Link>
        <span className={styles.login}>{login}</span>
        <div className={styles.header__btns}>
          <button>
            <Link to="/profile">{t('edit_profile')}</Link>
          </button>
          <button onClick={signOutHandler}>{t('sign_out')}</button>
          <button onClick={() => setIsOpenBoard(true)}>{t('create_new_board')}</button>
          <CustomSelect />
        </div>
        <div
          className={cn(styles['burger-btn'], {
            [styles['burger-btn_animation']]: isOpenBurgerMenu,
          })}
          onClick={() => setIsOpenBurgerMenu(!isOpenBurgerMenu)}
        >
          <span></span>
        </div>
        <div
          className={cn(styles['burger-menu'], {
            [styles['burger-menu_hidden']]: isOpenBurgerMenu,
          })}
        >
          <div className={styles['burger-menu__btns']}>
            <button onClick={() => setIsOpenBurgerMenu(true)}>
              <Link to="/profile">{t('edit_profile')}</Link>
            </button>
            <button onClick={() => (signOutHandler(), setIsOpenBurgerMenu(true))}>
              {t('sign_out')}
            </button>
            <button
              onClick={() => {
                setIsOpenBurgerMenu(true);
                setIsOpenBoard(true);
              }}
            >
              {t('create_new_board')}
            </button>
            <CustomSelect />
          </div>
        </div>
        <BoardModal isOpenBoard={isOpenBoard} setIsOpenBoard={setIsOpenBoard} />
      </header>
    </div>
  );
};

export default Header;
