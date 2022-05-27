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

interface IProps {
  task: ITask;
  index: number;
}

const Task: FC<IProps> = ({ task, index }) => {
  const dispatch = useAppDispatch();
  const { title, description, boardId, columnId, id: taskId } = task;
  const { tasks: allTasks } = useAppSelector((state) => state.tasks);
  const tasks = allTasks[columnId];
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenChangeTaskModal, setIsOpenChangeTaskModal] = useState(false);
  const image = localStorage.getItem(task.id);
  const [preview, setPreview] = useState(defaultImage);

  async function downloadImage() {
    if (image) {
      const url = await dispatch(fileDownload({ taskId: task.id, fileName: image }));
      const { payload: urlImage } = url;

      setPreview(urlImage as string);
    }
  }

  useEffect(() => {
    downloadImage();
  }, [image]);

  return (
    <div className={styles.task}>
      <div className={styles.taskHead}>
        <div className={styles.hat}>
          <div className={styles['image-preview']}>
            <img src={preview} alt="default preview" />
          </div>
          <div className={styles['refactor-delete']}>
            <div className={styles.refactor} onClick={() => setIsOpenChangeTaskModal(true)}>
              <img src={refactorIcon} alt="refactor icon" />
            </div>
            <div className={styles.delete} onClick={() => setIsOpenModal(true)}>
              <img src={deleteIcon} alt="delete icon" />
            </div>
          </div>
        </div>
        <h3 className={styles.title}>{`${index + 1}) ${title}`}</h3>
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
};

export default Task;
