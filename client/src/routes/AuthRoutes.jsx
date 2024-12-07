import { Outlet, useNavigate, useNavigationType } from 'react-router-dom';
import useCheckAuth from '~/customHooks/useCheckAuth';
import ForgotPasswordPage from '~/pages/Auth/ForgotPasswordPage';
import LoginPage from '~/pages/Auth/LoginPage';
import RegisterPage from '~/pages/Auth/RegisterPage';

const AuthWrapper = () => {
  const { isAuthenticated } = useCheckAuth();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  if (isAuthenticated) {
    if (navigationType === 'PUSH') {
      navigate(-1);
    } else {
      navigate('/');
    }
    return null;
  }

  return <Outlet />;
};

const AuthRoutes = {
  path: '/tai-khoan',
  element: <AuthWrapper />,
  children: [
    {
      path: 'dang-ky',
      element: <RegisterPage />,
    },
    {
      path: 'dang-nhap',
      element: <LoginPage />,
    },
    {
      path: 'quen-mat-khau',
      element: <ForgotPasswordPage />,
    },
  ],
};

export default AuthRoutes;
