import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteColumn } from '../../api/columns';
import { getTasks } from '../../api/tasks';
import { IColumn } from '../../models/IColumn';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import ConfirmModal from '../confirm-modal/ConfirmModal';
import TaskModal from '../task-modal/TaskModal';
import Task from '../task/Task';
import styles from './Column.module.scss';

const Columns = ({ column }: { column: IColumn }) => {
  const { title, id: columnId = '' } = column;
  const dispatch = useAppDispatch();
  const { boardId } = useAppSelector((state) => state.columns);
  const { tasks } = useAppSelector((state) => state.tasks);
  const { t } = useTranslation();

  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [isOpenCreateTaskModal, setIsOpenCreateTaskModal] = useState(false);

  useEffect(() => {
    dispatch(getTasks({ boardId, columnId }));
  }, [columnId]);

  return (
    <div className={styles.column}>
      <div className={styles.columnHead}>
        <h1>{title}</h1>
        <button className={styles.buttonDelete} onClick={() => setIsOpenConfirmationModal(true)}>
          {t('delete')}
        </button>
        <ConfirmModal
          isOpenModal={isOpenConfirmationModal}
          setIsOpenModal={setIsOpenConfirmationModal}
          data={{ columnId, boardId }}
          action={'delele_column'}
        />
      </div>
      <div className={styles.tasks}>
        {tasks[columnId] &&
          tasks[columnId].map((task, index) => {
            return <Task task={task} index={index} key={index} />;
          })}
        <button className={styles.buttonCreate} onClick={() => setIsOpenCreateTaskModal(true)}>
          {t('create_task')}
        </button>
        <TaskModal
          isOpenCreateTaskModal={isOpenCreateTaskModal}
          setIsOpenCreateTaskModal={setIsOpenCreateTaskModal}
          boardId={boardId}
          columnId={columnId}
        />
      </div>
    </div>
  );
};

export default Columns;
