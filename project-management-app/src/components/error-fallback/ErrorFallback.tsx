import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ErrorFallback.module.scss';

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
        <img
          className={styles.background}
          src="https://i.ibb.co/ZmbV1fy/background.png"
          alt="background"
        />
        <img
          className={styles.image}
          src="https://cdn.iconscout.com/icon/free/png-512/dizzy-face-cross-error-emoji-37675.png"
        />
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
