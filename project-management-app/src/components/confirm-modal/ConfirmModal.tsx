import React, { FC } from 'react';
import styles from './ConfirmModal.module.scss';
import cn from 'classnames';
import { useAppDispatch } from '../../redux-hooks/redux-hooks';
import { deleteColumn } from '../../api/columns';
import { deleteBoard } from '../../api/boards';
import { deleteUser } from '../../api/auth';
import { IUser } from './../../models/IUser';
import { IBoard } from './../../models/IBoard';
import { deleteTask } from '../../api/tasks';
import { useTranslation } from 'react-i18next';
import { IColumn } from '../../models/IColumn';
import { ITask } from '../../models/ITask';

interface IColumnData {
  boardId: string;
  columnId: string;
  columns: IColumn[];
}
interface ITaskData {
  boardId: string;
  columnId: string;
  taskId: string;
  tasks: ITask[];
}

type IData = IBoard | IColumnData | IUser | ITaskData;

interface IProps {
  isOpenModal: boolean;
  setIsOpenModal: (val: boolean) => void;
  data: IData;
  action: 'delete_board' | 'delete_column' | 'delete_user' | 'delete_task';
}

const ConfirmModal: FC<IProps> = ({ isOpenModal, setIsOpenModal, data, action }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const clickHandler = async () => {
    if (action === 'delete_board') dispatch(deleteBoard(data as IBoard));
    if (action === 'delete_column') dispatch(deleteColumn(data as IColumnData));
    if (action === 'delete_user') dispatch(deleteUser(data as IUser));
    if (action === 'delete_task') dispatch(deleteTask(data as ITaskData));
    setIsOpenModal(false);
  };

  return (
    <div
      className={cn(styles.modal, { [styles.open]: isOpenModal })}
      onClick={() => setIsOpenModal(false)}
    >
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        <h3>{t('really_delete')}?</h3>
        <div className={styles.sub_btn}>
          <button className={styles.buttonDelete} onClick={clickHandler}>
            {t('delete')}
          </button>
          <button className={styles.buttonDelete} onClick={() => setIsOpenModal(false)}>
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
