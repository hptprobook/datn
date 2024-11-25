import { lazy } from 'react';

export const PosPage = lazy(() => import('src/pages/pos'));
export const CheckOrderPage = lazy(() => import('src/pages/pos/orders'));
export const TrackingInventorPage = lazy(() => import('src/pages/pos/inventor'));
export const ReceiptPage = lazy(() => import('src/pages/receipts'));
export const posRoute = [
  { element: <PosPage />, index: true },
  { path: 'orders', element: <CheckOrderPage /> },
  { path: 'inventory', element: <TrackingInventorPage /> },
  { path: 'receipts', element: <ReceiptPage /> },
];
