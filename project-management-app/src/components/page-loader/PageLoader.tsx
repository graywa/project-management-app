import React, { FC } from 'react';
import LoadingAnimation from '../loading-animation/LoadingAnimation';
import styles from './PageLoader.module.scss';

interface IProps {
  title: string;
}

const PageLoader: FC<IProps> = ({ title }) => {
  return (
    <div className={styles.body}>
      <h2>Loading {title} page</h2>
      <LoadingAnimation />
    </div>
  );
};

export default PageLoader;
