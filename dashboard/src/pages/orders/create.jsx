import { Helmet } from 'react-helmet-async';
import { CreateOrderView } from 'src/sections/orders/create';

// eslint-disable-next-line import/named
// ----------------------------------------------------------------------

export default function CreateOrderPage() {
  return (
    <>
      <Helmet>
        <title> Tạo đơn hàng</title>
      </Helmet>
      <CreateOrderView />
    </>
  );
}
