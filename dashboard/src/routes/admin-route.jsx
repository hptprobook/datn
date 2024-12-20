import SettingLayout from 'src/layouts/settings';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { lazy } from 'react';

export const AppPage = lazy(() => import('src/pages/app'));
// product page
export const ProductsPage = lazy(() => import('src/pages/products/products'));
export const CreateProductPage = lazy(() => import('src/pages/products/create'));
export const DetailProductPage = lazy(() => import('src/pages/products/detail'));
export const ExportProductPage = lazy(() => import('src/pages/products/export'));
// category page
export const CategoryPage = lazy(() => import('src/pages/categories/category'));
export const CreateCategoryPage = lazy(() => import('src/pages/categories/create'));
export const EditCategoryPage = lazy(() => import('src/pages/categories/detail'));

// settings page

export const StoreView = lazy(() => import('src/pages/settings/store'));
// staff page
export const StaffsSettingPage = lazy(() => import('src/pages/settings/staffs'));
export const StaffCreatePage = lazy(() => import('src/pages/settings/staffs/create'));
export const StaffEditPage = lazy(() => import('src/pages/settings/staffs/edit'));
// static page
export const StaticWebSettingPage = lazy(() => import('src/pages/settings/static-pages'));
export const StaticWebCreatePage = lazy(() => import('src/pages/settings/static-pages/create'));
export const StaticWebEditPage = lazy(() => import('src/pages/settings/static-pages/edit'));
// warehouse page
export const WarehousePage = lazy(() => import('src/pages/warehouse/warehouse'));
export const WarehouseCreatePage = lazy(() => import('src/pages/warehouse/create'));
export const WarehouseEditPage = lazy(() => import('src/pages/warehouse/edit'));
export const ReceiptWareHousePage = lazy(() => import('src/pages/receipts/warehouse'));
export const ReceiptWareHouseCreatePage = lazy(() => import('src/pages/receipts/warehouse-create'));
// lịch làm việc
export const TimetablePage = lazy(() => import('src/pages/timetables'));
export const VariantsPage = lazy(() => import('src/pages/variants'));
export const VariantsImportPage = lazy(() => import('src/pages/variants/creates'));
// supplier page
export const SuppliersPage = lazy(() => import('src/pages/suppliers/suppliers'));
export const SupplierCreatePage = lazy(() => import('src/pages/suppliers/create'));
export const SupplierDetailPage = lazy(() => import('src/pages/suppliers/detail'));

// brand page
export const BrandsPage = lazy(() => import('src/pages/brands/brands'));
export const BrandCreatePage = lazy(() => import('src/pages/brands/create'));
export const BrandDetailPage = lazy(() => import('src/pages/brands/detail'));
export const adminRoute = [
  {
    index: true,
    element: <AppPage />,
  },
  {
    path: 'products',
    element: <ProductsPage />,
  },
  {
    path: 'products/create',
    element: <CreateProductPage />,
  },
  {
    path: 'products/:id',
    element: <DetailProductPage />,
  },
  {
    path: 'products/export',
    element: <ExportProductPage />,
  },

  {
    path: 'categories',
    element: <CategoryPage />,
  },
  {
    path: 'categories/create',
    element: <CreateCategoryPage />,
  },
  {
    path: 'categories/:id',
    element: <EditCategoryPage />,
  },
  {
    path: 'warehouse',
    element: <WarehousePage />,
  },
  {
    path: 'warehouse/create',
    element: <WarehouseCreatePage />,
  },
  {
    path: 'warehouse/receipts',
    element: <ReceiptWareHousePage />,
  },
  {
    path: 'warehouse/receipts/create',
    element: <ReceiptWareHouseCreatePage />,
  },
  {
    path: 'warehouse/:id',
    element: <WarehouseEditPage />,
  },

  {
    path: 'suppliers',
    element: <SuppliersPage />,
  },
  {
    path: 'suppliers/create',
    element: <SupplierCreatePage />,
  },
  {
    path: 'suppliers/:id',
    element: <SupplierDetailPage />,
  },
  {
    path: 'brands',
    element: <BrandsPage />,
  },
  {
    path: 'brands/create',
    element: <BrandCreatePage />,
  },
  {
    path: 'brands/:id',
    element: <BrandDetailPage />,
  },
  {
    path: 'variants',
    element: <VariantsPage />,
  },
  {
    path: 'variants/excel',
    element: <VariantsImportPage />,
  },
  {
    path: 'timetables',
    element: <TimetablePage />,
  },
  {
    path: 'settings',
    element: (
      <SettingLayout>
        <Outlet />
      </SettingLayout>
    ),
    children: [
      {
        index: true,
        element: <StoreView />,
      },
      {
        path: 'branches',
        element: (
          <Box>
            <p>Chức năng đăng được phát triển</p>
          </Box>
        ),
      },
      {
        path: 'staffs',
        element: <StaffsSettingPage />,
      },
      {
        path: 'staffs/create',
        element: <StaffCreatePage />,
      },
      {
        path: 'staffs/:id',
        element: <StaffEditPage />,
      },
      {
        path: 'static-pages',
        element: <StaticWebSettingPage />,
      },
      {
        path: 'static-pages/create',
        element: <StaticWebCreatePage />,
      },
      {
        path: 'static-pages/:id',
        element: <StaticWebEditPage />,
      },
      {
        path: 'notifications',
        element: (
          <Box>
            <p>Chức năng đăng được phát triển</p>
          </Box>
        ),
      },
      {
        path: 'history',
        element: (
          <Box>
            <p>Chức năng đăng được phát triển</p>
          </Box>
        ),
      },
    ],
  },
];
