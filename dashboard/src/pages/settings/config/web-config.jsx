import { Helmet } from 'react-helmet-async';
import { WebConfigView } from 'src/sections/settings/web-config';

// ----------------------------------------------------------------------

export default function NavDashBoardPage() {
  return (
    <>
      <Helmet>
        <title> Cài đặt trang web </title>
      </Helmet>
      <WebConfigView />
    </>
  );
}
