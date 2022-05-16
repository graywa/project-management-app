import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import { deleteUser, updateUser } from '../../api/auth';
import Header from '../../components/header/Header';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import styles from './Profile.module.scss';
import * as Yup from 'yup';
import jwtDecode from 'jwt-decode';
import LoadingAnimation from '../../components/loading-animation/LoadingAnimation';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z ]*$/, 'please enter valid name')
    .min(2, 'must be more than 2 characters')
    .max(30, 'must be less than 30 characters')
    .required('name is required'),
  login: Yup.string()
    .matches(/^[a-zA-Z0-9_-]*$/, 'please enter valid login')
    .min(3, 'must be more than 3 characters')
    .max(20, 'must be less than 20 characters')
    .required('login is required'),
  password: Yup.string()
    .matches(/^[a-zA-Z0-9]*$/, 'password can contain only latin letters and ciphers')
    .min(4, 'must be more than 4 characters')
    .max(16, 'must be less than 16 characters')
    .required('password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'passwords do not match')
    .required('confirm password is required'),
});

interface IJwt {
  userId: string;
}

const Profile = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { login, isLoading } = useAppSelector((state) => state.auth);
  const { userId } = jwtDecode<IJwt>(token);
  const id = userId;

  return (
    <div className={styles.profile}>
      <Header />
      <Formik
        initialValues={{ name: '', login: login, password: '', confirmPassword: '' }}
        onSubmit={({ name, login, password }, { resetForm }) => {
          dispatch(updateUser({ name, login, password, id, token }));
          resetForm();
        }}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, errors }) => {
          return (
            <Form className={styles.form} onSubmit={handleSubmit}>
              <h1>Profile</h1>
              <label htmlFor="name">
                Name
                <Field id="name" name="name" />
                <div className={styles.error}>
                  <ErrorMessage name="name" />
                </div>
              </label>

              <label htmlFor="login">
                Login
                <Field id="login" name="login" />
                <div className={styles.error}>
                  <ErrorMessage name="login" />
                </div>
              </label>

              <label htmlFor="password">
                Password
                <Field id="password" name="password" type="password" />
                <div className={styles.error}>
                  <ErrorMessage name="password" />
                </div>
              </label>

              <label htmlFor="confirmPassword">
                Confirm password
                <Field id="confirmPassword" name="confirmPassword" type="password" />
                <div className={styles.error}>
                  <ErrorMessage name="confirmPassword" />
                </div>
              </label>

              <div className={styles.sub_btn}>
                <div className={styles.loader}>{isLoading && <LoadingAnimation />}</div>

                <button type="submit" disabled={isLoading}>
                  Save profile
                </button>
              </div>

              <div className={styles.del_btn}>
                <button onClick={() => dispatch(deleteUser({ id, token }))} disabled={isLoading}>
                  Delete user
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Profile;
