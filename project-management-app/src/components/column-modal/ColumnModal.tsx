import React, { FC } from 'react';
import styles from './ColumnModal.module.scss';
import cn from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { addColumns } from '../../api/columns';
import LoadingAnimation from '../loading-animation/LoadingAnimation';
import { useTranslation } from 'react-i18next';
import cross from './../board-modal/assets/cross.svg';

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
        <img width={32} src={cross} alt="cross" onClick={() => setIsOpenColumn(false)} />
        <Formik
          initialValues={{ titleColumn: '' }}
          onSubmit={({ titleColumn: title }, { resetForm }) => {
            const order = columns.length + 1;
            dispatch(addColumns({ boardId: boardId, values: { order, title: title } }));
            resetForm();
          }}
          validationSchema={Yup.object().shape({
            titleColumn: Yup.string()
              .min(3, t('must_be_more_than_3_characters'))
              .max(12, t('must_be_less_than_12_characters'))
              .required(t('title_is_required')),
          })}
        >
          {({ handleSubmit }) => {
            return (
              <Form className={styles.form} onSubmit={handleSubmit}>
                <label htmlFor="titleColumn">
                  {t('title_column')}
                  <Field id="titleColumn" name="titleColumn" />
                  <div className={styles.error}>
                    <ErrorMessage name="titleColumn" />
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
