import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../../pages/login-page/LoginPage';
import MainPage from '../../pages/main-page/MainPage';
import WelcomePage from '../../pages/welcome-page/WelcomePage';

const AppRouter = () => {
  const isAuth = false;

  return isAuth ? (
    <Routes>
      <Route path="/main" element={<MainPage />} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRouter;
