import React, { FC, useState } from 'react';
import styles from './Task.module.scss';
import { ITask } from '../../models/ITask';
import { useTranslation } from 'react-i18next';
import ConfirmModal from '../confirm-modal/ConfirmModal';
import TaskChangeModal from '../task-modal-change/TaskChangeModal';

interface IProps {
  task: ITask;
  index: number;
}

const Task: FC<IProps> = ({ task, index }) => {
  const { title, description, boardId, columnId, id: taskId } = task;
  const { t } = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenChangeTaskModal, setIsOpenChangeTaskModal] = useState(false);

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
          action={'delete_task'}
          data={{ boardId, columnId, taskId }}
        />
      </div>
      <p className={styles.description} onClick={() => setIsOpenChangeTaskModal(true)}>
        {description}
      </p>
      <TaskChangeModal
        isOpenChangeTaskModal={isOpenChangeTaskModal}
        setIsOpenChangeTaskModal={setIsOpenChangeTaskModal}
        boardId={boardId || ''}
        columnId={columnId || ''}
        taskId={taskId || ''}
      />
    </div>
  );
};

export default Task;
