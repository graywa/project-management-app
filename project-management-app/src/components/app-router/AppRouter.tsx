import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from '../../pages/login-page/LoginPage';
import RegistrationPage from '../../pages/registration-page/RegistrationPage';
import MainPage from '../../pages/main-page/MainPage';
import Page404 from '../../pages/page-404/Page404';
import Profile from '../../pages/profile/Profile';
import WelcomePage from '../../pages/welcome-page/WelcomePage';
import BoardPage from '../../pages/board-page/BoardPage';
import { useAppSelector } from '../../redux-hooks/redux-hooks';

const AppRouter = () => {
  let { pathname } = useLocation();
  const { isAuth } = useAppSelector((state) => state.auth);
  if (pathname.slice(0, 6) === '/board') pathname = '/board';

  const allowedPaths = ['/', '/login', '/registration', '/main', '/profile', '/board'];

  const isAllowedPath = allowedPaths.some((el) => el === pathname);

  if (isAuth && isAllowedPath)
    return (
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/board/:id" element={<BoardPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/main" />} />
      </Routes>
    );

  if (!isAuth && isAllowedPath)
    return (
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
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
