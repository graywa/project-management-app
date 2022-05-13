import React from 'react';
import Header from '../../components/header/Header';
import styles from './Profile.module.scss';

const Profile = () => {
  return (
    <div className={styles.profile}>
      <Header />
      <h1>Profile</h1>
    </div>
  );
};

export default Profile;
