import React from 'react';
import styles from './DownloadAnimation.module.scss';

const downLoadAnimation = () => {
  return (
    <div className={styles.loader}>
      <span className={styles.loader__element}></span>
      <span className={styles.loader__element}></span>
      <span className={styles.loader__element}></span>
    </div>
  );
};

export default downLoadAnimation;
