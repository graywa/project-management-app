import React from 'react';
import styles from './RegistrationPage.module.scss';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import loadingAnimation from '../../components/loading-animation/LoadingAnimation';
import { fetchAuthRegistration } from '../../api/auth';
import { Link } from 'react-router-dom';

const RegistrationPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const validationsSchemaSignUp = yup.object().shape({
    name: yup
      .string()
      .matches(/^[A-Za-z ]*$/, 'please enter valid name')
      .min(2, 'must be more than 2 characters')
      .max(30, 'must be less than 30 characters')
      .required('name is required'),
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
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'passwords do not match')
      .required('confirm password is required'),
  });

  return (
    <div className={styles.registration}>
      <div className={styles.container}>
        <h2>Welcome! Registration Page</h2>
        {error && <p className={styles.error}>{error}</p>}
        {isLoading && loadingAnimation()}
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
                  <label htmlFor="name">Name</label>
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
                  <label htmlFor="login">Login</label>
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
                  <label htmlFor="password">Password</label>
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
                  <label htmlFor="confirmPassword">Confirm password</label>
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
                  Sign Up
                </button>
              </div>
            )}
          </Formik>
        </div>
        <Link className={styles.switch__form} to="/login">
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegistrationPage;
