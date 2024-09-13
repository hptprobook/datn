import { Helmet } from 'react-helmet-async';
import { NavDashboardView } from 'src/sections/navDashboard/view';


// ----------------------------------------------------------------------

export default function NavDashBoardPage() {
  return (
    <>
      <Helmet>
        <title> Menu quản trị </title>
      </Helmet>

      <NavDashboardView />
    </>
  );
}
