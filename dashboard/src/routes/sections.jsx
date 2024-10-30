import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import { Box, LinearProgress, linearProgressClasses } from '@mui/material';
import DashboardLayout from 'src/layouts/dashboard';
import AdminLayout from 'src/layouts/admin';
import { ProtectedRoute } from './components/dashboard-protected';
import { adminRoute } from './admin-route';
import { dashboardRoute } from './dashboard-route';
// ----------------------------------------------------------------------
// login page
export const LoginPage = lazy(() => import('src/pages/login'));
// ----------------------------------------------------------------------
export const Page404 = lazy(() => import('src/pages/page-not-found'));

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => (theme.palette.mode === 'light' ? 'primary.lighter' : 'primary.dark'),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export default function Router() {
  return useRoutes([
    {
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: dashboardRoute,
    },
    {
      path: 'admin',
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </AdminLayout>
        </ProtectedRoute>
      ),
      children: adminRoute,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
