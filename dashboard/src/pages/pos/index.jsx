import { Helmet } from 'react-helmet-async';

// eslint-disable-next-line import/named
import { PosView } from 'src/sections/pos';

// ----------------------------------------------------------------------

export default function DetailOrderPage() {
  return (
    <>
      <Helmet>
        <title> Bán hàng</title>
      </Helmet>
      <PosView />
    </>
  );
}
