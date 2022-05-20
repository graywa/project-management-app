import React, { FC, useState } from 'react';
import styles from './Task.module.scss';
import { ITask } from '../../models/ITask';
import ConfirmModal from '../confirm-modal/ConfirmModal';
import TaskChangeModal from '../task-modal-change/TaskChangeModal';
import refactorIcon from './assets/pencil.png';
import deleteIcon from './assets/delete.png';

interface IProps {
  task: ITask;
  index: number;
}

const Task: FC<IProps> = ({ task, index }) => {
  const { title, description, boardId, columnId, id: taskId } = task;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenChangeTaskModal, setIsOpenChangeTaskModal] = useState(false);

  return (
    <div className={styles.task}>
      <div className={styles.taskHead}>
        <h3 className={styles.title}>{`${index + 1}) ${title}`}</h3>
        <div className={styles.refactor_delete}>
          <div className={styles.refactor} onClick={() => setIsOpenChangeTaskModal(true)}>
            <img src={refactorIcon} alt="refactor icon" />
          </div>
          <div className={styles.delete} onClick={() => setIsOpenModal(true)}>
            <img src={deleteIcon} alt="delete icon" />
          </div>
        </div>
        <ConfirmModal
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          action={'delete_task'}
          data={{ boardId, columnId, taskId }}
        />
      </div>
      <p className={styles.description}>{description}</p>
      <TaskChangeModal
        task={task}
        isOpenChangeTaskModal={isOpenChangeTaskModal}
        setIsOpenChangeTaskModal={setIsOpenChangeTaskModal}
        numberTask={index + 1}
      />
    </div>
  );
};

export default Task;
