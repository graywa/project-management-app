import React, { useState } from 'react';
import styles from './CustomSelect.module.scss';
import cn from 'classnames';

const CustomSelect = () => {
  const languages = ['EN', 'RU'];
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(languages[0]);

  return (
    <button
      onBlur={() => setIsOpen(false)}
      className={styles.select}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={styles.select__title}>{value}</div>
      <div className={cn(styles.select__options, { [styles.open]: isOpen })}>
        {languages?.map((el, ind) => {
          return (
            <div className={styles.select__option} key={ind} onClick={() => setValue(el)}>
              {el}
            </div>
          );
        })}
      </div>
    </button>
  );
};

export default CustomSelect;
