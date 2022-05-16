import React, { FC } from 'react';
import styles from './Task.module.scss';
import { ITask } from '../../models/ITask';
import { useAppDispatch } from '../../redux-hooks/redux-hooks';
import { deleteTask } from '../../api/tasks';
import { useTranslation } from 'react-i18next';

interface IProps {
  task: ITask;
  index: number;
}

const Task: FC<IProps> = ({ task, index }) => {
  const { title, description, boardId, columnId, id: taskId } = task;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <div className={styles.task}>
      <div className={styles.taskHead}>
        <h3 className={styles.title}>{`${index + 1}) ${title}`}</h3>{' '}
        <button
          className={styles.buttonDelete}
          onClick={() => dispatch(deleteTask({ boardId, columnId, taskId }))}
        >
          {t('delete')}
        </button>
      </div>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default Task;
