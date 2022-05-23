import React, { useEffect } from 'react';
import styles from './LoginPage.module.scss';
import { Field, Formik } from 'formik';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import LoadingAnimation from '../../components/loading-animation/LoadingAnimation';
import { fetchAuthLogin } from '../../api/auth';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const validationsSchemaSignIn = yup.object().shape({
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

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <h2>{t('welcome_login')}</h2>
        {isLoading && LoadingAnimation()}
        <ToastContainer />
        <div className={styles.form && styles.sign__in}>
          <Formik
            initialValues={{
              login: '',
              password: '',
            }}
            validateOnBlur
            onSubmit={(values, { resetForm }) => {
              dispatch(fetchAuthLogin({ values, resetForm }));
            }}
            validationSchema={validationsSchemaSignIn}
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
              <form className={styles.form_inputs} onSubmit={handleSubmit}>
                <label htmlFor="login">{t('login')}</label>
                <Field
                  className={styles.input}
                  type="text"
                  id="login"
                  name="login"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.login}
                />
                {touched.login && errors.login && <p className={styles.error}>{errors.login}</p>}

                <label htmlFor="password">{t('password')}</label>
                <Field
                  className={styles.input}
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {touched.password && errors.password && (
                  <p className={styles.error}>{errors.password}</p>
                )}

                <button className={styles.submit} disabled={!isValid && !dirty} type="submit">
                  {t('sign_in')}
                </button>
              </form>
            )}
          </Formik>
        </div>
        <Link className={styles.switch__form} to="/registration">
          {t('registration')}
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
