import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './BoardPage.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux-hooks/redux-hooks';
import { getColumns } from '../../api/columns';
import loadingAnimation from '../../components/loading-animation/LoadingAnimation';
import Column from '../../components/columns/Column';

const BoardPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error, columns } = useAppSelector((state) => state.columns);

  useEffect(() => {
    dispatch(getColumns());
  }, [columns]);

  return (
    <div className={styles.board}>
      {error && <p className={styles.error}>{error}</p>}
      {isLoading && loadingAnimation()}
      <Link className={styles.buttonBack} to="/main">
        Go back
      </Link>
      {columns.map((column, index) => {
        return <Column key={index} />;
      })}
      {/* <button className={styles.buttonAddColumn}>add column</button> */}
    </div>
  );
};

export default BoardPage;
