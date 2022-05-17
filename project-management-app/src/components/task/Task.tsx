import React, { FC, useState } from 'react';
import styles from './Task.module.scss';
import { ITask } from '../../models/ITask';
import { useAppDispatch } from '../../redux-hooks/redux-hooks';
import { deleteTask } from '../../api/tasks';
import { useTranslation } from 'react-i18next';
import ConfirmModal from '../confirm-modal/ConfirmModal';

interface IProps {
  task: ITask;
  index: number;
}

const Task: FC<IProps> = ({ task, index }) => {
  const { title, description, boardId, columnId, id: taskId } = task;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <div className={styles.task}>
      <div className={styles.taskHead}>
        <h3 className={styles.title}>{`${index + 1}) ${title}`}</h3>{' '}
        <button className={styles.buttonDelete} onClick={() => setIsOpenModal(true)}>
          {t('delete')}
        </button>
        <ConfirmModal
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          action={'delele_task'}
          data={{ boardId, columnId, taskId }}
        />
      </div>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default Task;
