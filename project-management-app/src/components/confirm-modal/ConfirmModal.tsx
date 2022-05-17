import React, { FC } from 'react';
import styles from './ConfirmModal.module.scss';
import cn from 'classnames';
import { useAppDispatch } from '../../redux-hooks/redux-hooks';
import { deleteColumn } from '../../api/columns';
import { deleteBoard } from '../../api/boards';

interface IBoardData {
  token: string;
  id: string;
}

interface IColumnData {
  boardId: string;
  columnId: string;
}

type IData = IBoardData | IColumnData;

interface IProps {
  isOpenModal: boolean;
  setIsOpenModal: (val: boolean) => void;
  data: IData;
  action: 'delele_board' | 'delele_column';
}

const ConfirmModal: FC<IProps> = ({ isOpenModal, setIsOpenModal, data, action }) => {
  const dispatch = useAppDispatch();

  const clickHandler = () => {
    if (action === 'delele_board') dispatch(deleteBoard(data as IBoardData));
    if (action === 'delele_column') dispatch(deleteColumn(data as IColumnData));
    setIsOpenModal(false);
  };

  return (
    <div
      className={cn(styles.modal, { [styles.open]: isOpenModal })}
      onClick={() => setIsOpenModal(false)}
    >
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        <h3>really delete?</h3>
        <div className={styles.sub_btn}>
          <button className={styles.buttonDelete} onClick={clickHandler}>
            Delete
          </button>
          <button className={styles.buttonDelete} onClick={() => setIsOpenModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
