import { Helmet } from 'react-helmet-async';
import { StaticWebCreateView } from 'src/sections/settings/static-page';

// ----------------------------------------------------------------------

export default function StaticWebCreatePage() {
  return (
    <>
      <Helmet>
        <title> Tạo trang tĩnh </title>
      </Helmet>

      <StaticWebCreateView />
    </>
  );
}
