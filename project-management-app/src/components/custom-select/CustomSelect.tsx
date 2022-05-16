import React, { useState } from 'react';
import styles from './CustomSelect.module.scss';
import cn from 'classnames';
import i18next from 'i18next';

const CustomSelect = () => {
  const languages = ['EN', 'RU'];
  const [isOpen, setIsOpen] = useState(false);
  const currLanguage = localStorage.getItem('language') || 'EN';
  const [language, setLanguage] = useState(currLanguage);

  const setLanguageHandler = (language: string) => {
    setLanguage(language);
    localStorage.setItem('language', language);
    i18next.changeLanguage(language.toLowerCase());
  };

  return (
    <button
      onBlur={() => setIsOpen(false)}
      className={styles.select}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={styles.select__title}>{language}</div>
      <div className={cn(styles.select__options, { [styles.open]: isOpen })}>
        {languages?.map((el, ind) => {
          return (
            <div className={styles.select__option} key={ind} onClick={() => setLanguageHandler(el)}>
              {el}
            </div>
          );
        })}
      </div>
    </button>
  );
};

export default CustomSelect;
