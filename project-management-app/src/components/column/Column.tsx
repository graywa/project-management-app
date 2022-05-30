import React, { FC, useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { updateColumn } from '../../api/columns';
import { getTasks } from '../../api/tasks';
import { IColumn } from '../../models/IColumn';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import ConfirmModal from '../confirm-modal/ConfirmModal';
import TaskModal from '../task-modal/TaskModal';
import Task from '../task/Task';
import styles from './Column.module.scss';
import LoadingAnimation from '../loading-animation/LoadingAnimation';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import deleteIcon from './../../components/task/assets/delete.png';
import submitIcon from './assets/submit.png';
import cancelIcon from './assets/cancel.png';
import plus from './../header/assets/plus.png';

interface IProps {
  column: IColumn;
  index: number;
}

const Columns: FC<IProps> = React.memo(({ column, index }) => {
  const { title, id: columnId = '', order } = column;
  const dispatch = useAppDispatch();
  const { boardId, isLoading, columns } = useAppSelector((state) => state.columns);
  const {
    tasks,
    isLoading: isLoadingTasks,
    isCreateTask,
    successUpload,
  } = useAppSelector((state) => state.tasks);
  const { t } = useTranslation();

  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [isOpenCreateTaskModal, setIsOpenCreateTaskModal] = useState(false);
  const [isTitleInput, setIsTitleInput] = useState(false);

  useEffect(() => {
    dispatch(getTasks({ boardId, columnId }));
  }, [columnId, successUpload]);

  useEffect(() => {
    setIsOpenCreateTaskModal(false);
  }, [isCreateTask]);

  return (
    <Draggable draggableId={column.id as string} index={index}>
      {(provided) => (
        <div className={styles.column} {...provided.draggableProps} ref={provided.innerRef}>
          {isLoadingTasks && (
            <div className={styles.loader}>
              <LoadingAnimation />
            </div>
          )}
          <div className={styles.columnHead} {...provided.dragHandleProps}>
            {isTitleInput ? (
              <Formik
                initialValues={{ title }}
                onSubmit={({ title }, { resetForm }) => {
                  dispatch(updateColumn({ boardId, columnId, data: { order, title } }));
                  resetForm();
                  setIsTitleInput(false);
                }}
                validationSchema={Yup.object().shape({
                  title: Yup.string()
                    .min(3, t('must_be_more_than_3_characters'))
                    .max(12, t('must_be_less_than_12_characters'))
                    .required(t('title_is_required')),
                })}
              >
                {({ handleSubmit, handleBlur, isValid }) => {
                  return (
                    <Form
                      className={styles.title_form}
                      onSubmit={handleSubmit}
                      onBlur={(e) => {
                        handleBlur(e);
                        if (isValid) {
                          setTimeout(() => {
                            setIsTitleInput(false);
                          }, 100);
                        }
                      }}
                    >
                      <div className={styles.buttons}>
                        <button className={styles.buttonSubmit} type="submit" title={t('save')}>
                          <img src={submitIcon} alt="submit button" />
                        </button>
                        <button
                          type="button"
                          title={t('cancel')}
                          className={styles.buttonCancel}
                          onClick={(e) => {
                            e.preventDefault();
                            setIsTitleInput(false);
                          }}
                        >
                          <img src={cancelIcon} alt="cancel button" />
                        </button>
                      </div>
                      <label htmlFor="title">
                        {t('title_column')}
                        <Field id="title" name="title" className={styles.input} autoFocus={true} />
                        <div className={styles.error}>
                          <ErrorMessage name="title" />
                        </div>
                      </label>
                      {isLoading && <div className={styles.loader}>{<LoadingAnimation />}</div>}
                    </Form>
                  );
                }}
              </Formik>
            ) : (
              <div className={styles.titleColumnBlock}>
                <h1
                  className={styles.title}
                  title={t('click_to_change')}
                  onClick={() => setIsTitleInput(true)}
                >
                  {title}
                </h1>
                <div
                  className={styles.delete}
                  title={t('delete')}
                  onClick={() => setIsOpenConfirmationModal(true)}
                >
                  <img src={deleteIcon} alt="delete icon" />
                </div>
              </div>
            )}
            <ConfirmModal
              isOpenModal={isOpenConfirmationModal}
              setIsOpenModal={setIsOpenConfirmationModal}
              data={{ columns, columnId, boardId }}
              action={'delete_column'}
            />
          </div>

          <Droppable droppableId={column.id as string}>
            {(provided) => (
              <div className={styles.tasks} {...provided.droppableProps} ref={provided.innerRef}>
                {tasks[columnId] &&
                  tasks[columnId].map((task, index) => {
                    return <Task key={task.id} task={task} index={index} />;
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <button className={styles.buttonCreate} onClick={() => setIsOpenCreateTaskModal(true)}>
            <img width={26} src={plus} alt="plus" />
            {t('create_task')}
          </button>

          <TaskModal
            isOpenCreateTaskModal={isOpenCreateTaskModal}
            setIsOpenCreateTaskModal={setIsOpenCreateTaskModal}
            boardId={boardId}
            columnId={columnId}
          />
        </div>
      )}
    </Draggable>
  );
});

export default Columns;
