import { Helmet } from 'react-helmet-async';
import { StaticWebEditView } from 'src/sections/settings/static-page';

// ----------------------------------------------------------------------

export default function StaticWebEditPage() {
  return (
    <>
      <Helmet>
        <title> Chỉnh sửa trang tĩnh </title>
      </Helmet>

      <StaticWebEditView />
    </>
  );
}
