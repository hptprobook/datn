import { Box } from '@mui/material';
import { lazy } from 'react';

export const CheckOrderPage = lazy(() => import('src/pages/pos/orders'));
export const TrackingInventorPage = lazy(() => import('src/pages/pos/inventor'));
export const posRoute = [
  { element: <Box>Tính năng đăng phát triển</Box>, index: true },
  { path: 'orders', element: <CheckOrderPage /> },
  { path: 'inventory', element: <TrackingInventorPage /> },
];
