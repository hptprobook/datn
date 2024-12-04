import { lazy } from 'react';

export const PosPage = lazy(() => import('src/pages/pos'));
export const CheckOrderPage = lazy(() => import('src/pages/pos/orders'));
export const TrackingInventorPage = lazy(() => import('src/pages/pos/inventor'));
export const ReceiptPage = lazy(() => import('src/pages/receipts'));
// orders page
export const OrdersPage = lazy(() => import('src/pages/orders/orders'));
export const OrderDetailPage = lazy(() => import('src/pages/orders/detail'));

export const posRoute = [
  { element: <PosPage />, index: true },
  { path: '/pos/tracking-order', element: <CheckOrderPage /> },
  { path: 'inventory', element: <TrackingInventorPage /> },
  { path: 'receipts', element: <ReceiptPage /> },
  {
    path: 'orders',
    element: <OrdersPage />,
  },
  {
    path: 'orders/:id',
    element: <OrderDetailPage />,
  },
];
