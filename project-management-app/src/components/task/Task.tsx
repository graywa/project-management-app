import React, { FC, useState } from 'react';
import styles from './Task.module.scss';
import { ITask } from '../../models/ITask';
import ConfirmModal from '../confirm-modal/ConfirmModal';
import TaskChangeModal from '../task-modal-change/TaskChangeModal';
import refactorIcon from './assets/pencil.png';
import deleteIcon from './assets/delete.png';
import { useAppSelector } from '../../redux-hooks/redux-hooks';
import { Draggable } from 'react-beautiful-dnd';
import { t } from 'i18next';

interface IProps {
  task: ITask;
  index: number;
}

const Task: FC<IProps> = React.memo(({ task, index }) => {
  const { title, description, boardId, columnId, id: taskId } = task;
  const { tasks: allTasks } = useAppSelector((state) => state.tasks);
  const tasks = allTasks[columnId];
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenChangeTaskModal, setIsOpenChangeTaskModal] = useState(false);

  return (
    <Draggable draggableId={task.id as string} index={index}>
      {(provided) => {
        return (
          <div className={styles.task} {...provided.draggableProps} ref={provided.innerRef}>
            <div className={styles.taskHead} {...provided.dragHandleProps}>
              <h3 className={styles.title}>{`${index + 1}) ${title}`}</h3>
              <div className={styles.refactor_delete}>
                <div
                  className={styles.refactor}
                  title={t('edit')}
                  onClick={() => setIsOpenChangeTaskModal(true)}
                >
                  <img src={refactorIcon} alt="refactor icon" />
                </div>
                <div
                  className={styles.delete}
                  title={t('delete')}
                  onClick={() => setIsOpenModal(true)}
                >
                  <img src={deleteIcon} alt="delete icon" />
                </div>
              </div>
              <ConfirmModal
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
                action={'delete_task'}
                data={{ boardId, columnId, taskId, tasks }}
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
      }}
    </Draggable>
  );
});

export default Task;
