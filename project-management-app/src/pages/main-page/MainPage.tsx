import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBoards } from '../../api/boards';
import Header from '../../components/header/Header';
import LoadingAnimation from '../../components/loading-animation/LoadingAnimation';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { changeBoardId } from '../../store/columnsSlice';
import styles from './MainPage.module.scss';
import board from './assets/board.svg';
import { useTranslation } from 'react-i18next';
import ConfirmModal from '../../components/confirm-modal/ConfirmModal';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { resetCreateNewBoard, resetNewBoardError } from '../../store/boardsSlice';

const MainPage = () => {
  const { boards, isLoading, isCreateBoard, errorBoard } = useAppSelector((state) => state.boards);
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [targetId, setTargetId] = useState('');

  useEffect(() => {
    if (!boards.length) {
      dispatch(getBoards(token));
    }
  }, [boards.length]);

  useEffect(() => {
    if (isCreateBoard) {
      toast.success(t('new_board_created'), {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
      dispatch(resetCreateNewBoard());
    }
    if (errorBoard !== 'Unauthorized' && errorBoard !== '') {
      toast.error(errorBoard, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
      dispatch(resetNewBoardError());
    }
  }, [isCreateBoard, errorBoard]);

  const deleteHandler = (id: string) => {
    setTargetId(id);
    setIsOpenModal(true);
  };

  return (
    <div className={styles.main}>
      <Header />
      <ToastContainer />
      <div className={styles.boards_wrapper}>
        <ToastContainer />
        <h1>{t('boards')}</h1>
        <div className={styles.boards}>
          {isLoading && <LoadingAnimation />}
          {!!boards.length ? (
            boards?.map(({ id, title }) => {
              return (
                <div key={id} className={styles.board}>
                  <Link to={`/board/${id}`} onClick={() => dispatch(changeBoardId(id))}>
                    <img width={40} src={board} alt="board" />
                    {title}
                  </Link>
                  <button disabled={isLoading} onClick={() => deleteHandler(id)}>
                    {t('delete')}
                  </button>
                </div>
              );
            })
          ) : (
            <h4>{t('boards_not_found')}</h4>
          )}
          <ConfirmModal
            isOpenModal={isOpenModal}
            setIsOpenModal={setIsOpenModal}
            action={'delete_board'}
            data={{ token, id: targetId }}
          />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
