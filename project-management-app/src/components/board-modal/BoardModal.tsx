import React, { FC } from 'react';
import styles from './BoardModal.module.scss';
import cn from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { createBoard } from '../../api/boards';
import LoadingAnimation from '../loading-animation/LoadingAnimation';

interface IProps {
  isOpenBoard: boolean;
  setIsOpenBoard: (val: boolean) => void;
}

const BoardModal: FC<IProps> = ({ isOpenBoard, setIsOpenBoard }) => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.boards);

  return (
    <div
      className={cn(styles.modal, { [styles.open]: isOpenBoard })}
      onClick={() => setIsOpenBoard(false)}
    >
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        <Formik
          initialValues={{ title: '' }}
          onSubmit={({ title }, { resetForm }) => {
            dispatch(createBoard({ title, token }));
            resetForm();
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().min(4, 'min 4 characters').required('enter a title'),
          })}
        >
          {({ handleSubmit }) => {
            return (
              <Form className={styles.form} onSubmit={handleSubmit}>
                <label htmlFor="title">
                  Title board
                  <Field id="title" name="title" />
                  <div className={styles.error}>
                    <ErrorMessage name="title" />
                  </div>
                </label>
                <div className={styles.sub_btn}>
                  <div className={styles.loader}>{isLoading && <LoadingAnimation />}</div>
                  <button type="submit" disabled={isLoading}>
                    Create
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

export default BoardModal;
