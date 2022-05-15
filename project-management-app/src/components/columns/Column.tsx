import React from 'react';
import { IColumn } from '../../models/IColumn';
import styles from './Column.module.scss';

const Columns = ({ column }: { column: IColumn }) => {
  const { title } = column;

  return (
    <div className={styles.columns}>
      <h1>{title}</h1>
    </div>
  );
};

export default Columns;
