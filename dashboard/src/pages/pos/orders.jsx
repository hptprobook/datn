import { Helmet } from 'react-helmet-async';
import { CheckOrderView } from 'src/sections/pos';

// ----------------------------------------------------------------------

export default function CheckOrderPage() {
  return (
    <>
      <Helmet>
        <title> Tra cứu đơn hàng</title>
      </Helmet>
      <CheckOrderView />
    </>
  );
}
