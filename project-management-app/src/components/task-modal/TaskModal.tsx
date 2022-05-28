import React, { FC } from 'react';
import styles from './TaskModal.module.scss';
import cn from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import jwtDecode from 'jwt-decode';
import { addTask } from '../../api/tasks';
import { useTranslation } from 'react-i18next';
import cross from './../board-modal/assets/cross.svg';
import LoadingAnimation from '../loading-animation/LoadingAnimation';

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
  const { tasks, isLoading } = useAppSelector((state) => state.tasks);
  const { userId } = jwtDecode<IJwt>(localStorage.getItem('token') || '');
  const { t } = useTranslation();

  return (
    <div
      className={cn(styles.modal, { [styles.open]: isOpenCreateTaskModal })}
      onClick={() => setIsOpenCreateTaskModal(false)}
    >
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        <img
          className={styles.cross}
          src={cross}
          alt="cross"
          onClick={() => setIsOpenCreateTaskModal(false)}
        />
        <Formik
          initialValues={{ title: '', description: '' }}
          onSubmit={({ title, description }, { resetForm }) => {
            dispatch(
              addTask({
                boardId: boardId,
                columnId: columnId,
                values: {
                  order: tasks[columnId].length + 1,
                  title,
                  description,
                  userId,
                },
              })
            );

            resetForm();
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .min(4, t('must_be_more_than_4_characters'))
              .max(12, t('must_be_less_than_12_characters'))
              .required(t('title_is_required')),
            description: Yup.string()
              .min(2, t('must_be_more_than_2_characters'))
              .required(t('description_is_required')),
          })}
        >
          {({ handleSubmit }) => {
            return (
              <Form className={styles.form} onSubmit={handleSubmit}>
                <label htmlFor="title">
                  {t('title_task')}
                  <Field id="title" name="title" />
                  <div className={styles.error}>
                    <ErrorMessage name="title" />
                  </div>
                </label>
                <label htmlFor="description">
                  {t('description_task')}
                  <Field id="description" name="description" />
                  <div className={styles.error}>
                    <ErrorMessage name="description" />
                  </div>
                </label>
                <div className={styles.sub_btn}>
                  <div className={styles.loader}>{isLoading && <LoadingAnimation />}</div>
                  <button type="submit" disabled={isLoading}>
                    {t('create')}
                  </button>
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
