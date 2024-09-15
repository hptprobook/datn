import { Helmet } from 'react-helmet-async';
import { NavCreatedView } from 'src/sections/navDashboard/create';

// ----------------------------------------------------------------------

export default function NavDashBoardPage() {
  return (
    <>
      <Helmet>
        <title> Tạo menu quản trị </title>
      </Helmet>
      <NavCreatedView />
    </>
  );
}
