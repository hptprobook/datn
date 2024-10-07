import { Helmet } from 'react-helmet-async';
import { DetailProductView } from 'src/sections/products/detail';

// ----------------------------------------------------------------------

export default function DetailProductPage() {
  return (
    <>
      <Helmet>
        <title>Chi tiết sản phẩm</title>
      </Helmet>

      <DetailProductView />
    </>
  );
}
