import React from 'react';
import styles from './LoginPage.module.scss';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import LoadingAnimation from '../../components/loading-animation/LoadingAnimation';
import { fetchAuthLogin } from '../../api/auth';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const validationsSchemaSignIn = yup.object().shape({
    login: yup
      .string()
      .matches(/^[a-zA-Z0-9_-]*$/, 'please enter valid login')
      .min(3, 'must be more than 3 characters')
      .max(20, 'must be less than 20 characters')
      .required('login is required'),
    password: yup
      .string()
      .matches(/^[a-zA-Z0-9]*$/, 'password can contain only latin letters and ciphers')
      .min(4, 'must be more than 4 characters')
      .max(16, 'must be less than 16 characters')
      .required('password is required'),
  });

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <h2>{t('welcome_login')}</h2>
        {error && <p className={styles.error}>{error}</p>}
        {isLoading && LoadingAnimation()}
        <div className={styles.form && styles.sign__in}>
          <Formik
            initialValues={{
              login: '',
              password: '',
            }}
            validateOnBlur
            onSubmit={(values, { resetForm }) => {
              dispatch(fetchAuthLogin(values));
              resetForm();
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
              <div className={styles.form_inputs}>
                <label htmlFor="login">{t('login')}</label>
                <input
                  className={styles.input}
                  type="text"
                  name="login"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.login}
                />
                {touched.login && errors.login && <p className={styles.error}>{errors.login}</p>}

                <label htmlFor="password">{t('password')}</label>
                <input
                  className={styles.input}
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {touched.password && errors.password && (
                  <p className={styles.error}>{errors.password}</p>
                )}

                <button
                  className={styles.submit}
                  disabled={!isValid && !dirty}
                  onClick={() => handleSubmit()}
                  type="submit"
                >
                  {t('sign_in')}
                </button>
              </div>
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
