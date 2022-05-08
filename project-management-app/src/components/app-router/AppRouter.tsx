import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from '../../pages/login-page/LoginPage';
import MainPage from '../../pages/main-page/MainPage';
import Page404 from '../../pages/page-404/Page404';
import WelcomePage from '../../pages/welcome-page/WelcomePage';

const AppRouter = () => {
  const isAuth = false;
  const { pathname } = useLocation();

  const allowedPaths = ['/', '/login', '/main'];

  const isAllowedPath = allowedPaths.some((el) => el === pathname);

  if (isAuth && isAllowedPath)
    return (
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/main" />} />
      </Routes>
    );

  if (!isAuth && isAllowedPath)
    return (
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );

  if (!isAllowedPath)
    return (
      <Routes>
        <Route path="*" element={<Page404 />} />
      </Routes>
    );

  return null;
};

export default AppRouter;
