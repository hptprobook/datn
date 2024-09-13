import { Helmet } from 'react-helmet-async';
import { NavUpdateView } from 'src/sections/navDashboard/edit';

// ----------------------------------------------------------------------

export default function NavUpdatePage() {
  return (
    <>
      <Helmet>
        <title> Cập nhật menu quản trị </title>
      </Helmet>
      <NavUpdateView />
    </>
  );
}
