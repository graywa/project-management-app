import React, { FC } from 'react';
import styles from './Task.module.scss';
import { ITask } from '../../models/ITask';
import { useAppDispatch } from '../../redux-hooks/redux-hooks';
import { deleteTask } from '../../api/tasks';

interface IProps {
  task: ITask;
  index: number;
}

const Task: FC<IProps> = ({ task, index }) => {
  const { title, description, boardId, columnId, id: taskId } = task;
  const dispatch = useAppDispatch();

  return (
    <div className={styles.task}>
      <div className={styles.taskHead}>
        <h3 className={styles.title}>{`${index + 1}) ${title}`}</h3>{' '}
        <button
          className={styles.buttonDelete}
          onClick={() => dispatch(deleteTask({ boardId, columnId, taskId }))}
        >
          delete
        </button>
      </div>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default Task;
