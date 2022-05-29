import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { updateUser } from '../../api/auth';
import Header from '../../components/header/Header';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import styles from './Profile.module.scss';
import * as Yup from 'yup';
import jwtDecode from 'jwt-decode';
import LoadingAnimation from '../../components/loading-animation/LoadingAnimation';
import { useTranslation } from 'react-i18next';
import { IJwt } from '../../models/IJwt';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetSuccess } from '../../store/authSlice';
import ConfirmModal from '../../components/confirm-modal/ConfirmModal';

const Profile = () => {
  const dispatch = useAppDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { token } = useAppSelector((state) => state.auth);
  const { isLoading, error, isSuccess } = useAppSelector((state) => state.auth);
  const { userId: id } = jwtDecode<IJwt>(token);
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Za-z ]*$/, t('please_enter_valid_name'))
      .min(2, t('must_be_more_than_2_characters'))
      .max(30, t('must_be_less_than_30_characters'))
      .required(t('name_is_required')),
    login: Yup.string()
      .matches(/^[a-zA-Z0-9_-]*$/, t('please_enter_valid_login'))
      .min(3, t('must_be_more_than_3_characters'))
      .max(20, t('must_be_less_than_20_characters'))
      .required(t('login_is_required')),
    password: Yup.string()
      .matches(/^[a-zA-Z0-9]*$/, t('password_can_contain_only_latin_letters_and_ciphers'))
      .min(4, t('must_be_more_than_4_characters'))
      .max(16, t('must_be_less_than_16_characters'))
      .required(t('password_is_required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('passwords_do_not_match'))
      .required(t('confirm_password_is_required')),
  });

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Profile changed successfully', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
      dispatch(resetSuccess());
    }
  }, [isSuccess]);

  return (
    <div className={styles.profile}>
      <Header />
      <ToastContainer />
      <Formik
        initialValues={{ name: '', login: '', password: '', confirmPassword: '' }}
        onSubmit={({ name, login, password }, { resetForm }) => {
          dispatch(updateUser({ name, login, password, id, token }));
          resetForm();
        }}
        validationSchema={validationSchema}
      >
        {({ handleSubmit }) => {
          return (
            <Form className={styles.form_profile} onSubmit={handleSubmit}>
              <h1>{t('profile')}</h1>
              <label htmlFor="name">
                {t('name')}
                <Field id="name" name="name" />
                <div className={styles.error}>
                  <ErrorMessage name="name" />
                </div>
              </label>

              <label htmlFor="login">
                {t('login')}
                <Field id="login" name="login" />
                <div className={styles.error}>
                  <ErrorMessage name="login" />
                </div>
              </label>

              <label htmlFor="password">
                {t('password')}
                <Field id="password" name="password" type="password" />
                <div className={styles.error}>
                  <ErrorMessage name="password" />
                </div>
              </label>

              <label htmlFor="confirmPassword">
                {t('confirm_pass')}
                <Field id="confirmPassword" name="confirmPassword" type="password" />
                <div className={styles.error}>
                  <ErrorMessage name="confirmPassword" />
                </div>
              </label>

              <div className={styles.sub_btn}>
                <div className={styles.loader}>{isLoading && <LoadingAnimation />}</div>

                <button type="submit" disabled={isLoading}>
                  {t('save_profile')}
                </button>
              </div>

              <div className={styles.del_btn}>
                <button type="button" onClick={() => setIsOpenModal(true)} disabled={isLoading}>
                  {t('del_user')}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>

      <ConfirmModal
        action="delete_user"
        data={{ id, token }}
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
      />
    </div>
  );
};

export default Profile;
