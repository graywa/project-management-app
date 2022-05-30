import React, { FC, useEffect, useState } from 'react';
import styles from './Task.module.scss';
import { ITask } from '../../models/ITask';
import ConfirmModal from '../confirm-modal/ConfirmModal';
import TaskChangeModal from '../task-modal-change/TaskChangeModal';
import refactorIcon from './assets/pencil.png';
import deleteIcon from './assets/delete.png';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { fileDownload } from '../../api/files';
import defaultImage from './assets/default-image.jpg';
import { Draggable } from 'react-beautiful-dnd';
import { t } from 'i18next';

interface IProps {
  task: ITask;
  index: number;
}

const Task: FC<IProps> = React.memo(({ task, index }) => {
  const dispatch = useAppDispatch();
  const { title, description, boardId, columnId, id: taskId } = task;
  const { tasks: allTasks, isUpdateTask, urlImages } = useAppSelector((state) => state.tasks);
  const tasks = allTasks[columnId];
  const urlImage = urlImages.find((el) => el.taskId === task.id)?.urlImage || defaultImage;

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenChangeTaskModal, setIsOpenChangeTaskModal] = useState(false);
  const hasImage = !!task.files?.length || false;

  useEffect(() => {
    setIsOpenChangeTaskModal(false);
  }, [isUpdateTask]);

  useEffect(() => {
    if (hasImage) {
      dispatch(fileDownload({ taskId: task.id, fileName: task.files[0].filename }));
    }
  }, [hasImage]);

  return (
    <Draggable draggableId={task.id as string} index={index}>
      {(provided) => {
        return (
          <div className={styles.task} {...provided.draggableProps} ref={provided.innerRef}>
            <div className={styles.taskHead} {...provided.dragHandleProps}>
              <div className={styles.hat}>
                <h3 className={styles.title}>{`${index + 1}) ${title}`}</h3>

                <div className={styles['refactor-delete']}>
                  <div
                    className={styles.refactor}
                    title={t('edit')}
                    onClick={() => setIsOpenChangeTaskModal(true)}
                  >
                    <img width={26} src={refactorIcon} alt="refactor icon" />
                  </div>
                  <div
                    className={styles.delete}
                    title={t('delete')}
                    onClick={() => setIsOpenModal(true)}
                  >
                    <img width={30} src={deleteIcon} alt="delete icon" />
                  </div>
                </div>
              </div>
              <div className={styles['image-preview']}>
                <img src={urlImage} alt="default preview" />
              </div>

              <ConfirmModal
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
                action={'delete_task'}
                data={{ boardId, columnId, taskId, tasks }}
              />
            </div>

            <p className={styles.description}>{description}</p>
            {isOpenChangeTaskModal && (
              <TaskChangeModal
                task={task}
                isOpenChangeTaskModal={isOpenChangeTaskModal}
                setIsOpenChangeTaskModal={setIsOpenChangeTaskModal}
                numberTask={index + 1}
              />
            )}
          </div>
        );
      }}
    </Draggable>
  );
});

export default Task;
