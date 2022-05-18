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
import { toast, ToastContainer } from 'react-toastify';
import { resetCreateNewBoard } from '../../store/boardsSlice';

const MainPage = () => {
  const { boards, isLoading, isCreateBoard, errorBoard } = useAppSelector((state) => state.boards);
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    if (!boards.length) {
      dispatch(getBoards(token));
    }
  }, [boards.length]);

  useEffect(() => {
    if (isCreateBoard) {
      toast.success('New board created', {
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
    }
  }, [isCreateBoard, errorBoard]);

  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.boards_wrapper}>
        <ToastContainer />
        <h2>{t('boards')}</h2>
        <div className={styles.boards}>
          {isLoading && <LoadingAnimation />}
          {!!boards.length
            ? boards?.map(({ id, title }) => {
                return (
                  <div key={id} className={styles.board}>
                    <Link to="/board" onClick={() => dispatch(changeBoardId(id))}>
                      <img width={40} src={board} alt="board" />
                      {title}
                    </Link>
                    <button disabled={isLoading} onClick={() => setIsOpenModal(true)}>
                      {t('delete')}
                    </button>
                    <ConfirmModal
                      isOpenModal={isOpenModal}
                      setIsOpenModal={setIsOpenModal}
                      action={'delele_board'}
                      data={{ token, id }}
                    />
                  </div>
                );
              })
            : `${t('boards_not_found')}`}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
