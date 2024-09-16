import { Helmet } from 'react-helmet-async';
import { SeoConfigView } from 'src/sections/settings/seo-config';

// ----------------------------------------------------------------------

export default function SeoConfigPage() {
  return (
    <>
      <Helmet>
        <title> Cài đặt SEO </title>
      </Helmet>
      <SeoConfigView />
    </>
  );
}
