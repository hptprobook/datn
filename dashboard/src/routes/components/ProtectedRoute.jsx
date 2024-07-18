import { PropTypes } from 'prop-types';
import { Navigate } from 'react-router-dom';

import { useAuth } from 'src/hooks/useAuth';

import DashboardLayout from 'src/layouts/dashboard';

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
