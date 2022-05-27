import React from 'react';
import styles from './Footer.module.scss';
import rsschool from './assets/rs-school.svg';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.footer}>
      <div className={styles.wrapper}>
        <a href="https://rs.school/react/" target="_blank" rel="noopener noreferrer">
          <img width={80} src={rsschool} alt="rsschool" />
        </a>
        <div className={styles.year}>2022</div>
        <div className={styles.devs_block}>
          <span>{t('dev_by')}</span>
          <div className={styles.devs}>
            <a href="https://github.com/GoldenManBel" target="_blank" rel="noopener noreferrer">
              GoldenManBel
            </a>
            <a href="https://github.com/graywa" target="_blank" rel="noopener noreferrer">
              graywa
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
