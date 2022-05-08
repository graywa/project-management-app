import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Page404.scss';

function Page404() {
  const navigate = useNavigate();

  return (
    <div className="page404">
      <h2>404. Page not found</h2>
      <button onClick={() => navigate(-1)}>Go back</button>
    </div>
  );
}

export default Page404;
