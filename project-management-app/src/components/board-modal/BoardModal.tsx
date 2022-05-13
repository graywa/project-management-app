import React, { FC } from 'react';
import styles from './BoardModal.module.scss';
import cn from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

interface IProps {
  isOpenBoard: boolean;
  setIsOpenBoard: (val: boolean) => void;
}

const BoardModal: FC<IProps> = ({ isOpenBoard, setIsOpenBoard }) => {
  return (
    <div
      className={cn(styles.modal, { [styles.open]: isOpenBoard })}
      onClick={() => setIsOpenBoard(false)}
    >
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        <Formik
          initialValues={{ title: '' }}
          onSubmit={(values, props) => {}}
          validationSchema={Yup.object().shape({
            title: Yup.string().min(4, 'min 4 characters').required('enter a title'),
          })}
        >
          {({ values, touched, errors, handleChange, handleSubmit }) => {
            return (
              <Form className={styles.form} onSubmit={handleSubmit}>
                <label htmlFor="title">
                  Title board
                  <Field id="title" name="title" />
                  <div className={styles.error}>
                    <ErrorMessage name="title" />
                  </div>
                </label>

                <button type="submit">Create</button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default BoardModal;
