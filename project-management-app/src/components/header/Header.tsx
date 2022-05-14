import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import logo from './../../pages/welcome-page/assets/trello.svg';
import CustomSelect from '../custom-select/CustomSelect';
import BoardModal from '../board-modal/BoardModal';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { changeIsAuth } from '../../store/authSlice';

const Header = () => {
  const [scroll, setScroll] = useState(false);
  const [isOpenBoard, setIsOpenBoard] = useState(false);
  const dispatch = useAppDispatch();
  const { login } = useAppSelector((state) => state.auth);

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
          <span>Trello</span>
        </Link>
        <div className={styles.header__btns}>
          <span>{login}</span>
          <button>
            <Link to="/profile">Edit profile</Link>
          </button>
          <button onClick={signOutHandler}>Sign out</button>
          <button onClick={() => setIsOpenBoard(true)}>Create new board</button>
          <BoardModal isOpenBoard={isOpenBoard} setIsOpenBoard={setIsOpenBoard} />
          <CustomSelect />
        </div>
      </header>
    </div>
  );
};

export default Header;
