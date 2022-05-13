import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from '../../pages/login-page/LoginPage';
import MainPage from '../../pages/main-page/MainPage';
import Page404 from '../../pages/page-404/Page404';
import Profile from '../../pages/profile/Profile';
import WelcomePage from '../../pages/welcome-page/WelcomePage';
import { useAppSelector } from '../../redux-hooks/redux-hooks';

const AppRouter = () => {
  const { pathname } = useLocation();
  const { isAuth } = useAppSelector((state) => state.auth);

  const allowedPaths = ['/', '/login', '/main', '/profile'];

  const isAllowedPath = allowedPaths.some((el) => el === pathname);

  if (isAuth && isAllowedPath)
    return (
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
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
