import { Helmet } from 'react-helmet-async';

// eslint-disable-next-line import/named
import { DetailOrderView } from 'src/sections/orders/detail';

// ----------------------------------------------------------------------

export default function DetailOrderPage() {
  return (
    <>
      <Helmet>
        <title> Chi tiết đơn hàng</title>
      </Helmet>
      <DetailOrderView />
    </>
  );
}
