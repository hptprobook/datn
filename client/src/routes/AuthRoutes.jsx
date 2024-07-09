import LoginPage from '~/pages/Auth/LoginPage';
import RegisterPage from '~/pages/Auth/RegisterPage';

const AuthRoutes = {
  path: '/tai-khoan',
  children: [
    {
      path: 'dang-ky',
      element: <RegisterPage />,
    },
    {
      path: 'dang-nhap',
      element: <LoginPage />,
    },
  ],
};

export default AuthRoutes;
