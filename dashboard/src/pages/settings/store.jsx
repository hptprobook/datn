import { Helmet } from 'react-helmet-async';
import { StoreView } from 'src/sections/settings/store';

// ----------------------------------------------------------------------

export default function StorePage() {
  return (
    <>
      <Helmet>
        <title> Menu quản trị </title>
      </Helmet>

      <StoreView />
    </>
  );
}
