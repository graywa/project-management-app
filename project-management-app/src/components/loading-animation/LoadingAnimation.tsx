import React from 'react';
import styles from './LoadingAnimation.module.scss';

const loadingAnimation = () => {
  return (
    <div className={styles.loader}>
      <span className={styles.loader__element}></span>
      <span className={styles.loader__element}></span>
      <span className={styles.loader__element}></span>
    </div>
  );
};

export default loadingAnimation;
