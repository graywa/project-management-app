import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Page404.scss';
import back from './assets/back.png';

function Page404() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="page404">
      <h2>{t('page_not_found')}</h2>
      <button onClick={() => navigate(-1)}>
        <img width={26} src={back} alt="back" />
        {t('go_back')}
      </button>
    </div>
  );
}

export default Page404;
