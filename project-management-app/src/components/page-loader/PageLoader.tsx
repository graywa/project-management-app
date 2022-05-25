import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingAnimation from '../loading-animation/LoadingAnimation';
import styles from './PageLoader.module.scss';

interface IProps {
  title: string;
}

const PageLoader: FC<IProps> = ({ title }) => {
  const { t } = useTranslation();
  const fullTitle = `loading_${title}_page`;

  return (
    <div className={styles.body}>
      <h2>{t(fullTitle)}</h2>
      <LoadingAnimation />
    </div>
  );
};

export default PageLoader;
