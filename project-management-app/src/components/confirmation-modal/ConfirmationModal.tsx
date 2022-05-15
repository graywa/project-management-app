import React, { FC } from 'react';
import styles from './ConfirmationModal.module.scss';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { deleteColumn } from '../../api/columns';

interface IProps {
  isOpenConfirmationModal: boolean;
  setIsOpenConfirmationModal: (val: boolean) => void;
  columnId: string;
}

const ConfirmationModal: FC<IProps> = ({
  isOpenConfirmationModal,
  setIsOpenConfirmationModal,
  columnId,
}) => {
  const dispatch = useAppDispatch();
  const { boardId } = useAppSelector((state) => state.columns);

  return (
    <div
      className={cn(styles.modal, { [styles.open]: isOpenConfirmationModal })}
      onClick={() => setIsOpenConfirmationModal(false)}
    >
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        <h3>really delete?</h3>
        <div className={styles.sub_btn}>
          <button
            className={styles.buttonDelete}
            onClick={() => {
              dispatch(deleteColumn({ boardId: boardId, columnId: columnId }));
              setIsOpenConfirmationModal(false);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
