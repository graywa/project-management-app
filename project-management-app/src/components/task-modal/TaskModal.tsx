import React, { FC } from 'react';
import styles from './TaskModal.module.scss';
import cn from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import jwtDecode from 'jwt-decode';
import { addTask } from '../../api/tasks';

interface IProps {
  isOpenCreateTaskModal: boolean;
  setIsOpenCreateTaskModal: (val: boolean) => void;
  boardId: string;
  columnId: string;
}

interface IJwt {
  userId: string;
}

const TaskModal: FC<IProps> = ({
  isOpenCreateTaskModal,
  setIsOpenCreateTaskModal,
  boardId,
  columnId,
}) => {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector((state) => state.tasks);
  const { userId } = jwtDecode<IJwt>(localStorage.getItem('token') || '');

  return (
    <div
      className={cn(styles.modal, { [styles.open]: isOpenCreateTaskModal })}
      onClick={() => setIsOpenCreateTaskModal(false)}
    >
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        <Formik
          initialValues={{ title: '', description: '' }}
          onSubmit={({ title, description }, { resetForm }) => {
            dispatch(
              addTask({
                boardId: boardId,
                columnId: columnId,
                values: {
                  order: tasks[columnId].length + 1,
                  title: title,
                  description: description,
                  userId: userId,
                },
              })
            );

            resetForm();
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().min(4, 'min 4 characters').required('enter a title'),
            description: Yup.string().min(2, 'min 2 characters').required('enter a description'),
          })}
        >
          {({ handleSubmit }) => {
            return (
              <Form className={styles.form} onSubmit={handleSubmit}>
                <label htmlFor="title">
                  Title column
                  <Field id="title" name="title" />
                  <div className={styles.error}>
                    <ErrorMessage name="title" />
                  </div>
                </label>
                <label htmlFor="description">
                  Description
                  <Field id="description" name="description" />
                  <div className={styles.error}>
                    <ErrorMessage name="description" />
                  </div>
                </label>
                <div className={styles.sub_btn}>
                  <button type="submit">Create</button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default TaskModal;
