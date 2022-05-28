import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import cn from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import CustomSelect from '../custom-select/CustomSelect';
import BoardModal from '../board-modal/BoardModal';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { changeIsAuth } from '../../store/authSlice';
import { useTranslation } from 'react-i18next';
import ColumnModal from '../column-modal/ColumnModal';
import logo from './../../pages/welcome-page/assets/vezha.png';
import user from './assets/user.png';

const Header = () => {
  const [scroll, setScroll] = useState(false);
  const [isOpenBoard, setIsOpenBoard] = useState(false);
  const [isOpenColumn, setIsOpenColumn] = useState(false);
  const [isOpenBurgerMenu, setIsOpenBurgerMenu] = useState(true);
  const dispatch = useAppDispatch();
  const { login } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const { pathname } = useLocation();

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
        <Link to="/main" className={styles.header__logo} title={t('go_main')}>
          <img width={26} src={logo} alt="logo" />
          <span className={styles.logo}>Vezha</span>
        </Link>
        <Link to="/profile" className={styles.login} title={t('profile')}>
          <img width={50} src={user} alt="user" />
          {login}
        </Link>
        <div className={styles.header__btns}>
          <button>
            <Link to="/profile">{t('edit_profile')}</Link>
          </button>
          <button onClick={signOutHandler}>{t('sign_out')}</button>
          <button
            onClick={() =>
              pathname.includes('/board') ? setIsOpenColumn(true) : setIsOpenBoard(true)
            }
          >
            {pathname.includes('/board') ? t('add_column') : t('create_new_board')}
          </button>
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
          className={cn(styles['burger-modal'], {
            [styles['hidden']]: isOpenBurgerMenu,
          })}
          onClick={() => setIsOpenBurgerMenu(true)}
        >
          <div
            className={cn(styles['burger-menu'], {
              [styles['burger-menu_hidden']]: isOpenBurgerMenu,
            })}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles['burger-menu__btns']}>
              <button onClick={() => setIsOpenBurgerMenu(true)}>
                <Link to="/profile">{t('edit_profile')}</Link>
              </button>
              <button onClick={() => (signOutHandler(), setIsOpenBurgerMenu(true))}>
                {t('sign_out')}
              </button>
              <button
                onClick={() =>
                  pathname.includes('/board')
                    ? (setIsOpenColumn(true), setIsOpenBurgerMenu(true))
                    : (setIsOpenBoard(true), setIsOpenBurgerMenu(true))
                }
              >
                {pathname.includes('/board') ? t('add_column') : t('create_new_board')}
              </button>
              <CustomSelect />
            </div>
          </div>
        </div>
        <BoardModal isOpenBoard={isOpenBoard} setIsOpenBoard={setIsOpenBoard} />
        <ColumnModal isOpenColumn={isOpenColumn} setIsOpenColumn={setIsOpenColumn} />
      </header>
    </div>
  );
};

export default Header;
