import { Helmet } from 'react-helmet-async';
import { StaticWebSettingView } from 'src/sections/settings/static-page';

// ----------------------------------------------------------------------

export default function StaticWebSettingPage() {
  return (
    <>
      <Helmet>
        <title> Quản lý trang tĩnh </title>
      </Helmet>

      <StaticWebSettingView />
    </>
  );
}
