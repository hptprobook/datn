import { Helmet } from 'react-helmet-async';
import { StoreView } from 'src/sections/settings/store';

// ----------------------------------------------------------------------

export default function StorePage() {
  return (
    <>
      <Helmet>
        <title> Thông tin cửa hàng </title>
      </Helmet>

      <StoreView />
    </>
  );
}
