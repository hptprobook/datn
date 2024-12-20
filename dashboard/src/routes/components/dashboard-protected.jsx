import { PropTypes } from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { useAuth } from 'src/hooks/useAuth';
import { getMe } from 'src/redux/slices/authSlice';

export const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  const statusMe = useSelector((state) => state.auth.statusMe);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.auth);
  const { pathname } = window.location;
  useEffect(() => {
    if (auth === null && statusMe === 'idle') {
      dispatch(getMe()).then((result) => {
        if (result.type === 'auth/me/fulfilled') {
          localStorage.setItem('token', result.payload.token);
        }
      });
    }
  }, [dispatch, statusMe, auth]);
  if (!token) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  if (pathname.includes('admin') && auth?.role === 'staff') {
    return <Navigate to="/" />;
  }
  if (auth === null && statusMe === 'successful') {
    return <Navigate to="/login" />;
  }
  return children;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
