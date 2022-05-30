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
import plus from './assets/plus.png';

const Header = () => {
  const [scroll, setScroll] = useState(false);
  const [isOpenBoard, setIsOpenBoard] = useState(false);
  const [isOpenColumn, setIsOpenColumn] = useState(false);
  const [isOpenBurgerMenu, setIsOpenBurgerMenu] = useState(true);
  const dispatch = useAppDispatch();
  const { login } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { isCreateBoard } = useAppSelector((state) => state.boards);
  const { isCreateColumn } = useAppSelector((state) => state.columns);

  useEffect(() => {
    const scrollHandler = () => {
      setScroll(window.scrollY > 50);
    };
    window.addEventListener('scroll', scrollHandler);
  }, []);

  useEffect(() => {
    setIsOpenBoard(false);
  }, [isCreateBoard]);

  useEffect(() => {
    setIsOpenColumn(false);
  }, [isCreateColumn]);

  const signOutHandler = () => {
    localStorage.setItem('token', '');
    dispatch(changeIsAuth(false));
  };

  return (
    <div className={cn(styles.header_wrapper, { [styles.scroll]: scroll })}>
      <header className={styles.header}>
        <Link to="/main" className={styles.header__logo} title={t('go_main')}>
          <img width={40} src={logo} alt="logo" />
          <span className={styles.logo}>Vezha</span>
        </Link>

        <div className={styles.header__btns}>
          {pathname.includes('/board') && (
            <button className={styles.plus_btn} onClick={() => setIsOpenColumn(true)}>
              <img width={26} src={plus} alt="plus" />
              {t('add_column')}
            </button>
          )}
          {pathname === '/main' && (
            <button className={styles.plus_btn} onClick={() => setIsOpenBoard(true)}>
              <img width={26} src={plus} alt="plus" />
              {t('create_new_board')}
            </button>
          )}

          <div className={styles.account}>
            <Link to="/profile" className={styles.login} title={t('profile')}>
              <img width={50} src={user} alt="user" />
              {login}
            </Link>
            <button onClick={signOutHandler}>{t('sign_out')}</button>
            <CustomSelect />
          </div>
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
