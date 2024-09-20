import { Helmet } from 'react-helmet-async';
import { CreateCouponView } from 'src/sections/coupons/create';

// eslint-disable-next-line import/named

// ----------------------------------------------------------------------

export default function CreateCouponPage() {
  return (
    <>
      <Helmet>
        <title> Tạo giảm giá</title>
      </Helmet>
      <CreateCouponView />
    </>
  );
}
