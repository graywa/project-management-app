import React, { useEffect, useState } from 'react';
import styles from './BoardPage.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { getColumns } from '../../api/columns';
import Column from '../../components/column/Column';
import { IColumn } from '../../models/IColumn';
import Header from '../../components/header/Header';
import ColumnModal from '../../components/column-modal/ColumnModal';
import { useTranslation } from 'react-i18next';
import LoadingAnimation from '../../components/loading-animation/LoadingAnimation';
import { toast, ToastContainer } from 'react-toastify';
import { resetCreateNewColumn } from '../../store/columnsSlice';
import { resetCreateNewTask, resetUpdateTask } from '../../store/tasksSlice';

const BoardPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, columns, boardId, errorColumn, isCreateColumn } = useAppSelector(
    (state) => state.columns
  );
  const { isCreateTask, isUpdateTask, errorTask } = useAppSelector((state) => state.tasks);
  const [isOpenColumn, setIsOpenColumn] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getColumns(boardId));
  }, [columns.length]);

  useEffect(() => {
    if (isCreateColumn) {
      toast.success(t('new_column_created'), {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
      dispatch(resetCreateNewColumn());
    }
    if (isCreateTask) {
      toast.success(t('new_task_created'), {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
      dispatch(resetCreateNewTask());
    }
    if (isUpdateTask) {
      toast.success(t('update_task'), {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
      dispatch(resetUpdateTask());
    }
    if (errorColumn !== 'Unauthorized' && errorColumn !== '') {
      toast.error(errorColumn, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
    if (errorTask !== 'Unauthorized' && errorTask !== '') {
      toast.error(errorTask, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  }, [errorColumn, errorTask, isCreateColumn, isCreateTask, isUpdateTask]);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.board}>
        <ToastContainer />
        {isLoading && (
          <div className={styles.loader}>
            <LoadingAnimation />
          </div>
        )}
        {columns.map((column: IColumn, index: number) => {
          return <Column column={column} key={index} />;
        })}
        <button className={styles.buttonAddColumn} onClick={() => setIsOpenColumn(true)}>
          {t('add_column')}
        </button>
        <ColumnModal isOpenColumn={isOpenColumn} setIsOpenColumn={setIsOpenColumn} />
      </div>
    </div>
  );
};

export default BoardPage;
