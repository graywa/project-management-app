import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ErrorFallback.module.scss';
import background from './assets/background.png';
import smileError from './assets/dizzy-face-cross-error-emoji-37675.png';

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div role="alert" className={styles.box}>
        <img className={styles.background} src={background} alt="background" />
        <img className={styles.image} src={smileError} alt="smile error" />
        <h2>Oh No</h2>
        <h3>Something Went Wrong</h3>
        <h3>{error.message}</h3>
        <h3>
          <button
            className={styles.btn}
            onClick={() => {
              navigate(-1);
              setTimeout(() => resetErrorBoundary(), 100);
            }}
          >
            Go to Back
          </button>
        </h3>
      </div>
    </div>
  );
}

export default ErrorFallback;
