import React, { useEffect } from 'react';
import styles from './RegistrationPage.module.scss';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import LoadingAnimation from '../../components/loading-animation/LoadingAnimation';
import { fetchAuthRegistration } from '../../api/auth';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetSuccess } from '../../store/authSlice';

const RegistrationPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { isLoading, error, isSuccess } = useAppSelector((state) => state.auth);

  const validationsSchemaSignUp = yup.object().shape({
    name: yup
      .string()
      .matches(/^[A-Za-z ]*$/, t('please_enter_valid_name'))
      .min(2, t('must_be_more_than_2_characters'))
      .max(30, t('must_be_less_than_30_characters'))
      .required(t('name_is_required')),
    login: yup
      .string()
      .matches(/^[a-zA-Z0-9_-]*$/, t('please_enter_valid_login'))
      .min(3, t('must_be_more_than_3_characters'))
      .max(20, t('must_be_less_than_20_characters'))
      .required(t('login_is_required')),
    password: yup
      .string()
      .matches(/^[a-zA-Z0-9]*$/, t('password_can_contain_only_latin_letters_and_ciphers'))
      .min(4, t('must_be_more_than_4_characters'))
      .max(16, t('must_be_less_than_16_characters'))
      .required(t('password_is_required')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], t('passwords_do_not_match'))
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
      toast.success(t('registration_completed_successfully'), {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
      dispatch(resetSuccess());
    }
  }, [isSuccess]);

  return (
    <div className={styles.registration}>
      <div className={styles.container}>
        <h2>{t('welcome_registration')}</h2>
        <ToastContainer />
        {isLoading && LoadingAnimation()}
        <div className={styles.form && styles.sign__up}>
          <Formik
            initialValues={{
              name: '',
              login: '',
              password: '',
              confirmPassword: '',
            }}
            validateOnBlur
            onSubmit={(values, { resetForm }) => {
              dispatch(fetchAuthRegistration(values));
              resetForm();
            }}
            validationSchema={validationsSchemaSignUp}
          >
            {({
              values,
              errors,
              touched,
              isValid,
              dirty,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <div className={styles.form_inputs}>
                <p>
                  <label htmlFor="name">{t('name')}</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                </p>
                {touched.name && errors.name && <p className={styles.error}>{errors.name}</p>}

                <p>
                  <label htmlFor="login">{t('login')}</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="login"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.login}
                  />
                </p>
                {touched.login && errors.login && <p className={styles.error}>{errors.login}</p>}

                <p>
                  <label htmlFor="password">{t('password')}</label>
                  <input
                    className={styles.input}
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                </p>
                {touched.password && errors.password && (
                  <p className={styles.error}>{errors.password}</p>
                )}

                <p>
                  <label htmlFor="confirmPassword">{t('confirm_pass')}</label>
                  <input
                    className={styles.input}
                    type="password"
                    name="confirmPassword"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirmPassword}
                  />
                </p>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className={styles.error}>{errors.confirmPassword}</p>
                )}

                <button
                  className={styles.submit}
                  disabled={!dirty && !isValid}
                  onClick={() => handleSubmit()}
                  type="submit"
                >
                  {t('sign_up')}
                </button>
              </div>
            )}
          </Formik>
        </div>
        <Link className={styles.switch__form} to="/login">
          {t('login')}
        </Link>
      </div>
    </div>
  );
};

export default RegistrationPage;
