import { Navigate } from 'react-router-dom';
import useCheckAuth from '~/customHooks/useCheckAuth';

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useCheckAuth();

  return isAuthenticated ? children : <Navigate to="/tai-khoan/dang-nhap" />;
}
