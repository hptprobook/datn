import { Helmet } from 'react-helmet-async';
import { StoreView } from 'src/sections/settings/store';
// import { WebConfigView } from 'src/sections/settings/web-config';

// ----------------------------------------------------------------------

export default function WebConfigPage() {
  return (
    <>
      <Helmet>
        <title> Cài đặt trang web </title>
      </Helmet>
      <StoreView />
    </>
  );
}
