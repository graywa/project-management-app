import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deleteBoard, getBoards } from '../../api/boards';
import Header from '../../components/header/Header';
import LoadingAnimation from '../../components/loading-animation/LoadingAnimation';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import styles from './MainPage.module.scss';
import board from './assets/board.svg';

const MainPage = () => {
  const { boards, isLoading } = useAppSelector((state) => state.boards);
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!boards.length) {
      dispatch(getBoards(token));
    }
  }, [boards.length]);

  return (
    <div className={styles.main}>
      <Header />

      <div className={styles.boards_wrapper}>
        <h2>Boards</h2>
        <div className={styles.boards}>
          {isLoading && <LoadingAnimation />}

          {!!boards.length
            ? boards?.map(({ id, title }) => {
                return (
                  <div key={id} className={styles.board}>
                    <Link to="/board">
                      <img width={40} src={board} alt="board" />
                      {title}
                    </Link>
                    <button
                      disabled={isLoading}
                      onClick={() => dispatch(deleteBoard({ token, id }))}
                    >
                      Delete
                    </button>
                  </div>
                );
              })
            : 'Boards not found'}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
