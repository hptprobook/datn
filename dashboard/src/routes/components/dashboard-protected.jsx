import { PropTypes } from 'prop-types';
import { Navigate } from 'react-router-dom';

import { useAuth } from 'src/hooks/useAuth';


export const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
