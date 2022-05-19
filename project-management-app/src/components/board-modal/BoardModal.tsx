import React, { FC } from 'react';
import styles from './BoardModal.module.scss';
import cn from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { createBoard } from '../../api/boards';
import { useTranslation } from 'react-i18next';
import cross from './assets/cross.svg';
import LoadingAnimation from '../loading-animation/LoadingAnimation';

interface IProps {
  isOpenBoard: boolean;
  setIsOpenBoard: (val: boolean) => void;
}

const BoardModal: FC<IProps> = ({ isOpenBoard, setIsOpenBoard }) => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.boards);
  const { t } = useTranslation();

  return (
    <div
      className={cn(styles.modal, { [styles.open]: isOpenBoard })}
      onClick={() => setIsOpenBoard(false)}
    >
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        <img width={32} src={cross} alt="cross" onClick={() => setIsOpenBoard(false)} />
        <Formik
          initialValues={{ title: '' }}
          onSubmit={({ title }, { resetForm }) => {
            dispatch(createBoard({ title, token }));
            resetForm();
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .min(4, t('must_be_more_than_4_characters'))
              .required(t('title_is_required')),
          })}
        >
          {({ handleSubmit }) => {
            return (
              <Form className={styles.form} onSubmit={handleSubmit}>
                <label htmlFor="title">
                  {t('title_board')}
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

export default BoardModal;
