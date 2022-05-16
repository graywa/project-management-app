import React, { FC } from 'react';
import styles from './ColumnModal.module.scss';
import cn from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { addColumns } from '../../api/columns';
import LoadingAnimation from '../loading-animation/LoadingAnimation';
import { useTranslation } from 'react-i18next';

interface IProps {
  isOpenColumn: boolean;
  setIsOpenColumn: (val: boolean) => void;
}

const ColumnModal: FC<IProps> = ({ isOpenColumn, setIsOpenColumn }) => {
  const dispatch = useAppDispatch();
  const { isLoading, columns, boardId } = useAppSelector((state) => state.columns);
  const { t } = useTranslation();

  return (
    <div
      className={cn(styles.modal, { [styles.open]: isOpenColumn })}
      onClick={() => setIsOpenColumn(false)}
    >
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        <Formik
          initialValues={{ title: '' }}
          onSubmit={({ title }, { resetForm }) => {
            dispatch(
              addColumns({ boardId: boardId, values: { order: columns.length + 1, title: title } })
            );
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
                  {t('title_column')}
                  <Field id="title" name="title" />
                  <div className={styles.error}>
                    <ErrorMessage name="title" />
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

export default ColumnModal;
