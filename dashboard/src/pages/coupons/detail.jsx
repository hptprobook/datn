import { Helmet } from 'react-helmet-async';
import { DetailCouponView } from 'src/sections/coupons/detail';

// eslint-disable-next-line import/named

// ----------------------------------------------------------------------

export default function CouponDetailPage() {
  return (
    <>
      <Helmet>
        <title> Chi tiết </title>
      </Helmet>
      <DetailCouponView />
    </>
  );
}
