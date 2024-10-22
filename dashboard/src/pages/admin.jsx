import { Helmet } from 'react-helmet-async';
import AdminView from 'src/sections/admin/view/app-view';

// ----------------------------------------------------------------------

export default function AdminPage() {
  return (
    <>
      <Helmet>
        <title>BMT Life - Trang quản lý </title>
      </Helmet>

      <AdminView />
    </>
  );
}
