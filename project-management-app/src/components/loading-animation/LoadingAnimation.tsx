import React from 'react';
import styles from './LoadingAnimation.module.scss';

const LoadingAnimation = () => {
  return (
    <div className={styles.loader}>
      <span className={styles.loader__element}></span>
      <span className={styles.loader__element}></span>
      <span className={styles.loader__element}></span>
    </div>
  );
};

export default LoadingAnimation;
