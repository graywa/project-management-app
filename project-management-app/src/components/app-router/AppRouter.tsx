import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from '../../pages/login-page/LoginPage';
import RegistrationPage from '../../pages/registration-page/RegistrationPage';
import Page404 from '../../pages/page-404/Page404';
import WelcomePage from '../../pages/welcome-page/WelcomePage';
import { useAppSelector } from '../../redux-hooks/redux-hooks';
import { lazy, Suspense } from 'react';
import PageLoader from '../page-loader/PageLoader';

const MainPage = lazy(() => import('../../pages/main-page/MainPage'));
const BoardPage = lazy(() => import('../../pages/board-page/BoardPage'));
const ProfilePage = lazy(() => import('../../pages/profile/Profile'));

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
        <Route
          path="/main"
          element={
            <Suspense fallback={<PageLoader title="Main" />}>
              <MainPage />
            </Suspense>
          }
        />
        <Route
          path="/board/:id"
          element={
            <Suspense fallback={<PageLoader title="board" />}>
              <BoardPage />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<PageLoader title="profile" />}>
              <ProfilePage />
            </Suspense>
          }
        />
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
